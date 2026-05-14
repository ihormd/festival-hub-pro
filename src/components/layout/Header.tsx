import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { Menu, X, User as UserIcon } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";

const nav = [
  { to: "/festival-info", label: "Festival Info" },
  { to: "/entertainment", label: "Entertainment" },
  { to: "/vendors", label: "Vendors" },
  { to: "/volunteers", label: "Volunteers" },
  { to: "/sponsors", label: "Sponsors" },
  { to: "/merch", label: "Merch" },
] as const;

export function Header() {
  const [open, setOpen] = useState(false);
  const { user, isAdmin, signOut } = useAuth();

  return (
    <header className="sticky top-0 z-40 border-b border-[color:var(--border)] bg-[color:var(--background)]/85 backdrop-blur supports-[backdrop-filter]:bg-[color:var(--background)]/70">
      <div className="container-page flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="ribbon h-8 w-1.5 rounded-full" />
          <span className="font-display text-2xl font-semibold tracking-tight">festua<span className="text-[color:var(--secondary)]">.</span></span>
        </Link>

        <nav className="hidden lg:flex items-center gap-7">
          {nav.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              className="text-sm font-medium text-[color:var(--muted-foreground)] hover:text-[color:var(--foreground)] transition-colors"
              activeProps={{ className: "text-[color:var(--foreground)]" }}
            >
              {n.label}
            </Link>
          ))}
        </nav>

        <div className="hidden lg:flex items-center gap-2">
          {user ? (
            <>
              <Link to="/dashboard">
                <Button variant="ghost" size="sm"><UserIcon className="h-4 w-4 mr-1.5" />Account</Button>
              </Link>
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
