import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

export const Route = createFileRoute("/sponsors")({
  component: SponsorsPage,
  head: () => ({
    meta: [
      { title: "Sponsors & Donors — Festua" },
      { name: "description", content: "Tiered sponsorship packages with on-stage recognition, booth presence, and digital placements. Pay securely online." },
    ],
  }),
});

const tiers = [
  { tier: "bronze", name: "Bronze", price: 250, perks: ["Logo on website", "Social media mention", "Festival program listing"] },
  { tier: "silver", name: "Silver", price: 1000, perks: ["All Bronze perks", "Stage shout-out", "Reserved booth space", "Logo on signage"] },
  { tier: "gold", name: "Gold", price: 5000, perks: ["All Silver perks", "Premium booth location", "Headline stage banner", "VIP hospitality"], featured: true },
  { tier: "platinum", name: "Platinum", price: 15000, perks: ["All Gold perks", "Title sponsor naming", "Dedicated press release", "Year-round partnership"] },
];

function SponsorsPage() {
  return (
    <>
      <PageHeader eyebrow="Partner with us" title="Sponsor Festua" subtitle="Reach 10,000+ engaged attendees and align your brand with Ukrainian-Canadian heritage." />
      <section className="container-page py-16">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {tiers.map((t) => (
            <div key={t.tier} className={`relative rounded-2xl border p-6 flex flex-col ${t.featured ? "border-[color:var(--primary)] shadow-lg ring-1 ring-[color:var(--primary)]/30 bg-gradient-to-b from-[color:var(--primary)]/5 to-transparent" : "border-[color:var(--border)] bg-[color:var(--card)]"}`}>
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
                <Button className="w-full" variant={t.featured ? "default" : "outline"}>Choose {t.name}</Button>
              </Link>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
