import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";

type Sponsor = { id: string; name: string; logo_url: string | null; website_url: string | null; level: "platinum"|"gold"|"silver"|"bronze"; sort_order: number };

export function PartnersStrip() {
  const [sponsors, setSponsors] = useState<Sponsor[]>([]);
  useEffect(() => {
    supabase.from("sponsors").select("*").eq("active", true).order("sort_order").then(({ data }) => setSponsors((data as Sponsor[]) ?? []));
  }, []);

  const sized = (l: Sponsor["level"]) =>
    l === "platinum" ? "h-24 sm:h-28" :
    l === "gold" ? "h-20 sm:h-24" :
    "h-16 sm:h-20";

  return (
    <section className="bg-[color:var(--cream)] border-y border-[color:var(--border)]">
      <div className="container-page py-16 lg:py-20">
        <div className="flex flex-wrap items-end justify-between gap-4 mb-10">
          <div>
            <p className="eyebrow">Our Partners</p>
            <h2 className="display-lg mt-2">Powered by community.</h2>
          </div>
          <Link to="/sponsors" className="text-sm font-semibold text-[color:var(--primary)] hover:underline">
            Become a sponsor →
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 items-center">
          {sponsors.map((sp) => {
            const inner = sp.logo_url ? (
              <img src={sp.logo_url} alt={sp.name} className={`${sized(sp.level)} w-auto object-contain mx-auto grayscale hover:grayscale-0 transition`} />
            ) : (
              <div className={`${sized(sp.level)} w-full rounded-lg bg-white border border-dashed border-[color:var(--border)] grid place-items-center px-4 text-center text-xs font-semibold uppercase tracking-wider text-[color:var(--muted-foreground)]`}>
                {sp.name}
              </div>
            );
            return sp.website_url ? (
              <a key={sp.id} href={sp.website_url} target="_blank" rel="noopener noreferrer" className="block">{inner}</a>
            ) : (
              <div key={sp.id}>{inner}</div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
