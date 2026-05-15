import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/layout/PageHeader";
import { Calendar, MapPin, Clock, Car, Accessibility, ShieldCheck } from "lucide-react";

export const Route = createFileRoute("/festival-info")({
  component: Info,
  head: () => ({
    meta: [
      { title: "Festival Info — Festua" },
      { name: "description", content: "Dates, location, parking, accessibility, and what to expect at Festua, the Ukrainian-Canadian cultural festival." },
      { property: "og:title", content: "Festival Info — Festua" },
    ],
  }),
});

const items = [
  { icon: Calendar, title: "Dates", body: "Saturday & Sunday — full schedule announced soon." },
  { icon: MapPin, title: "Location", body: "Niagara St. Mary's Church grounds, Dorchester Rd, Niagara Falls, ON." },
  { icon: Clock, title: "Hours", body: "Sat 11:00–22:00 · Sun 11:00–20:00." },
  { icon: Car, title: "Parking", body: "Free public parking on-site. Reserved areas for vendors and organizers." },
  { icon: Accessibility, title: "Accessibility", body: "Step-free routes, accessible washrooms, designated disabled parking." },
  { icon: ShieldCheck, title: "Safety", body: "On-site security, first aid, and a family-friendly Kids' Zone with water splash." },
];

function Info() {
  return (
    <>
      <PageHeader eyebrow="Plan your visit" title="Everything you need to know" subtitle="A weekend of music, dance, food, and tradition — built for families and culture lovers." />
      <section className="container-page py-16">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {items.map((i) => (
            <div key={i.title} className="rounded-xl border border-[color:var(--border)] p-6 bg-[color:var(--card)]">
              <i.icon className="h-6 w-6 text-[color:var(--primary)] mb-3" />
              <h3 className="font-display text-lg font-semibold">{i.title}</h3>
              <p className="text-sm text-[color:var(--muted-foreground)] mt-1.5 leading-relaxed">{i.body}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
