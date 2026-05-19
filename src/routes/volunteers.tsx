import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/lib/auth-context";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const Route = createFileRoute("/volunteers")({
  component: VolunteersPage,
  head: () => ({
    meta: [
      { title: "Volunteer — NUFF | Niagara Ukrainian Family Festival" },
      { name: "description", content: "Join the NUFF volunteer crew. Pick your roles, choose your availability, and help create unforgettable cultural moments." },
    ],
  }),
});

const ROLES = [
  "Setup / Teardown",
  "Guest Services",
  "Food Support",
  "Stage Assistant",
  "Kids' Zone",
  "Parking & Traffic",
  "Vendor Liaison",
  "Cleanup Crew",
];

const DAYS = [
  { value: "sat-jul-11", label: "Saturday · July 11" },
  { value: "sun-jul-12", label: "Sunday · July 12" },
  { value: "both", label: "Both days" },
];

function VolunteersPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [roles, setRoles] = useState<Set<string>>(new Set());
  const [days, setDays] = useState<Set<string>>(new Set());
  const [form, setForm] = useState({
    full_name: user?.user_metadata?.full_name ?? "",
    contact_email: user?.email ?? "",
    contact_phone: "",
    notes: "",
  });

  const toggle = (set: Set<string>, setter: (s: Set<string>) => void, v: string) => {
    const n = new Set(set);
    n.has(v) ? n.delete(v) : n.add(v);
    setter(n);
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.info("Please sign in to submit your application.");
      navigate({ to: "/login", search: { redirect: "/volunteers" } });
      return;
    }
    if (roles.size === 0) return toast.error("Pick at least one role.");
    if (days.size === 0) return toast.error("Pick at least one day.");
    setLoading(true);
    const { error } = await supabase.from("volunteer_applications").insert({
      ...form,
      user_id: user.id,
      interests: [...Array.from(roles), ...Array.from(days).map((d) => `day:${d}`)],
      selected_shifts: [],
    });
    setLoading(false);
    if (error) return toast.error(error.message);
    toast.success("Thanks! We'll confirm your shifts by email.");
    navigate({ to: "/dashboard" });
  };

  return (
    <>
      <PageHeader
        eyebrow="Crew up"
        title="Volunteer with NUFF"
        subtitle="Help us run the most welcoming festival in the region. Pick your roles, pick your days."
      />
      <section className="container-page py-12 lg:py-16 max-w-3xl">
        <form onSubmit={submit} className="space-y-8 rounded-2xl border border-[color:var(--border)] bg-[color:var(--card)] p-6 sm:p-8 shadow-[var(--shadow-soft)]">
          <div className="grid sm:grid-cols-2 gap-4">
            <div><Label>Full name</Label><Input required value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} /></div>
            <div><Label>Phone</Label><Input value={form.contact_phone} onChange={(e) => setForm({ ...form, contact_phone: e.target.value })} /></div>
          </div>
          <div><Label>Email</Label><Input type="email" required value={form.contact_email} onChange={(e) => setForm({ ...form, contact_email: e.target.value })} /></div>

          <div>
            <Label className="mb-3 block">Select roles you're interested in</Label>
            <div className="flex flex-wrap gap-2">
              {ROLES.map((r) => (
                <button type="button" key={r} onClick={() => toggle(roles, setRoles, r)}
                  className={`px-3 py-1.5 rounded-full text-sm border transition-all ${roles.has(r) ? "bg-[color:var(--primary)] text-[color:var(--primary-foreground)] border-[color:var(--primary)]" : "border-[color:var(--border)] hover:border-[color:var(--primary)]"}`}>
                  {r}
                </button>
              ))}
            </div>
          </div>

          <div>
            <Label className="mb-3 block">Select your availability</Label>
            <div className="grid sm:grid-cols-2 gap-2">
              {DAYS.map((d) => (
                <button type="button" key={d.value} onClick={() => toggle(days, setDays, d.value)}
                  className={`px-4 py-3 rounded-lg text-sm font-medium border text-left transition-all ${days.has(d.value) ? "bg-[color:var(--primary)] text-[color:var(--primary-foreground)] border-[color:var(--primary)]" : "border-[color:var(--border)] hover:border-[color:var(--primary)]"}`}>
                  {d.label}
                </button>
              ))}
            </div>
          </div>

          <div><Label>Anything else? (experience, accessibility needs, group sign-ups)</Label><Textarea rows={3} value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} /></div>

          {!user && (
            <p className="text-sm text-[color:var(--muted-foreground)]">
              You'll need to <Link to="/login" search={{ redirect: "/volunteers" }} className="text-[color:var(--primary)] underline">sign in</Link> or <Link to="/signup" className="text-[color:var(--primary)] underline">create an account</Link> to submit.
            </p>
          )}
          <Button type="submit" disabled={loading} size="lg" className="w-full">{loading ? "Submitting…" : "Submit application"}</Button>
        </form>
      </section>
    </>
  );
}
