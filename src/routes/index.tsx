import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, MapPin, Calendar, Music, ShoppingBag, HandHeart, Store } from "lucide-react";
import { Button } from "@/components/ui/button";
import hero from "@/assets/hero-festival.jpg";
import pysanky from "@/assets/culture-pysanky.jpg";
import food from "@/assets/food-vendors.jpg";
import stage from "@/assets/stage-performance.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Festua — Ukrainian-Canadian Festival" },
      { name: "description", content: "A celebration of Ukrainian-Canadian culture: music, dance, food, craft, and community. Apply as a vendor, artist, or volunteer." },
      { property: "og:title", content: "Festua — Ukrainian-Canadian Festival" },
      { property: "og:description", content: "Music, dance, food, craft, and community at Festua." },
      { property: "og:image", content: hero },
    ],
  }),
  component: Home,
});

function Home() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img src={hero} alt="Festival dancers in vyshyvanka at golden hour" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-[color:var(--ink)]/30 via-[color:var(--ink)]/40 to-[color:var(--background)]" />
        </div>
        <div className="relative container-page pt-28 pb-32 lg:pt-40 lg:pb-44">
          <div className="ribbon h-1 w-24 rounded-full mb-6" />
          <p className="eyebrow text-[color:var(--cream)]/90">Summer 2026 · Canada</p>
          <h1 className="display-xl mt-3 max-w-3xl text-[color:var(--cream)]">
            A festival of Ukrainian-Canadian <span className="italic text-[color:var(--wheat)]">soul</span>.
          </h1>
          <p className="mt-6 max-w-xl text-lg text-[color:var(--cream)]/85">
            Three days of music, dance, food, and craft. Book a vendor booth, perform on our stages, or join thousands of guests.
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <Link to="/vendors"><Button size="lg" className="rounded-full px-7">Book a vendor spot <ArrowRight className="ml-2 h-4 w-4" /></Button></Link>
            <Link to="/festival-info"><Button size="lg" variant="outline" className="rounded-full px-7 bg-[color:var(--cream)]/10 border-[color:var(--cream)]/40 text-[color:var(--cream)] hover:bg-[color:var(--cream)]/20 hover:text-[color:var(--cream)]">Festival info</Button></Link>
          </div>
          <div className="mt-12 flex flex-wrap gap-x-8 gap-y-2 text-sm text-[color:var(--cream)]/80">
            <span className="inline-flex items-center gap-2"><Calendar className="h-4 w-4" /> July 17–19, 2026</span>
            <span className="inline-flex items-center gap-2"><MapPin className="h-4 w-4" /> Festival Grounds, Canada</span>
          </div>
        </div>
      </section>

      {/* Pillars */}
      <section className="container-page py-20 lg:py-28">
        <div className="max-w-2xl">
          <p className="eyebrow">What awaits</p>
          <h2 className="display-lg mt-2">A weekend rooted in tradition, alive with the new.</h2>
        </div>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {[
            { icon: Music, title: "Live stages", body: "Folk ensembles, modern Ukrainian artists, and rising Canadian voices across two stages." },
            { icon: ShoppingBag, title: "Artisan market", body: "Hand-embroidered linens, ceramics, pysanky, and contemporary makers — all in one square." },
            { icon: HandHeart, title: "Community first", body: "A nonprofit-led gathering. Volunteers and sponsors keep the festival free for families." },
          ].map(({ icon: Icon, title, body }) => (
            <div key={title} className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--card)] p-7 shadow-[var(--shadow-soft)]">
              <Icon className="h-7 w-7 text-[color:var(--primary)]" />
              <h3 className="mt-5 font-display text-2xl">{title}</h3>
              <p className="mt-2 text-sm text-[color:var(--muted-foreground)] leading-relaxed">{body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Get involved */}
      <section className="bg-[color:var(--cream)] border-y border-[color:var(--border)]">
        <div className="container-page py-20 lg:py-28">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
            <div>
              <p className="eyebrow">Be part of it</p>
              <h2 className="display-lg mt-2">Four ways to join Festua.</h2>
            </div>
          </div>
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {[
              { to: "/vendors", title: "Vendors", body: "Apply for a booth on our interactive map.", icon: Store },
              { to: "/entertainment", title: "Artists", body: "Perform on the main or community stage.", icon: Music },
              { to: "/volunteers", title: "Volunteers", body: "Pick a shift, choose your area.", icon: HandHeart },
              { to: "/sponsors", title: "Sponsors", body: "Bronze to Platinum tiers + custom.", icon: ShoppingBag },
            ].map(({ to, title, body, icon: Icon }) => (
              <Link key={to} to={to} className="group rounded-2xl bg-[color:var(--card)] p-6 border border-[color:var(--border)] hover:border-[color:var(--primary)] transition-colors">
                <Icon className="h-6 w-6 text-[color:var(--secondary)]" />
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

      {/* Editorial split */}
      <section className="container-page py-20 lg:py-28 grid gap-10 lg:grid-cols-2 lg:items-center">
        <div className="grid grid-cols-2 gap-4">
          <img src={pysanky} alt="Hand-painted pysanky" loading="lazy" className="rounded-2xl aspect-[4/5] object-cover row-span-2" />
          <img src={food} alt="Festival food vendors" loading="lazy" className="rounded-2xl aspect-square object-cover" />
          <img src={stage} alt="Stage performance" loading="lazy" className="rounded-2xl aspect-square object-cover" />
        </div>
        <div>
          <p className="eyebrow">Built different</p>
          <h2 className="display-lg mt-2">A festival platform — not just a website.</h2>
          <p className="mt-5 text-[color:var(--muted-foreground)] leading-relaxed">
            Festua runs on a real-time backend: vendors book booths from a live map, artists submit tech riders online, volunteers pick their own shifts, and sponsors check out instantly. Everything is approved, paid, and tracked — automatically.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/vendors"><Button size="lg" className="rounded-full">Open the vendor map</Button></Link>
            <Link to="/sponsors"><Button size="lg" variant="outline" className="rounded-full">Sponsor tiers</Button></Link>
          </div>
        </div>
      </section>
    </>
  );
}
