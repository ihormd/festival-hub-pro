
-- Update festival dates and key copy
UPDATE public.site_settings SET value = 'July 12–13, 2026', updated_at = now() WHERE key = 'festival_dates';
INSERT INTO public.site_settings (key, value) VALUES ('festival_dates', 'July 12–13, 2026') ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = now();

UPDATE public.site_settings SET value = 'Two days of music, dance, food, craft, and community at Fireman''s Park.', updated_at = now() WHERE key = 'hero_subtitle';
INSERT INTO public.site_settings (key, value) VALUES ('hero_subtitle', 'Two days of music, dance, food, craft, and community at Fireman''s Park.') ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = now();

-- Replace board of directors
UPDATE public.team_members SET active = false;
INSERT INTO public.team_members (name, role, sort_order, active) VALUES
  ('Iryna Lohazyak', 'President', 1, true),
  ('Irek Lohazyak', 'Vice President', 2, true),
  ('Olena Donenko', 'Secretary', 3, true),
  ('Matvii Troitskyi', 'Grants Manager', 4, true),
  ('Ihor Dorosh', 'Treasurer', 5, true);
