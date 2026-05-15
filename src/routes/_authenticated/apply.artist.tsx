import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth-context";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/apply/artist")({
  component: ArtistApply,
  head: () => ({ meta: [{ title: "Artist Application — Festua" }] }),
});

function ArtistApply() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [rider, setRider] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    stage_name: "", bio: "", portfolio_links: "",
    contact_email: user?.email ?? "", contact_phone: "",
    set_length_minutes: 30, stage_preference: "main",
  });

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setLoading(true);
    let tech_rider_url: string | null = null;
    if (rider) {
      const path = `${user.id}/${Date.now()}-${rider.name}`;
      const { error } = await supabase.storage.from("artist-riders").upload(path, rider);
      if (error) { toast.error(error.message); setLoading(false); return; }
      tech_rider_url = path;
    }
    const { error } = await supabase.from("artist_applications").insert({
      stage_name: form.stage_name,
      bio: form.bio,
      portfolio_links: form.portfolio_links.split("\n").map((s) => s.trim()).filter(Boolean),
      contact_email: form.contact_email,
      contact_phone: form.contact_phone,
      set_length_minutes: form.set_length_minutes,
      stage_preference: form.stage_preference,
      tech_rider_url,
      user_id: user.id,
    });
    setLoading(false);
    if (error) return toast.error(error.message);
    toast.success("Submitted! Our booking team will review and reply.");
    navigate({ to: "/dashboard" });
  };

  return (
    <>
      <PageHeader eyebrow="Artist" title="Apply to perform" subtitle="Share your work, set length, and tech requirements." />
      <section className="container-page py-12 max-w-2xl">
        <form onSubmit={submit} className="space-y-5">
          <div><Label>Stage name</Label><Input required value={form.stage_name} onChange={(e) => setForm({ ...form, stage_name: e.target.value })} /></div>
          <div><Label>Short bio</Label><Textarea rows={4} value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} /></div>
          <div><Label>Portfolio links (one per line)</Label><Textarea rows={3} placeholder="https://youtube.com/..." value={form.portfolio_links} onChange={(e) => setForm({ ...form, portfolio_links: e.target.value })} /></div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <Label>Stage preference</Label>
              <Select value={form.stage_preference} onValueChange={(v) => setForm({ ...form, stage_preference: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="main">Main stage</SelectItem>
                  <SelectItem value="acoustic">Acoustic stage</SelectItem>
                  <SelectItem value="kids">Kids' Zone</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Set length (min)</Label>
              <Input type="number" min={10} max={120} value={form.set_length_minutes} onChange={(e) => setForm({ ...form, set_length_minutes: parseInt(e.target.value) })} />
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div><Label>Email</Label><Input type="email" required value={form.contact_email} onChange={(e) => setForm({ ...form, contact_email: e.target.value })} /></div>
            <div><Label>Phone</Label><Input value={form.contact_phone} onChange={(e) => setForm({ ...form, contact_phone: e.target.value })} /></div>
          </div>
          <div>
            <Label>Tech rider (PDF)</Label>
            <Input type="file" accept=".pdf" onChange={(e) => setRider(e.target.files?.[0] ?? null)} />
          </div>
          <Button type="submit" disabled={loading} size="lg" className="w-full">{loading ? "Submitting…" : "Submit application"}</Button>
        </form>
      </section>
    </>
  );
}
