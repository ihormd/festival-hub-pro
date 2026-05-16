import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { Menu, X, User as UserIcon, ShoppingBag } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { useCart } from "@/lib/cart-store";
import logo from "@/assets/nuff-logo.png";

const nav = [
  { to: "/festival-info", label: "Festival Info" },
  { to: "/entertainment", label: "Entertainment" },
  { to: "/vendors", label: "Vendors" },
  { to: "/volunteers", label: "Volunteers" },
  { to: "/sponsors", label: "Sponsors" },
  { to: "/merch", label: "Merch" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
] as const;

export function Header() {
  const [open, setOpen] = useState(false);
  const { user, isAdmin, signOut } = useAuth();
  const items = useCart();
  const cartCount = items.reduce((s, i) => s + i.qty, 0);

  return (
    <header className="sticky top-0 z-40 border-b border-[color:var(--border)] bg-[color:var(--background)]/90 backdrop-blur supports-[backdrop-filter]:bg-[color:var(--background)]/75">
      <div className="container-page flex h-20 items-center justify-between gap-4">
        <Link to="/" className="flex items-center gap-3 group shrink-0">
          <img src={logo} alt="NUFF — Niagara Ukrainian Family Festival" className="h-12 w-auto" />
          <span className="hidden sm:flex flex-col leading-tight">
            <span className="font-display text-xl font-bold tracking-tight text-[color:var(--primary)]">NUFF</span>
            <span className="text-[10px] uppercase tracking-[0.14em] text-[color:var(--muted-foreground)] -mt-0.5">Niagara Ukrainian Festival</span>
          </span>
        </Link>

        <nav className="hidden xl:flex items-center gap-6">
          {nav.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              className="text-sm font-medium text-[color:var(--muted-foreground)] hover:text-[color:var(--foreground)] transition-colors"
              activeProps={{ className: "text-[color:var(--primary)] font-semibold" }}
            >
              {n.label}
            </Link>
          ))}
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

        <button onClick={() => setOpen(!open)} className="xl:hidden md:hidden p-2 -mr-2" aria-label="Menu">
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
        <button onClick={() => setOpen(!open)} className="hidden md:flex xl:hidden p-2" aria-label="Menu">
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div className="xl:hidden border-t border-[color:var(--border)] bg-[color:var(--background)]">
          <div className="container-page py-4 flex flex-col gap-1">
            {nav.map((n) => (
              <Link key={n.to} to={n.to} onClick={() => setOpen(false)} className="px-2 py-2.5 rounded-md text-base font-medium hover:bg-[color:var(--muted)]">
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
