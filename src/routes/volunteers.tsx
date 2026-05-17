import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { HandHeart, Users, Sparkles, Clock } from "lucide-react";

export const Route = createFileRoute("/volunteers")({
  component: VolunteersPage,
  head: () => ({
    meta: [
      { title: "Volunteer — NUFF" },
      { name: "description", content: "Join the NUFF volunteer crew. Pick shifts, choose your area of interest, and help create unforgettable cultural moments." },
    ],
  }),
});

const perks = [
  { icon: HandHeart, title: "Be part of it", body: "Build the festival from the inside, alongside our core crew." },
  { icon: Users, title: "Meet your community", body: "Work with friendly, passionate folks from across the region." },
  { icon: Sparkles, title: "Festival access", body: "Free t-shirt, meals during shifts, and after-party access." },
  { icon: Clock, title: "Flexible shifts", body: "Pick 4-hour blocks across the weekend. We'll work with your schedule." },
];

function VolunteersPage() {
  return (
    <>
      <PageHeader eyebrow="Crew up" title="Volunteer with NUFF" subtitle="Help us run the most welcoming festival in the region." />
      <section className="container-page py-16">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {perks.map((p) => (
            <div key={p.title} className="rounded-xl border border-[color:var(--border)] p-6 bg-[color:var(--card)]">
              <p.icon className="h-6 w-6 text-[color:var(--primary)] mb-3" />
              <h3 className="font-semibold">{p.title}</h3>
              <p className="text-sm text-[color:var(--muted-foreground)] mt-1.5 leading-relaxed">{p.body}</p>
            </div>
          ))}
        </div>
        <div className="mt-12 text-center">
          <Link to="/apply/volunteer"><Button size="lg">Apply to Volunteer</Button></Link>
        </div>
      </section>
    </>
  );
}
