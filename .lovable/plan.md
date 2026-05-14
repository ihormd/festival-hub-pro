
# Festua.ca — Festival Management Platform

A modern, mobile-first festival site inspired by ukrainianfestival.com, with automation it doesn't have: real-time vendor spot booking, online registrations, merch store, and an admin dashboard. Built with React + TanStack Start + Tailwind + Lovable Cloud (Supabase) + Stripe.

## Phase 1 — Foundations

**Enable Lovable Cloud** (Supabase auth + DB + storage) and **Lovable Payments (Stripe)**. Both are required up-front.

**Design system** in `src/styles.css`:
- Ukrainian-Canadian palette: deep wheat gold + sky blue accents on warm off-white, with a modern "editorial Web3" feel (generous whitespace, large display type, subtle gradients/glow).
- Typography pair: serif display headings + clean sans body.
- Reusable button/card variants, semantic tokens only.

**Database schema (migrations):**
- `profiles` (id → auth.users, full_name, phone, locale)
- `user_roles` + `app_role` enum (`admin`, `vendor`, `artist`, `volunteer`, `donor`) with `has_role()` security-definer fn
- `vendor_applications` (status, business info, doc URLs, requested_spot_id)
- `artist_applications` (portfolio_links[], tech_rider_url, stage_preference, status)
- `volunteer_applications` (interests[], shift_ids[], status)
- `sponsorships` (tier, amount, company, stripe_session_id, status)
- `vendor_spots` (id, code, label, price, x/y/path SVG coords, status: available|pending|occupied, vendor_id, pending_until)
- `volunteer_shifts` (area, starts_at, ends_at, capacity)
- `merch_products` (managed via Stripe sync), `merch_orders`, `merch_order_items`
- Storage buckets: `vendor-docs` (private), `artist-riders` (private), `merch-images` (public)
- RLS on every table; admin bypass via `has_role(auth.uid(),'admin')`

## Phase 2 — Public Site (inspired by ukrainianfestival.com)

Routes (each its own file with proper `head()` SEO):
- `/` Landing — hero with festival mark, dates, CTA, highlights, sponsors strip
- `/festival-info` — schedule, location, FAQ
- `/entertainment` — lineup grid + artist detail
- `/vendors` — info + link to map + apply
- `/volunteers` — info + apply
- `/sponsors` — tiers + donate
- `/merch` — store
- `/login`, `/signup`, `/_authenticated/dashboard`, `/_authenticated/admin`

Mobile-first nav with sticky header, hamburger on small screens.

## Phase 3 — Registration Modules (4 flows)

All forms use `react-hook-form` + Zod. Submissions go through `createServerFn` with `requireSupabaseAuth`.

1. **Vendors** — business details, category, document upload (permits → `vendor-docs` bucket), pick spot from map (or admin-assigned later).
2. **Artists** — bio, portfolio links (multi), tech rider upload, stage preference, performance length.
3. **Volunteers** — interests (multi-select), pick shifts from `volunteer_shifts`.
4. **Donors/Sponsors** — tier cards (Bronze/Silver/Gold/Platinum + custom), Stripe Checkout immediately on selection.

## Phase 4 — Interactive Vendor Map (priority)

- `/vendors/map` page renders an SVG of the festival grounds. Each booth = `<path>`/`<rect>` bound to a `vendor_spots` row.
- Color logic: green=available, yellow=pending, red=occupied. Tooltip shows spot code + price.
- Click available spot → drawer with details + "Book Now" → creates Stripe Checkout session via server fn, marks spot `pending` with `pending_until = now()+15min`.
- Realtime: Supabase `postgres_changes` subscription on `vendor_spots` updates colors live for everyone.
- Stripe webhook (`/api/public/stripe-webhook`, signature-verified) flips spot to `occupied` on `checkout.session.completed`; a scheduled cleanup releases expired `pending` spots back to `available`.

## Phase 5 — Merch Store

- Grid of products from `merch_products`, detail drawer, cart in `localStorage` + Zustand-lite context.
- Stripe Checkout for cart; webhook writes `merch_orders` + items, sends receipt email via Resend (or Stripe-hosted receipts to start).

## Phase 6 — Admin Dashboard (`/_authenticated/admin`)

Admin-only (gated by `has_role`). Tabs:
- Applications (vendors / artists / volunteers) with approve/reject + notes
- Spots (manual override status, set price, edit map metadata)
- Sponsorships and merch orders (read-only with status filters)
- Users + role assignment

## Phase 7 — Auth & Security

- Email/password + Google sign-in (defaults). `/reset-password` route.
- Roles in `user_roles` table only (never on profiles).
- All write paths via server functions; RLS enforces ownership.
- Stripe webhook signature verification mandatory.
- File uploads scoped per-user via storage RLS.

## Technical notes

- TanStack Start file-based routing, `_authenticated` layout for gated routes.
- Server functions in `*.functions.ts`; admin/webhook code in server routes under `src/routes/api/public/`.
- Realtime via `supabase.channel(...).on('postgres_changes', ...)`.
- SEO: per-route `head()`, sitemap.xml + robots.txt at the end.
- Images: hero + section imagery generated with imagegen, stored in `src/assets/`.

## Delivery order

1. Enable Cloud + Stripe, design system, schema + RLS, auth pages.
2. Landing + public info routes with hero imagery.
3. Four registration flows + storage buckets.
4. Vendor map + Stripe booking + webhook + realtime.
5. Merch store + checkout + webhook.
6. Admin dashboard.
7. SEO polish (sitemap/robots/meta), QA pass.

## Scope check before I start

A few things to confirm so I build the right thing first:

1. **Festival details** — exact dates, location/address, and any existing logo or brand colors I should match? (If not, I'll use a refined Ukrainian-Canadian palette and placeholder dates you can edit.)
2. **Vendor map** — do you have a site plan / sketch of the grounds with booth numbers, or should I design a plausible layout (~30–40 spots) you can later refine?
3. **Sponsor tiers** — specific tier names + prices, or should I propose Bronze $250 / Silver $1k / Gold $5k / Platinum $15k + custom?
4. **Languages** — English only for v1, or English + Ukrainian from the start?

I'll start implementation as soon as you confirm (or say "go with your defaults"). Phase 1 (Cloud + Stripe + schema + landing) will land first so you can see the foundation before the heavier modules.
