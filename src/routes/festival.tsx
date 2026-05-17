import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/layout/PageHeader";
import { Calendar, MapPin, Clock, Car, Accessibility, ShieldCheck, Heart, Music, Users } from "lucide-react";
import { motion } from "framer-motion";

export const Route = createFileRoute("/festival")({
  component: FestivalPage,
  head: () => ({
    meta: [
      { title: "Festival — NUFF | Niagara Ukrainian Family Festival" },
      { name: "description", content: "History, mission, schedule outline, and visitor info for the Niagara Ukrainian Family Festival at Fireman's Park, Niagara Falls." },
      { property: "og:title", content: "Festival — NUFF" },
    ],
  }),
});

const visit = [
  { icon: Calendar, title: "Dates", body: "July 17–19, 2026 · three-day weekend." },
  { icon: MapPin, title: "Location", body: "Fireman's Park, 2275 Dorchester Rd, Niagara Falls, ON." },
  { icon: Clock, title: "Hours", body: "Fri 17:00–22:00 · Sat 11:00–22:00 · Sun 11:00–20:00." },
  { icon: Car, title: "Parking", body: "Free public parking on-site. Reserved bays for vendors and organizers." },
  { icon: Accessibility, title: "Accessibility", body: "Step-free routes, accessible washrooms, designated parking near the main gate." },
  { icon: ShieldCheck, title: "Safety", body: "On-site security, first aid, and a family-friendly Kids' Zone with splash play." },
];

const scheduleOutline = [
  { day: "Friday — July 17", items: ["17:00 · Gates open", "18:00 · Opening ceremony & blessing", "19:00 · Welcome concert · Main stage", "21:00 · Evening folk dance"] },
  { day: "Saturday — July 18", items: ["11:00 · Gates open · Vendor market", "13:00 · Bandura recital · Community stage", "15:00 · Pysanky & embroidery workshops", "17:00 · Folk dance showcase · Main stage", "20:00 · Headliner concert"] },
  { day: "Sunday — July 19", items: ["11:00 · Divine Liturgy", "13:00 · Vyshyvanka parade", "15:00 · Kids' choir & youth ensembles", "18:00 · Closing concert", "20:00 · Festival closes"] },
];

function FestivalPage() {
  return (
    <>
      <PageHeader
        eyebrow="The festival"
        title="Niagara Ukrainian Family Festival"
        subtitle="Three days of music, dance, food, and tradition at Fireman's Park, Niagara Falls."
      />

      {/* Mission */}
      <section className="container-page py-16 lg:py-20">
        <div className="grid lg:grid-cols-2 gap-12">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
            <Heart className="h-7 w-7 text-[color:var(--primary)] mb-4" />
            <h2 className="font-display text-3xl mb-4">Our Cultural Mission</h2>
            <p className="text-[color:var(--muted-foreground)] leading-relaxed">
              NUFF exists to celebrate, preserve, and share Ukrainian heritage across the
              Niagara region. Through music, dance, language, and craft, we create space
              for the Ukrainian diaspora and our neighbours of every background to gather,
              learn, and stand in solidarity. Every dollar raised supports cultural programming,
              youth ensembles, and humanitarian initiatives connected to Ukraine.
            </p>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.1 }}>
            <Users className="h-7 w-7 text-[color:var(--primary)] mb-4" />
            <h2 className="font-display text-3xl mb-4">Festival History</h2>
            <p className="text-[color:var(--muted-foreground)] leading-relaxed">
              The Niagara Ukrainian Family Festival was founded by a coalition of community
              organizations, parishes, and dance schools across Niagara who wanted a single,
              vibrant gathering that the whole region could call home. From a one-day picnic,
              it has grown into a three-day weekend at Fireman's Park, welcoming thousands
              of visitors, dozens of artisans, and performers from across Canada and beyond.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Niagarka community */}
      <section className="bg-[color:var(--cream)] border-y border-[color:var(--border)]">
        <div className="container-page py-16 lg:py-20 grid lg:grid-cols-[1.2fr_1fr] gap-12 items-center">
          <div>
            <p className="eyebrow">The community</p>
            <h2 className="font-display text-3xl mt-2 mb-4">Niagarka — Ukrainian life in Niagara</h2>
            <p className="text-[color:var(--muted-foreground)] leading-relaxed mb-4">
              "Niagarka" is the affectionate name for the Ukrainian community of the Niagara
              region — generations of families who built parishes, halls, dance schools, credit
              unions, and Saturday-school classrooms long before this festival existed.
            </p>
            <p className="text-[color:var(--muted-foreground)] leading-relaxed">
              NUFF is their festival. Volunteers come from St. George's, Sts. Cyril & Methodius,
              the Ukrainian Canadian Congress — Niagara Branch, and dozens of independent
              groups. Newcomers from Ukraine join veteran organizers each year, and the
              programming reflects both deeply traditional and contemporary Ukrainian voices.
            </p>
          </div>
          <div className="rounded-2xl bg-white border border-[color:var(--border)] p-8 shadow-[var(--shadow-soft)]">
            <Music className="h-7 w-7 text-[color:var(--primary)] mb-3" />
            <h3 className="font-display text-xl mb-3">What you'll experience</h3>
            <ul className="space-y-2 text-sm text-[color:var(--muted-foreground)]">
              <li>· Two stages of live music and dance</li>
              <li>· Authentic Ukrainian food prepared by community kitchens</li>
              <li>· Artisan market with pysanky, embroidery, ceramics</li>
              <li>· Kids' Zone with splash pad and craft tables</li>
              <li>· Divine Liturgy and cultural ceremonies</li>
              <li>· Free family programming all weekend</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Schedule outline */}
      <section className="container-page py-16 lg:py-20">
        <p className="eyebrow">Schedule outline</p>
        <h2 className="font-display text-3xl mt-2 mb-10">Three days at a glance</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {scheduleOutline.map((d) => (
            <div key={d.day} className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--card)] p-6">
              <div className="font-display text-xl text-[color:var(--primary)] mb-4">{d.day}</div>
              <ul className="space-y-2 text-sm">
                {d.items.map((i) => <li key={i} className="text-[color:var(--muted-foreground)]">{i}</li>)}
              </ul>
            </div>
          ))}
        </div>
        <p className="mt-6 text-xs text-[color:var(--muted-foreground)]">Full lineup announced closer to the festival. Times subject to change.</p>
      </section>

      {/* Plan your visit */}
      <section className="bg-[color:var(--muted)]/30 border-y border-[color:var(--border)]">
        <div className="container-page py-16 lg:py-20">
          <p className="eyebrow">Plan your visit</p>
          <h2 className="font-display text-3xl mt-2 mb-10">Everything you need to know</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {visit.map((i) => (
              <div key={i.title} className="rounded-xl border border-[color:var(--border)] p-6 bg-[color:var(--card)]">
                <i.icon className="h-6 w-6 text-[color:var(--primary)] mb-3" />
                <h3 className="font-display text-lg font-semibold">{i.title}</h3>
                <p className="text-sm text-[color:var(--muted-foreground)] mt-1.5 leading-relaxed">{i.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
