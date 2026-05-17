import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import stagePerformance from "@/assets/stage-performance.jpg";
import culturePysanky from "@/assets/culture-pysanky.jpg";

export const Route = createFileRoute("/entertainment")({
  component: Entertainment,
  head: () => ({
    meta: [
      { title: "Entertainment — NUFF" },
      { name: "description", content: "Live Ukrainian music, traditional dance, kids' zone, and cultural workshops at NUFF." },
    ],
  }),
});

const lineup = [
  { time: "Sat 12:00", act: "Opening Ceremony", note: "Welcome with Hopak dance ensemble" },
  { time: "Sat 14:00", act: "Bandura Live", note: "Traditional string instrument" },
  { time: "Sat 17:00", act: "Folk Dance Showcase", note: "5 ensembles · all ages" },
  { time: "Sat 20:00", act: "Headliner — TBA", note: "Modern Ukrainian artist" },
  { time: "Sun 13:00", act: "Pysanky Workshop", note: "Egg painting masterclass" },
  { time: "Sun 16:00", act: "Vyshyvanka Parade", note: "Traditional embroidered shirts" },
];

function Entertainment() {
  return (
    <>
      <PageHeader eyebrow="Lineup" title="Stages, sounds & traditions" subtitle="Two days of live performances, workshops, and cultural showcases." />
      <section className="container-page py-16">
        <div className="grid lg:grid-cols-2 gap-10 items-start">
          <div className="rounded-xl overflow-hidden border border-[color:var(--border)]">
            <img src={stagePerformance} alt="Festival stage performance" className="w-full h-80 object-cover" />
          </div>
          <div>
            <h2 className="font-display text-2xl font-semibold mb-6">Schedule</h2>
            <div className="divide-y divide-[color:var(--border)]">
              {lineup.map((l) => (
                <div key={l.time + l.act} className="py-4 flex gap-4">
                  <div className="w-20 shrink-0 text-sm font-mono text-[color:var(--secondary)]">{l.time}</div>
                  <div>
                    <div className="font-semibold">{l.act}</div>
                    <div className="text-sm text-[color:var(--muted-foreground)]">{l.note}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      <section className="bg-[color:var(--muted)]/40 border-y border-[color:var(--border)]">
        <div className="container-page py-16 grid lg:grid-cols-2 gap-10 items-center">
          <div>
            <h2 className="font-display text-3xl font-semibold mb-3">Calling all artists</h2>
            <p className="text-[color:var(--muted-foreground)] mb-6">Apply to perform on the main stage. Submit your portfolio links and tech rider.</p>
            <Link to="/apply/artist"><Button size="lg">Apply to Perform</Button></Link>
          </div>
          <img src={culturePysanky} alt="Pysanky" className="rounded-xl w-full h-72 object-cover" />
        </div>
      </section>
    </>
  );
}
