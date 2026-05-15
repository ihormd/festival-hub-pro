import { createFileRoute, Link } from "@tanstack/react-router";
import { useAuth } from "@/lib/auth-context";
import { Store, Music, HandHeart, Heart, ShoppingBag, Map } from "lucide-react";

export const Route = createFileRoute("/_authenticated/dashboard")({
  component: Dashboard,
  head: () => ({ meta: [{ title: "Dashboard — Festua" }] }),
});

const cards = [
  { to: "/apply/vendor", icon: Store, title: "Apply as Vendor", desc: "Reserve a booth on the festival map." },
  { to: "/apply/artist", icon: Music, title: "Apply as Artist", desc: "Submit portfolio + tech rider." },
  { to: "/apply/volunteer", icon: HandHeart, title: "Volunteer", desc: "Pick shifts and interest areas." },
  { to: "/sponsors", icon: Heart, title: "Sponsor", desc: "Choose a tier and pay securely." },
  { to: "/vendors", icon: Map, title: "Vendor Map", desc: "Live availability for booth spots." },
  { to: "/merch", icon: ShoppingBag, title: "Merch", desc: "Festival apparel & gifts." },
] as const;

function Dashboard() {
  const { user } = useAuth();
  return (
    <div className="container-page py-12">
      <h1 className="font-display text-3xl md:text-4xl font-semibold">Hi {user?.user_metadata?.full_name ?? "there"} 👋</h1>
      <p className="mt-2 text-[color:var(--muted-foreground)]">What would you like to do today?</p>
      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((c) => (
          <Link key={c.to} to={c.to} className="group rounded-xl border border-[color:var(--border)] p-6 hover:border-[color:var(--primary)] hover:shadow-sm transition-all bg-[color:var(--card)]">
            <c.icon className="h-6 w-6 text-[color:var(--primary)] mb-4" />
            <h3 className="font-display text-lg font-semibold">{c.title}</h3>
            <p className="text-sm text-[color:var(--muted-foreground)] mt-1">{c.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
