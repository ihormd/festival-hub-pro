import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/layout/PageHeader";
import { Calendar, MapPin, Clock, Car, Accessibility, ShieldCheck, Heart, Music, Users } from "lucide-react";
import { motion } from "framer-motion";
import memory1 from "@/assets/memory-1.jpg";
import memory2 from "@/assets/memory-2.jpg";
import memory3 from "@/assets/memory-3.jpg";
import memory4 from "@/assets/memory-4.jpg";
import memory5 from "@/assets/memory-5.jpg";
import memory6 from "@/assets/memory-6.jpg";

export const Route = createFileRoute("/festival")({
  component: FestivalPage,
  head: () => ({
    meta: [
      { title: "Festival — NUFF | Niagara Ukrainian Family Festival" },
      { name: "description", content: "History, mission, schedule, and visitor info for NUFF — two days of Ukrainian culture at Fireman's Park, Niagara Falls. July 12–13, 2026." },
      { property: "og:title", content: "Festival — NUFF" },
    ],
  }),
});

const visit = [
  { icon: Calendar, title: "Dates", body: "July 12–13, 2026 · two-day festival." },
  { icon: MapPin, title: "Location", body: "Fireman's Park, 2275 Dorchester Rd, Niagara Falls, ON." },
  { icon: Clock, title: "Hours", body: "Sun 11:00–22:00 · Mon 11:00–20:00." },
  { icon: Car, title: "Parking", body: "Free public parking on-site. Reserved bays for vendors and organizers." },
  { icon: Accessibility, title: "Accessibility", body: "Step-free routes, accessible washrooms, designated parking near the main gate." },
  { icon: ShieldCheck, title: "Safety", body: "On-site security, first aid, and a family-friendly Kids' Zone with splash play." },
];

const scheduleOutline = [
  { day: "Sunday — July 12", items: ["11:00 · Gates open · Vendor market", "12:00 · Opening ceremony & blessing", "13:00 · Bandura recital", "15:00 · Pysanky & embroidery workshops", "17:00 · Folk dance showcase", "20:00 · Headliner concert"] },
  { day: "Monday — July 13", items: ["11:00 · Gates open", "12:00 · Vyshyvanka parade", "14:00 · Kids' choir & youth ensembles", "16:00 · Community concert", "18:00 · Closing performance", "20:00 · Festival closes"] },
];

const memories = [memory1, memory2, memory3, memory4, memory5, memory6];

function FestivalPage() {
  return (
    <>
      <PageHeader
        eyebrow="The festival"
        title="Niagara Ukrainian Family Festival"
        subtitle="Two days of music, dance, food, and tradition at Fireman's Park, Niagara Falls — July 12–13, 2026."
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
              Now in its fourth year, the Niagara Ukrainian Family Festival was founded by a
              coalition of community organizations, parishes, and dance schools across Niagara.
              From a one-day picnic, it has grown into a vibrant two-day weekend at Fireman's Park,
              welcoming thousands of visitors, dozens of artisans, and performers from across
              Canada and beyond.
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
              <li>· One main stage of live music and dance</li>
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
        <h2 className="font-display text-3xl mt-2 mb-10">Two days at a glance</h2>
        <div className="grid md:grid-cols-2 gap-6">
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

      {/* Past Festivals Memories — masonry */}
      <section className="container-page py-16 lg:py-24">
        <div className="max-w-2xl mb-10">
          <p className="eyebrow">Past festivals</p>
          <h2 className="font-display text-3xl mt-2">Memories from previous years</h2>
          <p className="mt-3 text-[color:var(--muted-foreground)]">
            Three years of community, dance, food, and song. Here's a glimpse of what awaits at NUFF 2026.
          </p>
        </div>
        <div className="columns-2 md:columns-3 gap-4 [column-fill:_balance]">
          {memories.map((src, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.1 }}
              transition={{ duration: 0.5, delay: (i % 3) * 0.08 }}
              className="mb-4 break-inside-avoid overflow-hidden rounded-2xl border border-[color:var(--border)] shadow-[var(--shadow-soft)]"
            >
              <img src={src} alt={`NUFF past festival memory ${i + 1}`} loading="lazy" className="w-full h-auto block hover:scale-[1.02] transition-transform duration-500" />
            </motion.div>
          ))}
        </div>
      </section>
    </>
  );
}
