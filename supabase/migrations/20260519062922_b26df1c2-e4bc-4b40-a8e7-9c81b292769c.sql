
-- ============ 1. Admin grant ============
INSERT INTO public.user_roles (user_id, role)
SELECT id, 'admin'::app_role
FROM auth.users
WHERE email = 'ihor.m.dorosh@gmail.com'
ON CONFLICT (user_id, role) DO NOTHING;

-- ============ 2. Festival schedule ============
DO $$ BEGIN
  CREATE TYPE festival_day AS ENUM ('saturday','sunday');
EXCEPTION WHEN duplicate_object THEN null; END $$;

CREATE TABLE IF NOT EXISTS public.festival_schedule (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  day festival_day NOT NULL,
  start_time time NOT NULL,
  end_time time,
  title text NOT NULL,
  description text,
  area text,
  sort_order int NOT NULL DEFAULT 0,
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.festival_schedule ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS schedule_public_read ON public.festival_schedule;
CREATE POLICY schedule_public_read ON public.festival_schedule FOR SELECT USING (active);
DROP POLICY IF EXISTS schedule_admin_all ON public.festival_schedule;
CREATE POLICY schedule_admin_all ON public.festival_schedule FOR ALL
  USING (has_role(auth.uid(),'admin')) WITH CHECK (has_role(auth.uid(),'admin'));

DROP TRIGGER IF EXISTS festival_schedule_set_updated ON public.festival_schedule;
CREATE TRIGGER festival_schedule_set_updated BEFORE UPDATE ON public.festival_schedule
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ============ 3. Vendor bookings ============
DO $$ BEGIN
  CREATE TYPE payment_method AS ENUM ('stripe','etransfer');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE TYPE booking_status AS ENUM ('pending','paid','expired','cancelled');
EXCEPTION WHEN duplicate_object THEN null; END $$;

CREATE TABLE IF NOT EXISTS public.vendor_bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  spot_id uuid NOT NULL REFERENCES public.vendor_spots(id) ON DELETE CASCADE,
  order_number text NOT NULL UNIQUE,
  payment_method payment_method NOT NULL,
  status booking_status NOT NULL DEFAULT 'pending',
  amount_cents int NOT NULL,
  pending_until timestamptz,
  contact_name text,
  contact_email text NOT NULL,
  contact_phone text,
  business_name text,
  stripe_session_id text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.vendor_bookings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS vb_own_select ON public.vendor_bookings;
CREATE POLICY vb_own_select ON public.vendor_bookings FOR SELECT
  USING (auth.uid() = user_id OR has_role(auth.uid(),'admin'));
DROP POLICY IF EXISTS vb_admin_all ON public.vendor_bookings;
CREATE POLICY vb_admin_all ON public.vendor_bookings FOR ALL
  USING (has_role(auth.uid(),'admin')) WITH CHECK (has_role(auth.uid(),'admin'));

DROP TRIGGER IF EXISTS vendor_bookings_set_updated ON public.vendor_bookings;
CREATE TRIGGER vendor_bookings_set_updated BEFORE UPDATE ON public.vendor_bookings
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ============ 4. RPCs ============
CREATE OR REPLACE FUNCTION public.book_vendor_spot(
  _spot_id uuid,
  _method payment_method,
  _contact_name text,
  _contact_email text,
  _contact_phone text,
  _business_name text
)
RETURNS public.vendor_bookings
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  _spot vendor_spots;
  _order text;
  _booking vendor_bookings;
  _uid uuid := auth.uid();
BEGIN
  IF _uid IS NULL THEN
    RAISE EXCEPTION 'Authentication required';
  END IF;

  SELECT * INTO _spot FROM vendor_spots WHERE id = _spot_id FOR UPDATE;
  IF NOT FOUND THEN RAISE EXCEPTION 'Spot not found'; END IF;
  IF _spot.status <> 'available' THEN RAISE EXCEPTION 'Spot is no longer available'; END IF;

  _order := 'NUFF-' || to_char(now(),'YYMMDD') || '-' || upper(substr(replace(gen_random_uuid()::text,'-',''),1,5));

  INSERT INTO vendor_bookings(user_id, spot_id, order_number, payment_method, amount_cents,
    pending_until, contact_name, contact_email, contact_phone, business_name)
  VALUES (_uid, _spot.id, _order, _method, _spot.price_cents,
          CASE WHEN _method='etransfer' THEN now() + interval '24 hours' ELSE now() + interval '1 hour' END,
          _contact_name, _contact_email, _contact_phone, _business_name)
  RETURNING * INTO _booking;

  UPDATE vendor_spots
    SET status='pending', vendor_user_id=_uid, pending_until=_booking.pending_until
    WHERE id=_spot.id;

  RETURN _booking;
END $$;

CREATE OR REPLACE FUNCTION public.confirm_vendor_booking(_booking_id uuid)
RETURNS public.vendor_bookings
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
DECLARE _b vendor_bookings;
BEGIN
  IF NOT has_role(auth.uid(),'admin') THEN
    RAISE EXCEPTION 'Admin only';
  END IF;
  UPDATE vendor_bookings SET status='paid', pending_until=NULL WHERE id=_booking_id RETURNING * INTO _b;
  IF NOT FOUND THEN RAISE EXCEPTION 'Booking not found'; END IF;
  UPDATE vendor_spots SET status='occupied', pending_until=NULL WHERE id=_b.spot_id;
  RETURN _b;
END $$;

CREATE OR REPLACE FUNCTION public.release_expired_vendor_holds()
RETURNS int
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
DECLARE _count int;
BEGIN
  WITH expired AS (
    UPDATE vendor_bookings
       SET status='expired'
     WHERE status='pending' AND pending_until IS NOT NULL AND pending_until < now()
    RETURNING spot_id
  )
  UPDATE vendor_spots s SET status='available', vendor_user_id=NULL, pending_until=NULL
    FROM expired e WHERE s.id = e.spot_id AND s.status='pending';
  GET DIAGNOSTICS _count = ROW_COUNT;
  RETURN _count;
END $$;

-- ============ 5. Cron job ============
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Schedule release every 10 minutes (idempotent)
DO $$
DECLARE _jid int;
BEGIN
  SELECT jobid INTO _jid FROM cron.job WHERE jobname='release-expired-vendor-holds';
  IF _jid IS NOT NULL THEN PERFORM cron.unschedule(_jid); END IF;
  PERFORM cron.schedule('release-expired-vendor-holds','*/10 * * * *',
    $cron$ SELECT public.release_expired_vendor_holds(); $cron$);
END $$;

-- ============ 6. Seed festival_schedule sample ============
INSERT INTO public.festival_schedule (day, start_time, end_time, title, description, area, sort_order)
SELECT 'saturday','11:00','11:30','Opening Ceremony','Welcome from NUFF organizers and the City of Niagara Falls','Main Stage',10
WHERE NOT EXISTS (SELECT 1 FROM public.festival_schedule);

INSERT INTO public.festival_schedule (day, start_time, end_time, title, description, area, sort_order)
VALUES
  ('saturday','12:00','13:00','Traditional Dance Showcase','Veselka & Yavir ensembles','Main Stage',20),
  ('saturday','14:00','15:30','Headliner Performance','Featured Ukrainian artist','Main Stage',30),
  ('saturday','16:00','17:00','Folk Music Set','Live bandura & vocals','Main Stage',40),
  ('sunday','11:30','12:00','Sunday Welcome','Day two opening','Main Stage',10),
  ('sunday','12:30','13:30','Family Programming','Kids workshop & sing-along','Main Stage',20),
  ('sunday','14:00','15:30','Closing Concert','Grand finale headliner','Main Stage',30)
ON CONFLICT DO NOTHING;
