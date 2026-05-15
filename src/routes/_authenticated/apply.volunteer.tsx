import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth-context";
import { toast } from "sonner";

const interests = ["Setup", "Hospitality", "Stage crew", "Kids' Zone", "Food service", "Parking", "Cleanup"];

type Shift = { id: string; area: string; description: string | null; starts_at: string; ends_at: string; capacity: number };

export const Route = createFileRoute("/_authenticated/apply/volunteer")({
  component: VolunteerApply,
  head: () => ({ meta: [{ title: "Volunteer Application — Festua" }] }),
});

function VolunteerApply() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [selectedShifts, setSelectedShifts] = useState<Set<string>>(new Set());
  const [selectedInterests, setSelectedInterests] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ full_name: user?.user_metadata?.full_name ?? "", contact_email: user?.email ?? "", contact_phone: "", notes: "" });

  useEffect(() => {
    supabase.from("volunteer_shifts").select("*").order("starts_at").then(({ data }) => setShifts(data ?? []));
  }, []);

  const toggle = (set: Set<string>, setter: (s: Set<string>) => void, v: string) => {
    const n = new Set(set);
    n.has(v) ? n.delete(v) : n.add(v);
    setter(n);
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setLoading(true);
    const { error } = await supabase.from("volunteer_applications").insert({
      ...form,
      user_id: user.id,
      interests: Array.from(selectedInterests),
      selected_shifts: Array.from(selectedShifts),
    });
    setLoading(false);
    if (error) return toast.error(error.message);
    toast.success("Thanks! We'll confirm your shifts by email.");
    navigate({ to: "/dashboard" });
  };

  return (
    <>
      <PageHeader eyebrow="Volunteer" title="Volunteer application" subtitle="Pick your interests and the shifts that work for you." />
      <section className="container-page py-12 max-w-3xl">
        <form onSubmit={submit} className="space-y-8">
          <div className="grid sm:grid-cols-2 gap-4">
            <div><Label>Full name</Label><Input required value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} /></div>
            <div><Label>Phone</Label><Input value={form.contact_phone} onChange={(e) => setForm({ ...form, contact_phone: e.target.value })} /></div>
          </div>
          <div><Label>Email</Label><Input type="email" required value={form.contact_email} onChange={(e) => setForm({ ...form, contact_email: e.target.value })} /></div>

          <div>
            <Label className="mb-3 block">Areas of interest</Label>
            <div className="flex flex-wrap gap-2">
              {interests.map((i) => (
                <button type="button" key={i} onClick={() => toggle(selectedInterests, setSelectedInterests, i)}
                  className={`px-3 py-1.5 rounded-full text-sm border transition-all ${selectedInterests.has(i) ? "bg-[color:var(--primary)] text-[color:var(--primary-foreground)] border-[color:var(--primary)]" : "border-[color:var(--border)] hover:border-[color:var(--primary)]"}`}>
                  {i}
                </button>
              ))}
            </div>
          </div>

          <div>
            <Label className="mb-3 block">Available shifts</Label>
            <div className="space-y-2">
              {shifts.length === 0 && <p className="text-sm text-[color:var(--muted-foreground)]">Shifts will appear here soon.</p>}
              {shifts.map((s) => (
                <label key={s.id} className="flex items-start gap-3 rounded-lg border border-[color:var(--border)] p-3 hover:border-[color:var(--primary)] cursor-pointer">
                  <Checkbox checked={selectedShifts.has(s.id)} onCheckedChange={() => toggle(selectedShifts, setSelectedShifts, s.id)} />
                  <div className="flex-1">
                    <div className="font-medium">{s.area}</div>
                    <div className="text-sm text-[color:var(--muted-foreground)]">
                      {new Date(s.starts_at).toLocaleString()} → {new Date(s.ends_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </div>
                    {s.description && <div className="text-sm mt-1">{s.description}</div>}
                  </div>
                </label>
              ))}
            </div>
          </div>

          <div><Label>Anything else?</Label><Textarea rows={3} value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} /></div>
          <Button type="submit" disabled={loading} size="lg" className="w-full">{loading ? "Submitting…" : "Submit application"}</Button>
        </form>
      </section>
    </>
  );
}
