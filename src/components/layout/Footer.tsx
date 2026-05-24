import { Link } from "@tanstack/react-router";
import logo from "@/assets/nuff-logo.png";
import { useSiteSettings } from "@/lib/site-content";

export function Footer() {
  const s = useSiteSettings();
  return (
    <footer className="border-t border-[color:var(--border)] mt-24 bg-[color:var(--cream)]">
      <div className="ribbon h-1.5 w-full" />
      <div className="container-page py-14 grid gap-10 md:grid-cols-4">
        <div className="md:col-span-2">
          <div className="flex items-center gap-3">
            <img src={logo} alt="NUFF" className="h-14 w-auto" />
            <div>
              <div className="font-display text-2xl font-bold tracking-tight text-[color:var(--primary)]">NUFF</div>
              <div className="text-xs uppercase tracking-[0.14em] text-[color:var(--muted-foreground)]">Niagara Ukrainian Family Festival</div>
            </div>
          </div>
          <p className="mt-4 text-sm text-[color:var(--muted-foreground)] max-w-md">
            {s.festival_dates} · {s.location_name}, Niagara Falls. A celebration of Ukrainian heritage in the heart of Niagara.
          </p>
        </div>
        <div>
          <div className="eyebrow mb-3">Festival</div>
          <ul className="space-y-2 text-sm">
            <li><Link to="/festival">Schedule & Location</Link></li>
            <li><Link to="/entertainment">Entertainment</Link></li>
            <li><Link to="/merch">Merch Store</Link></li>
            <li><Link to="/about">About NUFF</Link></li>
          </ul>
        </div>
        <div>
          <div className="eyebrow mb-3">Get involved</div>
          <ul className="space-y-2 text-sm">
            <li><Link to="/vendors">Apply as Vendor</Link></li>
            <li><Link to="/volunteers">Volunteer</Link></li>
            <li><Link to="/sponsors">Sponsor</Link></li>
            <li><Link to="/contact">Contact</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-[color:var(--border)]">
        <div className="container-page py-5 flex flex-col sm:flex-row justify-between gap-2 text-xs text-[color:var(--muted-foreground)]">
          <div>© {new Date().getFullYear()} Niagara Ukrainian Family Festival. All rights reserved.</div>
          <div>{s.contact_email} · Niagara Falls, Ontario 🇨🇦 🇺🇦</div>
        </div>
      </div>
    </footer>
  );
}
