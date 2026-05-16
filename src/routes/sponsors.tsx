import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/sponsors")({
  component: SponsorsPage,
  head: () => ({
    meta: [
      { title: "Sponsors & Partners — NUFF" },
      { name: "description", content: "Sponsor the Niagara Ukrainian Family Festival. Tiered packages from Bronze to Platinum with stage recognition, booth presence, and digital placements." },
    ],
  }),
});

type Tier = { tier: "bronze"|"silver"|"gold"|"platinum"; name: string; price: number; perks: string[]; featured?: boolean };
const tiers: Tier[] = [
  { tier: "bronze", name: "Bronze", price: 250, perks: ["Logo on website", "Social media mention", "Festival program listing"] },
  { tier: "silver", name: "Silver", price: 1000, perks: ["All Bronze perks", "Stage shout-out", "Reserved booth space", "Logo on signage"] },
  { tier: "gold", name: "Gold", price: 5000, perks: ["All Silver perks", "Premium booth location", "Headline stage banner", "VIP hospitality"], featured: true },
  { tier: "platinum", name: "Platinum", price: 15000, perks: ["All Gold perks", "Title sponsor naming", "Dedicated press release", "Year-round partnership"] },
];

type Sponsor = { id: string; name: string; logo_url: string | null; website_url: string | null; level: "platinum"|"gold"|"silver"|"bronze"; sort_order: number };

function SponsorsPage() {
  const [list, setList] = useState<Sponsor[]>([]);
  useEffect(() => {
    supabase.from("sponsors").select("*").eq("active", true).order("sort_order").then(({ data }) => setList((data as Sponsor[]) ?? []));
  }, []);

  const groups: Record<Sponsor["level"], Sponsor[]> = { platinum: [], gold: [], silver: [], bronze: [] };
  list.forEach((s) => groups[s.level].push(s));

  return (
    <>
      <PageHeader eyebrow="Partner with NUFF" title="Sponsor the festival." subtitle="Reach thousands of engaged Niagara families and align your brand with Ukrainian heritage." />

      {/* Current partners by level */}
      <section className="container-page py-12">
        {(["platinum", "gold", "silver", "bronze"] as const).map((lvl) => groups[lvl].length > 0 && (
          <div key={lvl} className="mb-12">
            <h2 className="font-display text-2xl font-semibold capitalize">{lvl} Partners</h2>
            <div className={`mt-5 grid gap-6 items-center ${lvl === "platinum" ? "sm:grid-cols-2 lg:grid-cols-3" : "sm:grid-cols-3 lg:grid-cols-5"}`}>
              {groups[lvl].map((sp) => {
                const inner = sp.logo_url ? (
                  <img src={sp.logo_url} alt={sp.name} className={`${lvl === "platinum" ? "h-28" : lvl === "gold" ? "h-24" : "h-20"} w-auto object-contain mx-auto`} />
                ) : (
                  <div className={`${lvl === "platinum" ? "h-28" : lvl === "gold" ? "h-24" : "h-20"} w-full rounded-lg bg-white border border-dashed border-[color:var(--border)] grid place-items-center px-4 text-center text-xs font-semibold uppercase tracking-wider text-[color:var(--muted-foreground)]`}>{sp.name}</div>
                );
                return sp.website_url ? <a key={sp.id} href={sp.website_url} target="_blank" rel="noopener noreferrer">{inner}</a> : <div key={sp.id}>{inner}</div>;
              })}
            </div>
          </div>
        ))}
      </section>

      {/* Tiers */}
      <section className="container-page py-12">
        <h2 className="font-display text-3xl font-semibold mb-2">Sponsorship Packages</h2>
        <p className="text-[color:var(--muted-foreground)] mb-8">Choose your tier — or design a custom partnership with our team.</p>
        <motion.div
          initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.15 }}
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.08 } } }}
          className="grid gap-6 md:grid-cols-2 lg:grid-cols-4"
        >
          {tiers.map((t) => (
            <motion.div
              key={t.tier}
              variants={{ hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0, transition: { duration: 0.45 } } }}
              className={`relative rounded-2xl border p-6 flex flex-col ${t.featured ? "border-[color:var(--primary)] shadow-lg ring-1 ring-[color:var(--primary)]/30 bg-gradient-to-b from-[color:var(--primary)]/5 to-transparent" : "border-[color:var(--border)] bg-[color:var(--card)]"}`}
            >
              {t.featured && <span className="absolute -top-3 left-6 text-[10px] uppercase tracking-widest font-semibold bg-[color:var(--primary)] text-[color:var(--primary-foreground)] px-2 py-1 rounded">Most popular</span>}
              <h3 className="font-display text-2xl font-semibold">{t.name}</h3>
              <div className="mt-2 mb-6">
                <span className="text-4xl font-display font-semibold">${t.price.toLocaleString()}</span>
                <span className="text-sm text-[color:var(--muted-foreground)] ml-1">CAD</span>
              </div>
              <ul className="space-y-2.5 text-sm flex-1">
                {t.perks.map((p) => (
                  <li key={p} className="flex gap-2"><Check className="h-4 w-4 text-[color:var(--primary)] shrink-0 mt-0.5" /><span>{p}</span></li>
                ))}
              </ul>
              <Link to="/sponsor/apply" search={{ tier: t.tier }} className="mt-6">
                <motion.div whileTap={{ scale: 0.95 }}>
                  <Button className="w-full" variant={t.featured ? "default" : "outline"}>Choose {t.name}</Button>
                </motion.div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* CTA */}
      <section className="container-page py-16">
        <div className="rounded-3xl bg-gradient-to-br from-[color:var(--primary)] to-[color:var(--sky)] p-10 lg:p-16 text-white text-center">
          <h2 className="font-display text-3xl lg:text-4xl font-semibold">Partner with NUFF 2026</h2>
          <p className="mt-3 max-w-2xl mx-auto text-white/90">Custom packages, in-kind contributions, and multi-year partnerships are all welcome. Let's design something meaningful together.</p>
          <Link to="/contact" className="mt-6 inline-block">
            <motion.div whileTap={{ scale: 0.95 }}>
              <Button size="lg" variant="secondary" className="rounded-full px-8">Talk to our team</Button>
            </motion.div>
          </Link>
        </div>
      </section>
    </>
  );
}
