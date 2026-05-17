import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, MapPin, Calendar, Music, ShoppingBag, HandHeart, Store } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import logo from "@/assets/nuff-logo.png";
import foodImg from "@/assets/food-vendors.jpg";
import musicImg from "@/assets/stage-performance.jpg";
import cultureImg from "@/assets/culture-pysanky.jpg";
import familyImg from "@/assets/hero-festival.jpg";
import { useSiteSettings } from "@/lib/site-content";
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

const pillars = [
  { img: foodImg, title: "Food", body: "Pierogi, holubtsi, varenyky, and wood-fired specialties from family kitchens." },
  { img: musicImg, title: "Music", body: "Folk ensembles, bandura sets, and modern Ukrainian artists across two stages." },
  { img: cultureImg, title: "Culture", body: "Pysanky workshops, vyshyvanka parades, dance showcases, and craft markets." },
  { img: familyImg, title: "Family", body: "Kids' Zone, splash pad, free programming — built for every generation." },
];

function Home() {
  const s = useSiteSettings();
  return (
    <>
      {/* Hero — centered, responsive logo */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[color:var(--cream)] via-[color:var(--background)] to-[color:var(--cream)]">
        <div className="container-page pt-12 pb-16 lg:pt-20 lg:pb-24 flex flex-col items-center text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="w-full flex justify-center"
          >
            <img
              src={logo}
              alt="NUFF — Niagara Ukrainian Family Festival"
              className="w-56 sm:w-72 md:w-80 lg:w-96 h-auto drop-shadow-2xl"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15, ease: "easeOut" }}
            className="mt-8 max-w-3xl"
          >
            <div className="ribbon h-1 w-24 rounded-full mb-6 mx-auto" />
            <p className="eyebrow">{s.festival_dates} · Fireman's Park</p>
            <h1 className="display-xl mt-3 text-[color:var(--foreground)]">
              <span className="text-[color:var(--primary)]">Niagara</span> Ukrainian <span className="italic">Family Festival</span>
            </h1>
            <p className="mt-6 text-lg text-[color:var(--muted-foreground)]">
              {s.hero_subtitle}
            </p>
            <div className="mt-9 flex flex-wrap justify-center gap-3">
              <Link to="/vendors">
                <motion.div whileTap={{ scale: 0.95 }}>
                  <Button size="lg" className="rounded-full px-7">Book a vendor spot <ArrowRight className="ml-2 h-4 w-4" /></Button>
                </motion.div>
              </Link>
              <Link to="/festival">
                <motion.div whileTap={{ scale: 0.95 }}>
                  <Button size="lg" variant="outline" className="rounded-full px-7">Festival info</Button>
                </motion.div>
              </Link>
            </div>
            <div className="mt-10 flex flex-wrap justify-center gap-x-8 gap-y-2 text-sm text-[color:var(--muted-foreground)]">
              <span className="inline-flex items-center gap-2"><Calendar className="h-4 w-4 text-[color:var(--primary)]" /> {s.festival_dates}</span>
              <span className="inline-flex items-center gap-2"><MapPin className="h-4 w-4 text-[color:var(--primary)]" /> {s.location_name}, Niagara Falls</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* What Awaits You — 4 image cards */}
      <section className="container-page py-20 lg:py-28">
        <div className="max-w-2xl">
          <p className="eyebrow">What awaits you</p>
          <h2 className="display-lg mt-2">A weekend rooted in tradition, alive with the new.</h2>
        </div>
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.15 }}
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.1 } } }}
          className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
        >
          {pillars.map((p) => (
            <motion.div
              key={p.title}
              variants={{ hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0, transition: { duration: 0.5 } } }}
              className="group rounded-2xl overflow-hidden border border-[color:var(--border)] bg-[color:var(--card)] shadow-[var(--shadow-soft)]"
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <img src={p.img} alt={p.title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <h3 className="absolute bottom-3 left-4 font-display text-2xl text-white">{p.title}</h3>
              </div>
              <p className="p-5 text-sm text-[color:var(--muted-foreground)] leading-relaxed">{p.body}</p>
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
              { to: "/artists", title: "Artists", body: "Perform on the main or community stage.", icon: Music },
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

      <PartnersStrip />
    </>
  );
}
