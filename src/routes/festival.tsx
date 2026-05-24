import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Calendar, MapPin, Clock, Car, Accessibility, ShieldCheck, Heart, Music, Users } from "lucide-react";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { useSiteSettings } from "@/lib/site-content";
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
      { name: "description", content: "History, mission, schedule, and visitor info for NUFF — two days of Ukrainian culture at Fireman's Park, Niagara Falls. July 11–12, 2026." },
      { property: "og:title", content: "Festival — NUFF" },
    ],
  }),
});

type ScheduleRow = { id: string; day: "saturday" | "sunday"; start_time: string; end_time: string | null; title: string; area: string | null };
const memories = [memory1, memory2, memory3, memory4, memory5, memory6];
const visitIcons = [Calendar, MapPin, Clock, Car, Accessibility, ShieldCheck];

function FestivalPage() {
  const s = useSiteSettings();
  const [schedule, setSchedule] = useState<ScheduleRow[]>([]);
  useEffect(() => {
    supabase.from("festival_schedule").select("id,day,start_time,end_time,title,area").eq("active", true).order("day").order("sort_order").then(({ data }) => setSchedule((data as ScheduleRow[]) ?? []));
  }, []);

  const visitCards = [
    { icon: visitIcons[0], title: s.festival_visit_dates_title, body: s.festival_visit_dates_body },
    { icon: visitIcons[1], title: s.festival_visit_location_title, body: s.festival_visit_location_body },
    { icon: visitIcons[2], title: s.festival_visit_hours_title, body: s.festival_visit_hours_body },
    { icon: visitIcons[3], title: s.festival_visit_parking_title, body: s.festival_visit_parking_body },
    { icon: visitIcons[4], title: s.festival_visit_accessibility_title, body: s.festival_visit_accessibility_body },
    { icon: visitIcons[5], title: s.festival_visit_safety_title, body: s.festival_visit_safety_body },
  ];

  const experienceItems = (s.festival_experience_items || "").split("\n").filter(Boolean);
  const days: { key: "saturday" | "sunday"; label: string }[] = [
    { key: "saturday", label: "Saturday — July 11" },
    { key: "sunday", label: "Sunday — July 12" },
  ];

  return (
    <>
      <PageHeader eyebrow={s.festival_page_eyebrow} title={s.festival_page_title} subtitle={s.festival_page_subtitle} />

      <section className="container-page py-16 lg:py-20">
        <div className="grid lg:grid-cols-2 gap-12">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
            <Heart className="h-7 w-7 text-[color:var(--primary)] mb-4" />
            <h2 className="font-display text-3xl mb-4">{s.festival_mission_title}</h2>
            <p className="text-[color:var(--muted-foreground)] leading-relaxed">{s.festival_mission_body}</p>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.1 }}>
            <Users className="h-7 w-7 text-[color:var(--primary)] mb-4" />
            <h2 className="font-display text-3xl mb-4">{s.festival_history_title}</h2>
            <p className="text-[color:var(--muted-foreground)] leading-relaxed">{s.festival_history_body}</p>
          </motion.div>
        </div>
      </section>

      <section className="bg-[color:var(--cream)] border-y border-[color:var(--border)]">
        <div className="container-page py-16 lg:py-20 grid lg:grid-cols-[1.2fr_1fr] gap-12 items-center">
          <div>
            <p className="eyebrow">{s.festival_community_eyebrow}</p>
            <h2 className="font-display text-3xl mt-2 mb-4">{s.festival_community_title}</h2>
            <p className="text-[color:var(--muted-foreground)] leading-relaxed mb-4">{s.festival_community_body1}</p>
            <p className="text-[color:var(--muted-foreground)] leading-relaxed">{s.festival_community_body2}</p>
          </div>
          <div className="rounded-2xl bg-white border border-[color:var(--border)] p-8 shadow-[var(--shadow-soft)]">
            <Music className="h-7 w-7 text-[color:var(--primary)] mb-3" />
            <h3 className="font-display text-xl mb-3">{s.festival_experience_title}</h3>
            <ul className="space-y-2 text-sm text-[color:var(--muted-foreground)]">
              {experienceItems.map((item, i) => <li key={i}>· {item}</li>)}
            </ul>
          </div>
        </div>
      </section>

      <section className="container-page py-16 lg:py-20">
        <p className="eyebrow">Schedule outline</p>
        <h2 className="font-display text-3xl mt-2 mb-10">Two days at a glance</h2>
        <div className="grid md:grid-cols-2 gap-6">
          {days.map((d) => {
            const items = schedule.filter((r) => r.day === d.key);
            return (
              <div key={d.key} className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--card)] p-6">
                <div className="font-display text-xl text-[color:var(--primary)] mb-4">{d.label}</div>
                <ul className="space-y-2 text-sm">
                  {items.length === 0 && <li className="text-[color:var(--muted-foreground)]">Schedule coming soon.</li>}
                  {items.map((r) => (
                    <li key={r.id} className="text-[color:var(--muted-foreground)] flex gap-3">
                      <span className="font-mono text-xs w-20 shrink-0 text-[color:var(--primary)]">{r.start_time.slice(0, 5)}</span>
                      <span><span className="text-[color:var(--foreground)] font-medium">{r.title}</span>{r.area && <span className="text-xs"> · {r.area}</span>}</span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
        <p className="mt-6 text-xs text-[color:var(--muted-foreground)]">Full lineup announced closer to the festival. Times subject to change.</p>
      </section>

      <section className="bg-[color:var(--muted)]/30 border-y border-[color:var(--border)]">
        <div className="container-page py-16 lg:py-20">
          <p className="eyebrow">{s.festival_visit_eyebrow}</p>
          <h2 className="font-display text-3xl mt-2 mb-10">{s.festival_visit_heading}</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {visitCards.map((i) => (
              <div key={i.title} className="rounded-xl border border-[color:var(--border)] p-6 bg-[color:var(--card)]">
                <i.icon className="h-6 w-6 text-[color:var(--primary)] mb-3" />
                <h3 className="font-display text-lg font-semibold">{i.title}</h3>
                <p className="text-sm text-[color:var(--muted-foreground)] mt-1.5 leading-relaxed">{i.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container-page py-16 lg:py-24">
        <div className="max-w-2xl mb-10">
          <p className="eyebrow">{s.festival_memories_eyebrow}</p>
          <h2 className="font-display text-3xl mt-2">{s.festival_memories_title}</h2>
          <p className="mt-3 text-[color:var(--muted-foreground)]">{s.festival_memories_body}</p>
        </div>
        <div className="columns-2 md:columns-3 gap-4 [column-fill:_balance]">
          {memories.map((src, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.1 }} transition={{ duration: 0.5, delay: (i % 3) * 0.08 }} className="mb-4 break-inside-avoid overflow-hidden rounded-2xl border border-[color:var(--border)] shadow-[var(--shadow-soft)]">
              <img src={src} alt={`NUFF past festival memory ${i + 1}`} loading="lazy" className="w-full h-auto block hover:scale-[1.02] transition-transform duration-500" />
            </motion.div>
          ))}
        </div>
      </section>
    </>
  );
}
