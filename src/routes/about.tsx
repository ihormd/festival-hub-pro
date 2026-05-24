import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/layout/PageHeader";
import { TeamSection } from "@/components/festival/TeamSection";
import { useSiteSettings } from "@/lib/site-content";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About NUFF — Niagara Ukrainian Family Festival" },
      { name: "description", content: "Our mission, history, and the volunteer board behind the Niagara Ukrainian Family Festival." },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  const s = useSiteSettings();
  return (
    <>
      <PageHeader eyebrow={s.about_eyebrow} title={s.about_title} subtitle={s.about_subtitle} />
      <section className="container-page py-16 grid lg:grid-cols-2 gap-12">
        <div>
          <h2 className="font-display text-3xl font-semibold">{s.about_mission_heading}</h2>
          <p className="mt-4 text-[color:var(--muted-foreground)] leading-relaxed whitespace-pre-line">{s.about_mission}</p>
        </div>
        <div>
          <h2 className="font-display text-3xl font-semibold">{s.about_history_heading}</h2>
          <p className="mt-4 text-[color:var(--muted-foreground)] leading-relaxed whitespace-pre-line">{s.about_history}</p>
        </div>
      </section>
      <TeamSection />
    </>
  );
}
