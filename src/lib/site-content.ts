import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export type SiteSettings = Record<string, string>;

export const DEFAULTS: SiteSettings = {
  // General
  festival_name: "Niagara Ukrainian Family Festival",
  festival_short_name: "NUFF",
  festival_dates: "July 11–12, 2026",
  festival_year: "2026",
  location_name: "Fireman's Park",
  location_address: "2275 Dorchester Road, Niagara Falls, ON",
  hero_tagline: "A celebration of Ukrainian heritage in the heart of Niagara.",
  hero_subtitle: "Two days of music, dance, food, craft, and community at Fireman's Park.",
  about_mission: "",
  about_history: "",
  contact_email: "info@niagarka.ca",
  contact_phone: "",
  google_maps_embed: "",

  // Header
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

  // Footer
  footer_tagline: "A celebration of Ukrainian heritage in the heart of Niagara.",
  footer_col1_title: "Festival",
  footer_col2_title: "Get involved",
  footer_copyright: "Niagara Ukrainian Family Festival. All rights reserved.",
  footer_contact_display: "info@niagarka.ca · Niagara Falls, Ontario 🇨🇦 🇺🇦",

  // SEO
  seo_title: "NUFF — Niagara Ukrainian Family Festival",
  seo_description: "A celebration of Ukrainian heritage in the heart of Niagara.",
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
