import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export type SiteSettings = Record<string, string>;

const DEFAULTS: SiteSettings = {
  festival_name: "Niagara Ukrainian Family Festival",
  festival_short_name: "NUFF",
  festival_dates: "July 12–13, 2026",
  festival_year: "2026",
  location_name: "Fireman's Park",
  location_address: "2275 Dorchester Road, Niagara Falls, ON",
  hero_tagline: "A celebration of Ukrainian heritage in the heart of Niagara.",
  hero_subtitle: "Two days of music, dance, food, craft, and community at Fireman's Park.",
  about_mission: "",
  about_history: "",
  contact_email: "info@nuff.ca",
  contact_phone: "",
  google_maps_embed: "",
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
