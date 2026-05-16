import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, MapPin, Calendar, Music, ShoppingBag, HandHeart, Store } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import logo from "@/assets/nuff-logo.png";
import { useSiteSettings } from "@/lib/site-content";
import { TeamSection } from "@/components/festival/TeamSection";
import { PartnersStrip } from "@/components/festival/PartnersStrip";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "NUFF — Niagara Ukrainian Family Festival 2026" },
      { name: "description", content: "Three days of Ukrainian music, dance, food, and craft at Fireman's Park, Niagara Falls. Vendors, artists, volunteers, and sponsors welcome." },
      { property: "og:title", content: "NUFF — Niagara Ukrainian Family Festival 2026" },
      { property: "og:description", content: "July 17–19, 2026 · Fireman's Park, Niagara Falls" },
      { property: "og:image", content: logo },
    ],
  }),
  component: Home,
});

function Home() {
  const s = useSiteSettings();
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[color:var(--cream)] via-[color:var(--background)] to-[color:var(--cream)]">
        <div className="container-page pt-16 pb-24 lg:pt-24 lg:pb-32 grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            <div className="ribbon h-1 w-24 rounded-full mb-6" />
            <p className="eyebrow">{s.festival_dates} · Fireman's Park</p>
            <h1 className="display-xl mt-3 text-[color:var(--foreground)]">
              <span className="text-[color:var(--primary)]">N</span>iagara <span className="text-[color:var(--secondary)] [text-shadow:0_1px_0_var(--foreground)]">U</span>krainian <br className="hidden sm:block" />Family <span className="italic">Festival</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg text-[color:var(--muted-foreground)]">
              {s.hero_subtitle}
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Link to="/vendors">
                <motion.div whileTap={{ scale: 0.95 }}>
                  <Button size="lg" className="rounded-full px-7">Book a vendor spot <ArrowRight className="ml-2 h-4 w-4" /></Button>
                </motion.div>
              </Link>
              <Link to="/festival-info">
                <motion.div whileTap={{ scale: 0.95 }}>
                  <Button size="lg" variant="outline" className="rounded-full px-7">Festival info</Button>
                </motion.div>
              </Link>
            </div>
            <div className="mt-10 flex flex-wrap gap-x-8 gap-y-2 text-sm text-[color:var(--muted-foreground)]">
              <span className="inline-flex items-center gap-2"><Calendar className="h-4 w-4 text-[color:var(--primary)]" /> {s.festival_dates}</span>
              <span className="inline-flex items-center gap-2"><MapPin className="h-4 w-4 text-[color:var(--primary)]" /> {s.location_name}, Niagara Falls</span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 1 }}
            animate={{ opacity: 1, scale: 1.05 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex justify-center"
          >
            <img src={logo} alt="NUFF official mark" className="w-full max-w-md drop-shadow-2xl" />
          </motion.div>
        </div>
      </section>

      {/* Pillars */}
      <section className="container-page py-20 lg:py-28">
        <div className="max-w-2xl">
          <p className="eyebrow">What awaits</p>
          <h2 className="display-lg mt-2">A weekend rooted in tradition, alive with the new.</h2>
        </div>
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.12 } } }}
          className="mt-12 grid gap-6 md:grid-cols-3"
        >
          {[
            { icon: Music, title: "Live stages", body: "Folk ensembles, modern Ukrainian artists, and rising Canadian voices across two stages." },
            { icon: ShoppingBag, title: "Artisan market", body: "Hand-embroidered linens, ceramics, pysanky, and contemporary makers — all in one square." },
            { icon: HandHeart, title: "Community first", body: "A nonprofit-led gathering. Volunteers and sponsors keep the festival open to families." },
          ].map(({ icon: Icon, title, body }) => (
            <motion.div
              key={title}
              variants={{ hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0, transition: { duration: 0.5 } } }}
              className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--card)] p-7 shadow-[var(--shadow-soft)]"
            >
              <Icon className="h-7 w-7 text-[color:var(--primary)]" />
              <h3 className="mt-5 font-display text-2xl">{title}</h3>
              <p className="mt-2 text-sm text-[color:var(--muted-foreground)] leading-relaxed">{body}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Get involved */}
      <section className="bg-[color:var(--cream)] border-y border-[color:var(--border)]">
        <div className="container-page py-20 lg:py-28">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
            <div>
              <p className="eyebrow">Be part of it</p>
              <h2 className="display-lg mt-2">Four ways to join NUFF.</h2>
            </div>
          </div>
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {[
              { to: "/vendors", title: "Vendors", body: "Reserve a booth on the live festival map.", icon: Store },
              { to: "/entertainment", title: "Artists", body: "Perform on the main or community stage.", icon: Music },
              { to: "/volunteers", title: "Volunteers", body: "Pick a shift, choose your area.", icon: HandHeart },
              { to: "/sponsors", title: "Sponsors", body: "Bronze to Platinum tiers + custom.", icon: ShoppingBag },
            ].map(({ to, title, body, icon: Icon }) => (
              <Link key={to} to={to} className="group rounded-2xl bg-[color:var(--card)] p-6 border border-[color:var(--border)] hover:border-[color:var(--primary)] transition-colors">
                <Icon className="h-6 w-6 text-[color:var(--primary)]" />
                <div className="mt-5 font-display text-xl">{title}</div>
                <p className="mt-1.5 text-sm text-[color:var(--muted-foreground)]">{body}</p>
                <div className="mt-4 inline-flex items-center text-sm font-medium text-[color:var(--primary)]">
                  Learn more <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <TeamSection />

      <PartnersStrip />
    </>
  );
}
