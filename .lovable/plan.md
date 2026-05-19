## Plan — NUFF backend & CMS expansion

### 1. Dates → July 11–12, 2026
- Update `site_settings.festival_dates` value to "July 11–12, 2026".
- Code sweep replacing "July 12–13" / "July 12, July 13" / "17–19" remnants in: `volunteers.tsx`, `artists.tsx`, `festival.tsx`, `index.tsx`, `apply.volunteer.tsx`, `apply.artist.tsx`, root SEO, footer.

### 2. Grant admin to ihor.m.dorosh@gmail.com
- Look up `auth.users.id` for that email; `INSERT INTO user_roles (user_id, role) VALUES (<uid>, 'admin')` (idempotent via `ON CONFLICT`).
- `/admin` is already gated by `_authenticated` layout. Add an `isAdmin` check inside the admin route — non-admins get redirected to `/dashboard`.
- (RLS for admin tables is already wired through `has_role(auth.uid(),'admin')`.)

### 3. Public read for sponsors + merch
- DB check: existing policies `sponsors_public_read` and `merch_public_read_active` already allow anon reads of `active=true` rows. No DB change needed.
- Code check: the marquee fetch already works for anon. Verify `merch.tsx` and `PartnersStrip` are not behind an auth guard. If broken, fix at component level.

### 4. Vendor booking + Interac e-Transfer hold flow
- New migration:
  - `payment_method` enum: `stripe`, `etransfer`.
  - `vendor_bookings` table: `id`, `user_id`, `spot_id`, `order_number` (short human code), `payment_method`, `payment_status` (`pending`/`paid`/`expired`/`cancelled`), `amount_cents`, `pending_until`, `contact_*`, timestamps. RLS: own select/insert, admin all.
  - New status `pending` already exists on `vendor_spots`. Add server-side function `book_spot(spot_id, method)` (SECURITY DEFINER):
    - If `available`: create booking row, set spot to `pending`, `pending_until = now() + 24h`, return order number + instructions.
    - If `stripe`: returns Stripe checkout URL (built in step 6).
  - `confirm_vendor_booking(booking_id)` admin-only → spot `occupied`, booking `paid`.
  - pg_cron job every 5 min: release spots whose `pending_until < now()` and booking still `pending` → spot back to `available`, booking → `expired`.
- Vendor map UI:
  - Click available spot → modal asks: "Pay by card (Stripe)" or "Pay by Interac e-Transfer".
  - e-Transfer path → confirmation screen with: order #, amount, send to `info@niagarka.ca`, memo = order #, 24h deadline.
  - Pending spots become non-clickable (already filtered visually).

### 5. Festival Schedule CMS
- New `festival_schedule` table: `id`, `day` (`saturday`|`sunday`), `start_time`, `end_time`, `title`, `description`, `area`, `sort_order`, `active`. Public read; admin all.
- Public `/festival` page loads schedule and renders Saturday + Sunday columns.
- Admin tab "Schedule" with add/edit/delete.

### 6. Stripe (BYOK) for Merch + Vendor card option
- Enable BYOK Stripe integration → ask user to paste `STRIPE_SECRET_KEY`.
- Server function `createCheckoutSession({ kind: 'merch'|'vendor_booking', payload })` calls Stripe. Returns URL.
- Public webhook route `/api/public/stripe-webhook` (HMAC-verified with `STRIPE_WEBHOOK_SECRET`) marks `merch_orders.status=paid` or `vendor_bookings.payment_status=paid` + spot `occupied`.
- Apple Pay / Google Pay are automatic on Stripe Checkout.

### 7. Email notifications via Resend
- Connect Resend (standard connector) → ask for `RESEND_API_KEY`.
- Server function `sendFormNotification({ kind, data })`. From: `NUFF Notifications <onboarding@resend.dev>`. To: `niagarka@gmail.com`, CC: `ihorledger@gmail.com`. Subject prefixed `[NUFF · <kind>]`.
- Wire into: artist application, volunteer application, vendor application/booking, sponsor application, contact form. Fire-and-forget — DB insert is the source of truth.

### 8. Google Sign-In
- Call `configure_social_auth(['google'])` → uses Lovable's managed OAuth. No keys needed from user.
- `Login`/`Signup` already have the button wired through `lovable.auth.signInWithOAuth('google', ...)`. Confirm imports are correct.

### 9. Admin CMS additions
- Already exists: Vendors, Artists, Volunteers, Sponsorships, Merch, Team, Sponsors, Site Settings.
- Add tabs: **Schedule** (festival_schedule CRUD), **Vendor Bookings** (list pending + "Confirm Payment" / "Cancel" buttons), **Contact Messages** (mark handled).

### Out of scope (skipped)
- Google Sheets sync — you didn't provide a webhook URL. Easy to add later: one Make.com "Catch Webhook" + 5 lines per form.
- Custom email domain (would require DNS verification).

### Order of execution
1. Migration: admin grant + festival_schedule + vendor_bookings + payment_method enum + cron release job.
2. Date sweep + code edits.
3. Stripe BYOK enable → request key.
4. Resend connect → request key.
5. Google managed OAuth.
6. UI: vendor map booking modal, e-Transfer confirmation screen, schedule public view, admin tabs.
7. Stripe webhook + Resend notification server fns.

### Risk notes
- The Stripe webhook and Resend send both need their respective secrets before they can be tested. I'll mark them clearly and you can paste keys as we go.
- pg_cron + pg_net must be enabled (will be done in the migration).
- I will NOT touch `src/integrations/supabase/*` generated files.
