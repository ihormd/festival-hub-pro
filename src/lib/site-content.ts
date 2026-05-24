import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export type SiteSettings = Record<string, string>;

export const DEFAULTS: SiteSettings = {
  // ── General ──────────────────────────────────────────────────────────────
  festival_name: "Niagara Ukrainian Family Festival",
  festival_short_name: "NUFF",
  festival_dates: "July 11–12, 2026",
  festival_year: "2026",
  location_name: "Fireman's Park",
  location_address: "2275 Dorchester Road, Niagara Falls, ON",
  contact_email: "info@niagarka.ca",
  contact_phone: "",
  google_maps_embed: "",

  // ── SEO ──────────────────────────────────────────────────────────────────
  seo_title: "NUFF — Niagara Ukrainian Family Festival",
  seo_description: "A celebration of Ukrainian heritage in the heart of Niagara.",

  // ── Header ───────────────────────────────────────────────────────────────
  header_logo_alt: "NUFF — Niagara Ukrainian Family Festival",
  header_nav_festival: "Festival",
  header_nav_entertainment: "Entertainment",
  header_nav_merch: "Merch",
  header_nav_about: "About",
  header_nav_contact: "Contact",
  header_nav_involved_label: "Get Involved",
  header_nav_artists_label: "Artists",
  header_nav_artists_desc: "Apply to perform on stage",
  header_nav_vendors_label: "Vendors",
  header_nav_vendors_desc: "Reserve a booth on the live map",
  header_nav_volunteers_label: "Volunteers",
  header_nav_volunteers_desc: "Pick a shift, choose your role",
  header_nav_sponsors_label: "Sponsors",
  header_nav_sponsors_desc: "Partner with NUFF 2026",

  // ── Footer ───────────────────────────────────────────────────────────────
  footer_tagline: "A celebration of Ukrainian heritage in the heart of Niagara.",
  footer_col1_title: "Festival",
  footer_col2_title: "Get involved",
  footer_copyright: "Niagara Ukrainian Family Festival. All rights reserved.",
  footer_contact_display: "info@niagarka.ca · Niagara Falls, Ontario 🇨🇦 🇺🇦",

  // ── Home — Hero ──────────────────────────────────────────────────────────
  hero_tagline: "A celebration of Ukrainian heritage in the heart of Niagara.",
  hero_subtitle: "Two days of music, dance, food, craft, and community at Fireman's Park.",
  home_hero_cta_primary: "Book a Booth",
  home_hero_cta_secondary: "See the Schedule",

  // ── Home — Stats ─────────────────────────────────────────────────────────
  home_stat_1_value: "2,000+",
  home_stat_1_label: "Attendees",
  home_stat_2_value: "20+",
  home_stat_2_label: "Performers",
  home_stat_3_value: "40+",
  home_stat_3_label: "Vendors",
  home_stat_4_value: "100+",
  home_stat_4_label: "Volunteers",

  // ── Home — Pillars ───────────────────────────────────────────────────────
  home_pillars_eyebrow: "What to expect",
  home_pillars_heading: "Four pillars of the festival.",
  home_pillar_food_title: "Food & Drink",
  home_pillar_food_body: "Borsch, perogies, kovbasa, and craft beverages from local Ukrainian vendors.",
  home_pillar_music_title: "Music & Dance",
  home_pillar_music_body: "Live performances from traditional ensembles and contemporary Ukrainian artists.",
  home_pillar_culture_title: "Craft & Culture",
  home_pillar_culture_body: "Pysanka workshops, embroidery, pottery, and artisan markets.",
  home_pillar_family_title: "Family & Community",
  home_pillar_family_body: "Kids' zone, family activities, and a welcoming space for all generations.",

  // ── Home — Get Involved ──────────────────────────────────────────────────
  home_involved_eyebrow: "Get involved",
  home_involved_heading: "There's a place for everyone at NUFF.",
  home_involved_vendors_title: "Vendors",
  home_involved_vendors_body: "Reserve your booth on the live festival map. Food, retail, and sponsor spots available.",
  home_involved_artists_title: "Artists",
  home_involved_artists_body: "Apply to perform on the main stage. Traditional and contemporary acts welcome.",
  home_involved_volunteers_title: "Volunteers",
  home_involved_volunteers_body: "Pick your roles and shifts. Help create an unforgettable festival experience.",
  home_involved_sponsors_title: "Sponsors",
  home_involved_sponsors_body: "Partner with NUFF 2026. Tiered packages from Bronze to Platinum.",

  // ── About ────────────────────────────────────────────────────────────────
  about_eyebrow: "About NUFF",
  about_title: "A festival born of community.",
  about_subtitle: "Honouring Ukrainian heritage in the Niagara region — through music, food, craft, and the people who carry it forward.",
  about_mission_heading: "Our mission",
  about_mission: "",
  about_history_heading: "Our history",
  about_history: "",

  // ── Festival page ────────────────────────────────────────────────────────
  festival_page_eyebrow: "The festival",
  festival_page_title: "Niagara Ukrainian Family Festival",
  festival_page_subtitle: "Two days of music, dance, food, and tradition at Fireman's Park, Niagara Falls — July 11–12, 2026.",
  festival_mission_title: "Our Cultural Mission",
  festival_mission_body: "NUFF exists to celebrate, preserve, and share Ukrainian heritage across the Niagara region. Through music, dance, language, and craft, we create space for the Ukrainian diaspora and our neighbours of every background to gather, learn, and stand in solidarity. Every dollar raised supports cultural programming, youth ensembles, and humanitarian initiatives connected to Ukraine.",
  festival_history_title: "Festival History",
  festival_history_body: "Now in its fourth year, the Niagara Ukrainian Family Festival was founded by a coalition of community organizations, parishes, and dance schools across Niagara. From a one-day picnic, it has grown into a vibrant two-day weekend at Fireman's Park, welcoming thousands of visitors, dozens of artisans, and performers from across Canada and beyond.",
  festival_community_eyebrow: "Community",
  festival_community_title: "Rooted in the Niagara Ukrainian community.",
  festival_community_body1: "NUFF is their festival. Volunteers come from St. George's, Sts. Cyril & Methodius, and other local organizations.",
  festival_community_body2: "Newcomers from Ukraine join veteran organizers each year, and the programming reflects both deeply traditional and contemporary Ukrainian voices.",
  festival_experience_title: "The NUFF experience",
  festival_experience_items: "Live music on the main stage\nTraditional dance performances\nAuthentic Ukrainian food & drink\nArtisan craft market\nPysanka & embroidery workshops\nKids' zone & family activities",
  festival_visit_eyebrow: "Plan your visit",
  festival_visit_heading: "Everything you need to know.",
  festival_visit_dates_title: "Dates",
  festival_visit_dates_body: "July 11–12, 2026 · two-day festival.",
  festival_visit_location_title: "Location",
  festival_visit_location_body: "Fireman's Park, 2275 Dorchester Rd, Niagara Falls, ON.",
  festival_visit_hours_title: "Hours",
  festival_visit_hours_body: "Sat 11:00–22:00 · Sun 11:00–20:00.",
  festival_visit_parking_title: "Parking",
  festival_visit_parking_body: "Free public parking on-site. Reserved bays for vendors and organizers.",
  festival_visit_accessibility_title: "Accessibility",
  festival_visit_accessibility_body: "Step-free routes, accessible washrooms, designated parking near the main gate.",
  festival_visit_safety_title: "Safety",
  festival_visit_safety_body: "On-site security, first aid, and a family-friendly Kids' Zone with splash play.",
  festival_memories_eyebrow: "Memories",
  festival_memories_title: "From past festivals.",
  festival_memories_body: "Moments captured at NUFF — community, culture, and celebration.",

  // ── Entertainment ────────────────────────────────────────────────────────
  entertainment_eyebrow: "Lineup",
  entertainment_title: "One main stage. Two unforgettable days.",
  entertainment_subtitle: "Two days of live performances, workshops, and cultural showcases — July 11–12, 2026.",
  entertainment_schedule_title: "Full schedule",
  entertainment_cta_title: "Want to perform?",
  entertainment_cta_body: "We're still accepting artist applications for NUFF 2026.",

  // ── Contact ──────────────────────────────────────────────────────────────
  contact_eyebrow: "Contact",
  contact_title: "Get in touch.",
  contact_subtitle: "Questions about the festival, vendor applications, or sponsorship? We'd love to hear from you.",
};

let cache: SiteSettings | null = null;
const listeners = new Set<() => void>();

async function load() {
  const { data } = await supabase.from("site_settings").select("key,value");
  const map: SiteSettings = { ...DEFAULTS };
  (data ?? []).forEach((r: any) => { map[r.key] = r.value; });
  cache = map;
  listeners.forEach((l) => l());
}

export function useSiteSettings(): SiteSettings {
  const [v, setV] = useState<SiteSettings>(cache ?? DEFAULTS);
  useEffect(() => {
    const sub = () => setV({ ...(cache ?? DEFAULTS) });
    listeners.add(sub);
    if (!cache) load();
    else sub();
    return () => { listeners.delete(sub); };
  }, []);
  return v;
}

export async function refreshSiteSettings() { await load(); }
