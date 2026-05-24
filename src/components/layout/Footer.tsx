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
            <img src={logo} alt={s.festival_short_name} className="h-14 w-auto" />
            <div>
              <div className="font-display text-2xl font-bold tracking-tight text-[color:var(--primary)]">{s.festival_short_name}</div>
              <div className="text-xs uppercase tracking-[0.14em] text-[color:var(--muted-foreground)]">{s.festival_name}</div>
            </div>
          </div>
          <p className="mt-4 text-sm text-[color:var(--muted-foreground)] max-w-md">
            {s.festival_dates} · {s.location_name}, Niagara Falls. {s.footer_tagline}
          </p>
        </div>
        <div>
          <div className="eyebrow mb-3">{s.footer_col1_title}</div>
          <ul className="space-y-2 text-sm">
            <li><Link to="/festival">{s.header_nav_festival}</Link></li>
            <li><Link to="/entertainment">{s.header_nav_entertainment}</Link></li>
            <li><Link to="/merch">{s.header_nav_merch}</Link></li>
            <li><Link to="/about">{s.header_nav_about}</Link></li>
          </ul>
        </div>
        <div>
          <div className="eyebrow mb-3">{s.footer_col2_title}</div>
          <ul className="space-y-2 text-sm">
            <li><Link to="/vendors">{s.header_nav_vendors_label}</Link></li>
            <li><Link to="/volunteers">{s.header_nav_volunteers_label}</Link></li>
            <li><Link to="/sponsors">{s.header_nav_sponsors_label}</Link></li>
            <li><Link to="/contact">{s.header_nav_contact}</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-[color:var(--border)]">
        <div className="container-page py-5 flex flex-col sm:flex-row justify-between gap-2 text-xs text-[color:var(--muted-foreground)]">
          <div>© {new Date().getFullYear()} {s.footer_copyright}</div>
          <div>{s.footer_contact_display}</div>
        </div>
      </div>
    </footer>
  );
}
