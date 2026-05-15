import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth-context";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/apply/vendor")({
  component: VendorApply,
  head: () => ({ meta: [{ title: "Vendor Application — Festua" }] }),
});

function VendorApply() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [spots, setSpots] = useState<{ id: string; code: string }[]>([]);
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    business_name: "", category: "food", description: "",
    contact_email: user?.email ?? "", contact_phone: "", requested_spot_id: "",
  });

  useEffect(() => {
    supabase.from("vendor_spots").select("id, code").eq("status", "available").order("code").then(({ data }) => setSpots(data ?? []));
  }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setLoading(true);
    const document_urls: string[] = [];
    for (const f of files) {
      const path = `${user.id}/${Date.now()}-${f.name}`;
      const { error } = await supabase.storage.from("vendor-docs").upload(path, f);
      if (error) { toast.error(`Upload failed: ${error.message}`); setLoading(false); return; }
      document_urls.push(path);
    }
    const { error } = await supabase.from("vendor_applications").insert({
      ...form,
      requested_spot_id: form.requested_spot_id || null,
      user_id: user.id,
      document_urls,
    });
    setLoading(false);
    if (error) return toast.error(error.message);
    toast.success("Application submitted. We'll review and get back to you.");
    navigate({ to: "/dashboard" });
  };

  return (
    <>
      <PageHeader eyebrow="Vendor" title="Vendor application" subtitle="Tell us about your business and upload required permits. Pick your preferred booth on the map." />
      <section className="container-page py-12 max-w-2xl">
        <form onSubmit={submit} className="space-y-5">
          <div><Label>Business name</Label><Input required value={form.business_name} onChange={(e) => setForm({ ...form, business_name: e.target.value })} /></div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <Label>Category</Label>
              <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="food">Food</SelectItem>
                  <SelectItem value="retail">Retail / Crafts</SelectItem>
                  <SelectItem value="service">Service</SelectItem>
                  <SelectItem value="nonprofit">Non-profit</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Preferred spot</Label>
              <Select value={form.requested_spot_id} onValueChange={(v) => setForm({ ...form, requested_spot_id: v })}>
                <SelectTrigger><SelectValue placeholder="Pick from available" /></SelectTrigger>
                <SelectContent className="max-h-72">{spots.map((s) => <SelectItem key={s.id} value={s.id}>{s.code}</SelectItem>)}</SelectContent>
              </Select>
            </div>
          </div>
          <div><Label>Description</Label><Textarea rows={4} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div><Label>Contact email</Label><Input type="email" required value={form.contact_email} onChange={(e) => setForm({ ...form, contact_email: e.target.value })} /></div>
            <div><Label>Contact phone</Label><Input value={form.contact_phone} onChange={(e) => setForm({ ...form, contact_phone: e.target.value })} /></div>
          </div>
          <div>
            <Label>Permits / Insurance documents</Label>
            <Input type="file" multiple accept=".pdf,.jpg,.jpeg,.png" onChange={(e) => setFiles(Array.from(e.target.files ?? []))} />
            <p className="text-xs text-[color:var(--muted-foreground)] mt-1">PDF, JPG, or PNG. Multiple allowed.</p>
          </div>
          <Button type="submit" disabled={loading} size="lg" className="w-full">{loading ? "Submitting…" : "Submit application"}</Button>
        </form>
      </section>
    </>
  );
}
