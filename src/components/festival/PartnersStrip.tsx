import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";

type Sponsor = { id: string; name: string; logo_url: string | null; website_url: string | null; level: "platinum"|"gold"|"silver"|"bronze"; sort_order: number };

export function PartnersStrip() {
  const [sponsors, setSponsors] = useState<Sponsor[]>([]);
  useEffect(() => {
    supabase.from("sponsors").select("*").eq("active", true).order("sort_order").then(({ data }) => setSponsors((data as Sponsor[]) ?? []));
  }, []);

  // Duplicate the list so the marquee loops seamlessly
  const loop = sponsors.length > 0 ? [...sponsors, ...sponsors] : [];

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

        {sponsors.length === 0 ? (
          <p className="text-sm text-[color:var(--muted-foreground)]">Partner roster coming soon.</p>
        ) : (
          <div className="marquee-mask overflow-hidden">
            <div className="animate-marquee flex w-max items-center gap-12 lg:gap-16">
              {loop.map((sp, i) => {
                const inner = sp.logo_url ? (
                  <img src={sp.logo_url} alt={sp.name} className="h-16 sm:h-20 w-auto object-contain grayscale hover:grayscale-0 opacity-80 hover:opacity-100 transition" />
                ) : (
                  <div className="h-16 sm:h-20 min-w-[180px] rounded-lg bg-white border border-dashed border-[color:var(--border)] grid place-items-center px-6 text-center text-xs font-semibold uppercase tracking-wider text-[color:var(--muted-foreground)]">
                    {sp.name}
                  </div>
                );
                return sp.website_url ? (
                  <a key={`${sp.id}-${i}`} href={sp.website_url} target="_blank" rel="noopener noreferrer" className="shrink-0">{inner}</a>
                ) : (
                  <div key={`${sp.id}-${i}`} className="shrink-0">{inner}</div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
