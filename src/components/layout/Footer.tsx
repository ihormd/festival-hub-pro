import { Link } from "@tanstack/react-router";

export function Footer() {
  return (
    <footer className="border-t border-[color:var(--border)] mt-24 bg-[color:var(--cream)]">
      <div className="ribbon h-1.5 w-full" />
      <div className="container-page py-14 grid gap-10 md:grid-cols-4">
        <div className="md:col-span-2">
          <div className="font-display text-3xl font-semibold tracking-tight">festua<span className="text-[color:var(--secondary)]">.</span></div>
          <p className="mt-3 text-sm text-[color:var(--muted-foreground)] max-w-md">
            A celebration of Ukrainian-Canadian culture — music, food, craft, and community. Each summer in Canada.
          </p>
        </div>
        <div>
          <div className="eyebrow mb-3">Festival</div>
          <ul className="space-y-2 text-sm">
            <li><Link to="/festival-info">Schedule & Location</Link></li>
            <li><Link to="/entertainment">Entertainment</Link></li>
            <li><Link to="/merch">Merch Store</Link></li>
          </ul>
        </div>
        <div>
          <div className="eyebrow mb-3">Get involved</div>
          <ul className="space-y-2 text-sm">
            <li><Link to="/vendors">Apply as Vendor</Link></li>
            <li><Link to="/volunteers">Volunteer</Link></li>
            <li><Link to="/sponsors">Sponsor</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-[color:var(--border)]">
        <div className="container-page py-5 flex flex-col sm:flex-row justify-between gap-2 text-xs text-[color:var(--muted-foreground)]">
          <div>© {new Date().getFullYear()} Festua. All rights reserved.</div>
          <div>festua.ca · Made with care in Canada 🇨🇦</div>
        </div>
      </div>
    </footer>
  );
}
