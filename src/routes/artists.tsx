import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Mic2, Users, Calendar } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth-context";
import { toast } from "sonner";

export const Route = createFileRoute("/artists")({
  component: ArtistsPage,
  head: () => ({
    meta: [
      { title: "Artists — Perform at NUFF | Niagara Ukrainian Family Festival" },
      { name: "description", content: "Apply to perform at NUFF 2026 on the main stage. Traditional and contemporary acts, full hospitality and tech rider support." },
    ],
  }),
});

const PERFORMANCE_TYPES = [
  "Solo musician",
  "Band / ensemble",
  "Folk dance group",
  "Choir / vocal ensemble",
  "DJ / electronic",
  "Bandura / traditional instrument",
  "Spoken word / poetry",
  "Other",
];

function ArtistsPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    stage_name: "",
    bio: "",
    performance_type: "",
    equipment: "",
    social_links: "",
    media_link: "",
    contact_email: user?.email ?? "",
    contact_phone: "",
    set_length_minutes: 30,
    stage_preference: "main",
  });

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.info("Please sign in to submit your application.");
      navigate({ to: "/login", search: { redirect: "/artists" } });
      return;
    }
    if (!form.performance_type) return toast.error("Please choose a performance type.");
    setLoading(true);
    const portfolio_links = [form.media_link, ...form.social_links.split("\n")]
      .map((s) => s.trim()).filter(Boolean);
    const { error } = await supabase.from("artist_applications").insert({
      stage_name: form.stage_name,
      bio: `${form.bio}\n\n— Performance type: ${form.performance_type}\n— Equipment required: ${form.equipment}`,
      portfolio_links,
      contact_email: form.contact_email,
      contact_phone: form.contact_phone,
      set_length_minutes: form.set_length_minutes,
      stage_preference: form.stage_preference,
      user_id: user.id,
    });
    setLoading(false);
    if (error) return toast.error(error.message);
    toast.success("Submitted! Our booking team will review and reply.");
    navigate({ to: "/dashboard" });
  };

  return (
    <>
      <PageHeader
        eyebrow="Perform at NUFF"
        title="Take the NUFF stage"
        subtitle="One main stage, two days, a packed crowd of families and culture lovers. We program traditional Ukrainian acts alongside contemporary voices."
      />

      <section className="container-page py-12 grid lg:grid-cols-3 gap-6">
        {[
          { icon: Mic2, title: "Main stage", body: "Our single main stage — full PA, monitors, backline, lighting rig. Headliner, feature, and emerging slots throughout the weekend." },
          { icon: Calendar, title: "July 12–13, 2026", body: "Two-day festival at Fireman's Park, Niagara Falls. Set lengths from 20 to 60 minutes." },
          { icon: Users, title: "What you get", body: "Hospitality, parking, vendor passes for your crew, and a connected Niagara audience." },
        ].map((s) => (
          <div key={s.title} className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--card)] p-6">
            <s.icon className="h-6 w-6 text-[color:var(--primary)] mb-3" />
            <h3 className="font-display text-xl mb-1.5">{s.title}</h3>
            <p className="text-sm text-[color:var(--muted-foreground)] leading-relaxed">{s.body}</p>
          </div>
        ))}
      </section>

      <section className="container-page pb-16 max-w-3xl">
        <h2 className="font-display text-2xl mb-6">Artist application</h2>
        <form onSubmit={submit} className="space-y-6 rounded-2xl border border-[color:var(--border)] bg-[color:var(--card)] p-6 sm:p-8 shadow-[var(--shadow-soft)]">
          <div className="grid sm:grid-cols-2 gap-4">
            <div><Label>Stage / artist name</Label><Input required value={form.stage_name} onChange={(e) => setForm({ ...form, stage_name: e.target.value })} /></div>
            <div>
              <Label>Performance type</Label>
              <Select value={form.performance_type} onValueChange={(v) => setForm({ ...form, performance_type: v })}>
                <SelectTrigger><SelectValue placeholder="Choose one…" /></SelectTrigger>
                <SelectContent>
                  {PERFORMANCE_TYPES.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div><Label>Short bio</Label><Textarea rows={4} value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} /></div>

          <div><Label>Equipment required</Label>
            <Textarea rows={3} placeholder="What you bring vs. what you need from us (mics, DI, monitors, backline, lighting…)" value={form.equipment} onChange={(e) => setForm({ ...form, equipment: e.target.value })} />
          </div>

          <div><Label>Audio / video link</Label>
            <Input placeholder="https://youtube.com/… or https://soundcloud.com/…" value={form.media_link} onChange={(e) => setForm({ ...form, media_link: e.target.value })} />
          </div>

          <div><Label>Social media links (one per line)</Label>
            <Textarea rows={3} placeholder="https://instagram.com/…&#10;https://tiktok.com/…&#10;https://spotify.com/…" value={form.social_links} onChange={(e) => setForm({ ...form, social_links: e.target.value })} />
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <Label>Preferred day</Label>
              <Select value={form.stage_preference} onValueChange={(v) => setForm({ ...form, stage_preference: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="sun-jul-12">Sunday · July 12</SelectItem>
                  <SelectItem value="mon-jul-13">Monday · July 13</SelectItem>
                  <SelectItem value="either">Either day</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Set length (min)</Label>
              <Input type="number" min={10} max={120} value={form.set_length_minutes} onChange={(e) => setForm({ ...form, set_length_minutes: parseInt(e.target.value) || 30 })} />
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div><Label>Contact email</Label><Input type="email" required value={form.contact_email} onChange={(e) => setForm({ ...form, contact_email: e.target.value })} /></div>
            <div><Label>Contact phone</Label><Input value={form.contact_phone} onChange={(e) => setForm({ ...form, contact_phone: e.target.value })} /></div>
          </div>

          {!user && (
            <p className="text-sm text-[color:var(--muted-foreground)]">
              You'll need to <Link to="/login" search={{ redirect: "/artists" }} className="text-[color:var(--primary)] underline">sign in</Link> or <Link to="/signup" className="text-[color:var(--primary)] underline">create an account</Link> to submit.
            </p>
          )}
          <Button type="submit" disabled={loading} size="lg" className="w-full">{loading ? "Submitting…" : "Submit application"}</Button>
        </form>
      </section>
    </>
  );
}
