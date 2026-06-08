import { createFileRoute, useSearch } from "@tanstack/react-router";
import { z } from "zod";
import { useState } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth-context";
import { toast } from "sonner";

const tierPrices: Record<string, number> = { bronze: 25000, silver: 100000, gold: 500000, platinum: 1500000 };

export const Route = createFileRoute("/sponsor/apply")({
  validateSearch: (s) => z.object({ tier: z.enum(["bronze", "silver", "gold", "platinum"]).default("bronze") }).parse(s),
  component: SponsorApply,
  head: () => ({ meta: [{ title: "Become a Sponsor — NUFF" }] }),
});

function SponsorApply() {
  const { tier } = useSearch({ from: "/sponsor/apply" });
  const { user } = useAuth();
  const [form, setForm] = useState({ company_name: "", contact_name: "", contact_email: user?.email ?? "", website_url: "", message: "", logo_url: "" });
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  const uploadLogo = async (file: File) => {
    setUploading(true);
    const path = `applications/${Date.now()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, "_")}`;
    const { error } = await supabase.storage.from("sponsor-logos").upload(path, file, { upsert: true, contentType: file.type });
    if (error) { setUploading(false); return toast.error(error.message); }
    const { data } = supabase.storage.from("sponsor-logos").getPublicUrl(path);
    setForm((f) => ({ ...f, logo_url: data.publicUrl }));
    setUploading(false);
    toast.success("Logo uploaded");
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.from("sponsorships").insert({
      ...form,
      logo_url: form.logo_url || null,
      tier: tier as any,
      amount_cents: tierPrices[tier],
      user_id: user?.id ?? null,
      payment_status: "pending",
    });
    setLoading(false);
    if (error) return toast.error(error.message);
    toast.success("Thanks! We'll email you a secure payment link shortly.");
  };

  return (
    <>
      <PageHeader eyebrow={`${tier.toUpperCase()} tier`} title={`Sponsor application — ${tier}`} subtitle={`$${(tierPrices[tier] / 100).toLocaleString()} CAD`} />
      <section className="container-page py-12 max-w-2xl">
        <form onSubmit={submit} className="space-y-5">
          <div><Label>Company name</Label><Input required value={form.company_name} onChange={(e) => setForm({ ...form, company_name: e.target.value })} /></div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div><Label>Contact name</Label><Input value={form.contact_name} onChange={(e) => setForm({ ...form, contact_name: e.target.value })} /></div>
            <div><Label>Contact email</Label><Input type="email" required value={form.contact_email} onChange={(e) => setForm({ ...form, contact_email: e.target.value })} /></div>
          </div>
          <div><Label>Website</Label><Input type="url" placeholder="https://" value={form.website_url} onChange={(e) => setForm({ ...form, website_url: e.target.value })} /></div>
          <div>
            <Label>Logo (PNG/SVG, transparent background preferred)</Label>
            <Input type="file" accept="image/*" onChange={(e) => e.target.files?.[0] && uploadLogo(e.target.files[0])} disabled={uploading} />
            {form.logo_url && <img src={form.logo_url} alt="Logo preview" className="mt-3 h-16 object-contain" />}
          </div>
          <div><Label>Message (optional)</Label><Textarea rows={4} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} /></div>
          <Button type="submit" disabled={loading || uploading} size="lg" className="w-full">{loading ? "Submitting…" : "Submit application"}</Button>
          <p className="text-xs text-[color:var(--muted-foreground)] text-center">Secure online payment via Stripe will be enabled shortly. We'll send a payment link as soon as Stripe is connected.</p>
        </form>
      </section>
    </>
  );
}

