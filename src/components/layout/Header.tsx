import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { Menu, X, User as UserIcon, ShoppingBag, ChevronDown } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { useCart } from "@/lib/cart-store";
import { useSiteSettings } from "@/lib/site-content";
import logo from "@/assets/nuff-logo.png";

export function Header() {
  const [open, setOpen] = useState(false);
  const [involvedOpen, setInvolvedOpen] = useState(false);
  const { user, isAdmin, signOut } = useAuth();
  const items = useCart();
  const s = useSiteSettings();
  const cartCount = items.reduce((sum, i) => sum + i.qty, 0);

  const mainNav = [
    { to: "/festival", label: s.header_nav_festival },
    { to: "/entertainment", label: s.header_nav_entertainment },
    { to: "/merch", label: s.header_nav_merch },
    { to: "/about", label: s.header_nav_about },
    { to: "/contact", label: s.header_nav_contact },
  ] as const;

  const involvedNav = [
    { to: "/artists", label: s.header_nav_artists_label, desc: s.header_nav_artists_desc },
    { to: "/vendors", label: s.header_nav_vendors_label, desc: s.header_nav_vendors_desc },
    { to: "/volunteers", label: s.header_nav_volunteers_label, desc: s.header_nav_volunteers_desc },
    { to: "/sponsors", label: s.header_nav_sponsors_label, desc: s.header_nav_sponsors_desc },
  ] as const;

  return (
    <header className="sticky top-0 z-40 border-b border-[color:var(--border)] bg-[color:var(--background)]/90 backdrop-blur supports-[backdrop-filter]:bg-[color:var(--background)]/75">
      <div className="container-page flex h-20 items-center justify-between gap-4">
        <Link to="/" className="flex items-center shrink-0" aria-label={s.header_logo_alt}>
          <img src={logo} alt={s.header_logo_alt} className="h-14 w-auto" />
        </Link>

        <nav className="hidden lg:flex items-center gap-7">
          {mainNav.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              className="text-sm font-medium text-[color:var(--muted-foreground)] hover:text-[color:var(--foreground)] transition-colors"
              activeProps={{ className: "text-[color:var(--primary)] font-semibold" }}
            >
              {n.label}
            </Link>
          ))}

          <div
            className="relative"
            onMouseEnter={() => setInvolvedOpen(true)}
            onMouseLeave={() => setInvolvedOpen(false)}
          >
            <button
              onClick={() => setInvolvedOpen((o) => !o)}
              className="inline-flex items-center gap-1 text-sm font-medium text-[color:var(--muted-foreground)] hover:text-[color:var(--foreground)] transition-colors"
            >
              {s.header_nav_involved_label} <ChevronDown className={`h-4 w-4 transition-transform ${involvedOpen ? "rotate-180" : ""}`} />
            </button>
            {involvedOpen && (
              <div className="absolute right-0 top-full pt-3 w-72 z-50">
                <div className="rounded-xl border border-[color:var(--border)] bg-[color:var(--card)] shadow-lg p-2">
                  {involvedNav.map((n) => (
                    <Link
                      key={n.to}
                      to={n.to}
                      onClick={() => setInvolvedOpen(false)}
                      className="block rounded-lg px-3 py-2.5 hover:bg-[color:var(--muted)] transition-colors"
                    >
                      <div className="font-semibold text-sm">{n.label}</div>
                      <div className="text-xs text-[color:var(--muted-foreground)] mt-0.5">{n.desc}</div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </nav>

        <div className="hidden md:flex items-center gap-2">
          <Link to="/merch" className="relative" aria-label="Cart">
            <Button variant="ghost" size="sm"><ShoppingBag className="h-4 w-4" />
              {cartCount > 0 && <span className="ml-1.5 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-[color:var(--primary)] text-[color:var(--primary-foreground)] text-xs font-semibold px-1.5">{cartCount}</span>}
            </Button>
          </Link>
          {user ? (
            <>
              <Link to="/dashboard"><Button variant="ghost" size="sm"><UserIcon className="h-4 w-4 mr-1.5" />Account</Button></Link>
              {isAdmin && <Link to="/admin"><Button variant="outline" size="sm">Admin</Button></Link>}
              <Button variant="ghost" size="sm" onClick={signOut}>Sign out</Button>
            </>
          ) : (
            <>
              <Link to="/login"><Button variant="ghost" size="sm">Sign in</Button></Link>
              <Link to="/signup"><Button size="sm">Get involved</Button></Link>
            </>
          )}
        </div>

        <button onClick={() => setOpen(!open)} className="lg:hidden p-2 -mr-2" aria-label="Menu">
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {open && (
        <div className="lg:hidden border-t border-[color:var(--border)] bg-[color:var(--background)]">
          <div className="container-page py-4 flex flex-col gap-1">
            {mainNav.map((n) => (
              <Link key={n.to} to={n.to} onClick={() => setOpen(false)} className="px-2 py-2.5 rounded-md text-base font-medium hover:bg-[color:var(--muted)]">
                {n.label}
              </Link>
            ))}
            <div className="px-2 pt-3 pb-1 text-xs uppercase tracking-wider text-[color:var(--muted-foreground)] font-semibold">{s.header_nav_involved_label}</div>
            {involvedNav.map((n) => (
              <Link key={n.to} to={n.to} onClick={() => setOpen(false)} className="px-2 py-2 rounded-md text-base hover:bg-[color:var(--muted)]">
                {n.label}
              </Link>
            ))}
            <div className="border-t border-[color:var(--border)] mt-2 pt-2 flex flex-col gap-2">
              {user ? (
                <>
                  <Link to="/dashboard" onClick={() => setOpen(false)}><Button variant="ghost" className="w-full justify-start">Account</Button></Link>
                  {isAdmin && <Link to="/admin" onClick={() => setOpen(false)}><Button variant="outline" className="w-full">Admin</Button></Link>}
                  <Button variant="ghost" className="w-full justify-start" onClick={() => { signOut(); setOpen(false); }}>Sign out</Button>
                </>
              ) : (
                <>
                  <Link to="/login" onClick={() => setOpen(false)}><Button variant="ghost" className="w-full">Sign in</Button></Link>
                  <Link to="/signup" onClick={() => setOpen(false)}><Button className="w-full">Get involved</Button></Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
