
# NUFF 2026 — Full Transformation Plan

Massive scope, so I'll ship in 4 ordered phases. Each phase is independently testable. I'll do them all in this session unless you tell me to stop after a phase.

## Phase 1 — Rebrand + Dynamic Content Foundation

**Branding**
- Header/Footer: replace "Festua" text with `nuff-logo.png` (already saved).
- Rename every "Festua" reference to **NUFF — Niagara Ukrainian Family Festival**.
- Update color tokens in `src/styles.css`:
  - Primary → Ukrainian Royal Blue `#0057B7`
  - Secondary/Accent → Sunflower Yellow `#FFD700`
- Update page titles, meta descriptions, og tags.

**New Supabase tables** (one migration)
- `team_members` — name, role, bio, image_url, sort_order
- `sponsors` — name, logo_url, website_url, level (`platinum|gold|silver|bronze`), sort_order
- `site_settings` — key/value (festival_dates, location_address, about_text, contact_email, contact_phone, hero_tagline…)
- Seed: 6 board members (Irena Shantz, Michael Saciuk, Oksana Fischer, Luba Novosad, Stefan Fischer, Andrew Novosad), site_settings defaults, location = Fireman's Park, 2275 Dorchester Road, Niagara Falls.
- New storage buckets: `team-photos` (public), `sponsor-logos` already exists.
- RLS: public read for all 3 tables; admin-only write.

**Replace hardcoded content** on landing, festival-info, sponsors, entertainment with DB reads.

## Phase 2 — New Pages + Animations

- `/about` — mission + history of the Niagara Ukrainian community, board grid pulled from `team_members`.
- `/contact` — functional form (writes to a `contact_messages` table), Google Maps iframe for Fireman's Park.
- Homepage: add **"Our Partners"** grid before footer (Platinum logos larger).
- Homepage: add **Board of Directors** section.
- Animations with `framer-motion`:
  - Hero logo fade-in + scale 1→1.05 over 0.8s
  - Staggered slide-up on Board cards + Merch grid (on scroll)
  - Available map spots: subtle pulse + hover brighten
  - All CTAs: `whileTap={{ scale: 0.95 }}`

## Phase 3 — Vendor Map Redesign + Sponsors Page

- `/vendors` layout: map left, scrollable sidebar list right. Click sidebar → highlight + open spot dialog. Real-time status already wired.
- `/sponsors` rebuilt to read from DB, grouped by level (Platinum → Gold → Silver), with "Partner with NUFF 2026" CTA → `/contact`.

## Phase 4 — Admin CMS (`/admin`)

Tabs added to existing admin (already gated by `isAdmin`):
- **Merch Manager** — CRUD `merch_products` + image upload to `merch-images`.
- **Team Manager** — CRUD `team_members` + photo upload to `team-photos`.
- **Sponsors Manager** — CRUD `sponsors` + logo upload to `sponsor-logos`.
- **Site Settings** — form for dates, location, about text, hero tagline.
- **Vendor Leads** — already exists; add map-bookings view + manual spot status override.
- Existing application approvals stay.

## Phase 5 — Cart + Checkout (light)

- Cart drawer with LocalStorage persistence is already in `cart-store.ts`. I'll wire a `CartDrawer` UI + checkout button.
- "Buy" / Checkout: since you previously declined Stripe upgrade, I'll keep checkout **Stripe-ready** — a `createCheckoutSession` server fn stub that returns a friendly "Payments coming soon" toast and writes a pending `merch_orders` row. When you're ready to enable Stripe (either Lovable's built-in or your own keys), it's a one-file swap.

## What I need to confirm before I start

1. **Payments**: stay with the Stripe-ready stub for now, or do you want me to wire your own Stripe keys (BYOK)? If BYOK, have your `STRIPE_SECRET_KEY` ready.
2. **Board photos**: I don't have headshots. OK to use stylized placeholder avatars (initials on brand-colored circles) that you replace via the admin panel later?
3. **About page copy**: write a respectful generic "Niagara Ukrainian community mission/history" draft you can edit in Site Settings, or do you have copy to paste in?
4. **Order**: ship all phases this session, or pause after Phase 1 (rebrand + dynamic data) for review?

Reply with answers (or just "go with your defaults, all phases") and I'll execute.
