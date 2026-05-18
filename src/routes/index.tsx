import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowRight, MapPin, Calendar, Music, ShoppingBag, HandHeart, Store, Award, Users, Mic2, PartyPopper } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import logo from "@/assets/nuff-logo.png";
import heroFestival from "@/assets/hero-festival.jpg";
import foodImg from "@/assets/food-vendors.jpg";
import musicImg from "@/assets/stage-performance.jpg";
import cultureImg from "@/assets/culture-pysanky.jpg";
import familyImg from "@/assets/memory-2.jpg";
import { useSiteSettings } from "@/lib/site-content";
import { PartnersStrip } from "@/components/festival/PartnersStrip";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "NUFF — Niagara Ukrainian Family Festival 2026" },
      { name: "description", content: "Two days of Ukrainian music, dance, food, and craft at Fireman's Park, Niagara Falls. July 12–13, 2026. Vendors, artists, volunteers, and sponsors welcome." },
      { property: "og:title", content: "NUFF — Niagara Ukrainian Family Festival 2026" },
      { property: "og:description", content: "July 12–13, 2026 · Fireman's Park, Niagara Falls" },
      { property: "og:image", content: heroFestival },
    ],
  }),
  component: Home,
});

const pillars = [
  { img: foodImg, title: "Food", body: "Pierogi, holubtsi, varenyky, and wood-fired specialties from family kitchens." },
  { img: musicImg, title: "Music", body: "Folk ensembles, bandura sets, and modern Ukrainian artists on the main stage." },
  { img: cultureImg, title: "Culture", body: "Pysanky workshops, vyshyvanka parades, dance showcases, and craft markets." },
  { img: familyImg, title: "Family", body: "Kids' Zone, splash pad, free programming — built for every generation." },
];

const stats = [
  { icon: Award, value: "4th", label: "Year of Celebration" },
  { icon: Mic2, value: "100+", label: "Performers" },
  { icon: Store, value: "80+", label: "Vendors" },
  { icon: Users, value: "5000+", label: "Visitors" },
];

function Home() {
  const s = useSiteSettings();
  const [splash, setSplash] = useState(true);

  useEffect(() => {
    // Only show splash on first homepage visit per session
    if (typeof window !== "undefined" && sessionStorage.getItem("nuff_splash_done")) {
      setSplash(false);
      return;
    }
    const t = setTimeout(() => {
      setSplash(false);
      if (typeof window !== "undefined") sessionStorage.setItem("nuff_splash_done", "1");
    }, 3000);
    return () => clearTimeout(t);
  }, []);

  return (
    <>
      {/* Logo splash — 3 seconds then morphs out */}
      <AnimatePresence>
        {splash && (
          <motion.div
            key="splash"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.7, ease: "easeInOut" }}
            className="fixed inset-0 z-[60] grid place-items-center bg-[color:var(--background)]"
          >
            <motion.img
              src={logo}
              alt="NUFF"
              initial={{ scale: 0.6, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.18, x: "-44vw", y: "-44vh", opacity: 0.9 }}
              transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
              className="w-64 sm:w-80 md:w-96 h-auto drop-shadow-2xl"
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* HERO with vibrant festival photo */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img src={heroFestival} alt="Ukrainian folk dancers at NUFF" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/35 to-black/65 backdrop-blur-[2px]" />
        </div>

        <div className="relative container-page pt-20 pb-24 lg:pt-28 lg:pb-32 flex flex-col items-center text-center text-white">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: splash ? 0 : 1, y: splash ? 16 : 0 }}
            transition={{ duration: 0.7, delay: splash ? 0 : 0.2, ease: "easeOut" }}
            className="max-w-4xl"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/15 backdrop-blur border border-white/20 text-xs font-semibold uppercase tracking-[0.18em]">
              <Calendar className="h-3.5 w-3.5" /> {s.festival_dates} · Fireman's Park
            </div>
            <h1 className="display-xl mt-6 text-white drop-shadow-[0_2px_24px_rgba(0,0,0,0.45)]">
              <span style={{ color: "#0057B7" }}>N</span>iagara <span style={{ color: "#FFD700" }}>U</span>krainian
              <br className="hidden sm:block" /> <span className="italic font-medium">Family Festival</span>
            </h1>
            <p className="mt-6 text-lg sm:text-xl text-white/90 max-w-2xl mx-auto">
              {s.hero_subtitle}
            </p>
            <div className="mt-9 flex flex-wrap justify-center gap-3">
              <Link to="/vendors">
                <motion.div whileTap={{ scale: 0.95 }}>
                  <Button size="lg" className="rounded-full px-7 bg-[#0057B7] hover:bg-[#003e85] text-white">
                    Book a vendor spot <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </motion.div>
              </Link>
              <Link to="/festival">
                <motion.div whileTap={{ scale: 0.95 }}>
                  <Button size="lg" variant="outline" className="rounded-full px-7 bg-white/10 text-white border-white/40 hover:bg-white hover:text-[color:var(--ink)]">
                    Festival info
                  </Button>
                </motion.div>
              </Link>
            </div>
            <div className="mt-10 flex flex-wrap justify-center gap-x-8 gap-y-2 text-sm text-white/85">
              <span className="inline-flex items-center gap-2"><Calendar className="h-4 w-4" /> {s.festival_dates}</span>
              <span className="inline-flex items-center gap-2"><MapPin className="h-4 w-4" /> {s.location_name}, Niagara Falls</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* STATS BAR */}
      <section className="bg-[color:var(--primary)] text-white">
        <div className="container-page py-10 grid grid-cols-2 md:grid-cols-4 gap-y-8 gap-x-4">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: i * 0.08 }}
              className="flex flex-col items-center text-center md:flex-row md:items-center md:gap-4 md:justify-center"
            >
              <s.icon className="h-8 w-8 mb-2 md:mb-0 text-[#FFD700]" />
              <div>
                <div className="font-display text-3xl sm:text-4xl font-bold leading-none">{s.value}</div>
                <div className="mt-1 text-xs sm:text-sm uppercase tracking-wider text-white/80">{s.label}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* What Awaits You — clean product-style image cards */}
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
              className="group rounded-2xl overflow-hidden border border-[color:var(--border)] bg-[color:var(--card)] shadow-[var(--shadow-soft)] hover:shadow-lg transition-shadow"
            >
              <div className="relative aspect-square overflow-hidden bg-[color:var(--muted)]">
                <img src={p.img} alt={p.title} loading="lazy" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
              </div>
              <div className="p-5">
                <h3 className="font-display text-xl font-semibold text-[color:var(--primary)]">{p.title}</h3>
                <p className="mt-1.5 text-sm text-[color:var(--muted-foreground)] leading-relaxed">{p.body}</p>
              </div>
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
              { to: "/artists", title: "Artists", body: "Perform on the NUFF main stage.", icon: Music },
              { to: "/volunteers", title: "Volunteers", body: "Pick a shift, choose your area.", icon: HandHeart },
              { to: "/sponsors", title: "Sponsors", body: "Bronze to Platinum tiers + custom.", icon: PartyPopper },
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
