import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth-context";
import { refreshSiteSettings } from "@/lib/site-content";
import { toast } from "sonner";
import { Trash2, Pencil, Plus } from "lucide-react";
import { useServerFn } from "@tanstack/react-start";
import { adminConfirmBookingAdmin, adminCancelBookingAdmin } from "@/lib/admin-booking.functions";

export const Route = createFileRoute("/_authenticated/admin")({
  component: Admin,
  head: () => ({ meta: [{ title: "Admin — NUFF" }] }),
});

function Admin() {
  const { isAdmin, loading } = useAuth();
  if (loading) return <div className="container-page py-12">Loading…</div>;
  if (!isAdmin)
    return (
      <div className="container-page py-12">
        <h1 className="font-display text-2xl">Admin access required</h1>
        <p className="text-[color:var(--muted-foreground)] mt-2">Contact a NUFF organizer to grant you admin role.</p>
      </div>
    );
  return (
    <>
      <PageHeader eyebrow="Internal" title="Admin dashboard" />
      <section className="container-page py-8">
        <Tabs defaultValue="bookings">
          <TabsList className="flex flex-wrap h-auto">
            <TabsTrigger value="bookings">Vendor Bookings</TabsTrigger>
            <TabsTrigger value="vendors">Vendor Apps</TabsTrigger>
            <TabsTrigger value="artists">Artists</TabsTrigger>
            <TabsTrigger value="volunteers">Volunteers</TabsTrigger>
            <TabsTrigger value="sponsorships">Sponsorships</TabsTrigger>
            <TabsTrigger value="messages">Messages</TabsTrigger>
            <TabsTrigger value="schedule">Schedule</TabsTrigger>
            <TabsTrigger value="merch">Merch</TabsTrigger>
            <TabsTrigger value="team">Team</TabsTrigger>
            <TabsTrigger value="sponsors">Sponsors</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>
          <TabsContent value="bookings"><BookingsManager /></TabsContent>
          <TabsContent value="vendors"><AppList table="vendor_applications" titleField="business_name" /></TabsContent>
          <TabsContent value="artists"><AppList table="artist_applications" titleField="stage_name" /></TabsContent>
          <TabsContent value="volunteers"><AppList table="volunteer_applications" titleField="full_name" /></TabsContent>
          <TabsContent value="sponsorships"><SponsorshipList /></TabsContent>
          <TabsContent value="messages"><MessagesManager /></TabsContent>
          <TabsContent value="schedule"><ScheduleManager /></TabsContent>
          <TabsContent value="merch"><MerchManager /></TabsContent>
          <TabsContent value="team"><TeamManager /></TabsContent>
          <TabsContent value="sponsors"><SponsorsManager /></TabsContent>
          <TabsContent value="settings"><SettingsManager /></TabsContent>
        </Tabs>
      </section>
    </>
  );
}

function AppList({ table, titleField }: { table: "vendor_applications" | "artist_applications" | "volunteer_applications"; titleField: string }) {
  const [rows, setRows] = useState<any[]>([]);
  const load = () => supabase.from(table).select("*").order("created_at", { ascending: false }).then(({ data }) => setRows(data ?? []));
  useEffect(() => { load(); }, [table]);
  const setStatus = async (id: string, status: "approved" | "rejected") => {
    const { error } = await supabase.from(table).update({ status }).eq("id", id);
    if (error) return toast.error(error.message);
    toast.success(`Marked ${status}`);
    load();
  };
  return (
    <div className="mt-6 space-y-3">
      {rows.length === 0 && <p className="text-sm text-[color:var(--muted-foreground)]">No applications yet.</p>}
      {rows.map((r) => (
        <div key={r.id} className="rounded-lg border border-[color:var(--border)] p-4 flex items-center gap-4">
          <div className="flex-1">
            <div className="font-semibold">{r[titleField]}</div>
            <div className="text-xs text-[color:var(--muted-foreground)]">{r.contact_email} · {new Date(r.created_at).toLocaleDateString()}</div>
          </div>
          <Badge variant={r.status === "approved" ? "default" : r.status === "rejected" ? "destructive" : "secondary"}>{r.status}</Badge>
          {r.status === "pending" && (
            <div className="flex gap-2">
              <Button size="sm" onClick={() => setStatus(r.id, "approved")}>Approve</Button>
              <Button size="sm" variant="outline" onClick={() => setStatus(r.id, "rejected")}>Reject</Button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function SponsorshipList() {
  const [rows, setRows] = useState<any[]>([]);
  useEffect(() => { supabase.from("sponsorships").select("*").order("created_at", { ascending: false }).then(({ data }) => setRows(data ?? [])); }, []);
  return (
    <div className="mt-6 space-y-3">
      {rows.length === 0 && <p className="text-sm text-[color:var(--muted-foreground)]">No sponsorship inquiries yet.</p>}
      {rows.map((r) => (
        <div key={r.id} className="rounded-lg border border-[color:var(--border)] p-4 flex items-center gap-4">
          <div className="flex-1">
            <div className="font-semibold">{r.company_name} <span className="text-xs uppercase ml-2 text-[color:var(--secondary)]">{r.tier}</span></div>
            <div className="text-xs text-[color:var(--muted-foreground)]">{r.contact_email} · ${(r.amount_cents/100).toLocaleString()} CAD</div>
          </div>
          <Badge variant={r.payment_status === "paid" ? "default" : "secondary"}>{r.payment_status}</Badge>
        </div>
      ))}
    </div>
  );
}

/* ---------------- Merch ---------------- */
function MerchManager() {
  const [rows, setRows] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<any | null>(null);
  const load = () => supabase.from("merch_products").select("*").order("created_at", { ascending: false }).then(({ data }) => setRows(data ?? []));
  useEffect(() => { load(); }, []);

  const remove = async (id: string) => {
    if (!confirm("Delete this product?")) return;
    const { error } = await supabase.from("merch_products").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Deleted"); load();
  };

  return (
    <div className="mt-6 space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="font-display text-xl">Merchandise</h2>
        <Button onClick={() => { setEditing(null); setOpen(true); }}><Plus className="h-4 w-4 mr-1" /> Add product</Button>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {rows.map((r) => (
          <div key={r.id} className="rounded-lg border border-[color:var(--border)] p-4">
            {r.image_url && <img src={r.image_url} alt={r.name} className="aspect-square object-cover rounded mb-3" />}
            <div className="font-semibold">{r.name}</div>
            <div className="text-sm text-[color:var(--muted-foreground)]">${(r.price_cents/100).toFixed(2)} · stock {r.stock} {!r.active && <Badge variant="secondary" className="ml-1">inactive</Badge>}</div>
            <div className="flex gap-2 mt-3">
              <Button size="sm" variant="outline" onClick={() => { setEditing(r); setOpen(true); }}><Pencil className="h-3 w-3" /></Button>
              <Button size="sm" variant="destructive" onClick={() => remove(r.id)}><Trash2 className="h-3 w-3" /></Button>
            </div>
          </div>
        ))}
      </div>
      <MerchDialog open={open} onOpenChange={setOpen} editing={editing} onSaved={() => { setOpen(false); load(); }} />
    </div>
  );
}

function MerchDialog({ open, onOpenChange, editing, onSaved }: any) {
  const [form, setForm] = useState<any>({ name: "", description: "", price_cents: 0, stock: 0, image_url: "", active: true });
  useEffect(() => { setForm(editing ?? { name: "", description: "", price_cents: 0, stock: 0, image_url: "", active: true }); }, [editing, open]);

  const upload = async (file: File) => {
    const path = `${Date.now()}-${file.name}`;
    const { error } = await supabase.storage.from("merch-images").upload(path, file, { upsert: true });
    if (error) return toast.error(error.message);
    const { data } = supabase.storage.from("merch-images").getPublicUrl(path);
    setForm((f: any) => ({ ...f, image_url: data.publicUrl }));
    toast.success("Image uploaded");
  };

  const save = async () => {
    const payload = { name: form.name, description: form.description, price_cents: Number(form.price_cents), stock: Number(form.stock), image_url: form.image_url || null, active: form.active };
    const { error } = editing
      ? await supabase.from("merch_products").update(payload).eq("id", editing.id)
      : await supabase.from("merch_products").insert(payload);
    if (error) return toast.error(error.message);
    toast.success("Saved"); onSaved();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader><DialogTitle>{editing ? "Edit product" : "New product"}</DialogTitle></DialogHeader>
        <div className="space-y-3">
          <div><Label>Name</Label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
          <div><Label>Description</Label><Textarea value={form.description ?? ""} onChange={(e) => setForm({ ...form, description: e.target.value })} /></div>
          <div className="grid grid-cols-2 gap-3">
            <div><Label>Price (cents)</Label><Input type="number" value={form.price_cents} onChange={(e) => setForm({ ...form, price_cents: e.target.value })} /></div>
            <div><Label>Stock</Label><Input type="number" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} /></div>
          </div>
          <div>
            <Label>Image</Label>
            <Input type="file" accept="image/*" onChange={(e) => e.target.files?.[0] && upload(e.target.files[0])} />
            {form.image_url && <img src={form.image_url} alt="" className="mt-2 h-24 rounded" />}
          </div>
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.active} onChange={(e) => setForm({ ...form, active: e.target.checked })} /> Active</label>
        </div>
        <DialogFooter><Button onClick={save}>Save</Button></DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

/* ---------------- Team ---------------- */
function TeamManager() {
  const [rows, setRows] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<any | null>(null);
  const load = () => supabase.from("team_members").select("*").order("sort_order").then(({ data }) => setRows(data ?? []));
  useEffect(() => { load(); }, []);

  const remove = async (id: string) => {
    if (!confirm("Delete this member?")) return;
    const { error } = await supabase.from("team_members").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Deleted"); load();
  };

  return (
    <div className="mt-6 space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="font-display text-xl">Board of Directors</h2>
        <Button onClick={() => { setEditing(null); setOpen(true); }}><Plus className="h-4 w-4 mr-1" /> Add member</Button>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {rows.map((r) => (
          <div key={r.id} className="rounded-lg border border-[color:var(--border)] p-4 flex gap-3">
            {r.image_url ? <img src={r.image_url} alt={r.name} className="h-16 w-16 rounded-full object-cover" /> : <div className="h-16 w-16 rounded-full bg-[color:var(--primary)] text-white flex items-center justify-center font-semibold">{r.name.split(" ").map((n: string) => n[0]).join("")}</div>}
            <div className="flex-1">
              <div className="font-semibold">{r.name}</div>
              <div className="text-xs text-[color:var(--muted-foreground)]">{r.role}</div>
              <div className="flex gap-2 mt-2">
                <Button size="sm" variant="outline" onClick={() => { setEditing(r); setOpen(true); }}><Pencil className="h-3 w-3" /></Button>
                <Button size="sm" variant="destructive" onClick={() => remove(r.id)}><Trash2 className="h-3 w-3" /></Button>
              </div>
            </div>
          </div>
        ))}
      </div>
      <TeamDialog open={open} onOpenChange={setOpen} editing={editing} onSaved={() => { setOpen(false); load(); }} />
    </div>
  );
}

function TeamDialog({ open, onOpenChange, editing, onSaved }: any) {
  const [form, setForm] = useState<any>({ name: "", role: "", bio: "", image_url: "", sort_order: 0, active: true });
  useEffect(() => { setForm(editing ?? { name: "", role: "", bio: "", image_url: "", sort_order: 0, active: true }); }, [editing, open]);

  const upload = async (file: File) => {
    const path = `${Date.now()}-${file.name}`;
    const { error } = await supabase.storage.from("team-photos").upload(path, file, { upsert: true });
    if (error) return toast.error(error.message);
    const { data } = supabase.storage.from("team-photos").getPublicUrl(path);
    setForm((f: any) => ({ ...f, image_url: data.publicUrl }));
    toast.success("Photo uploaded");
  };

  const save = async () => {
    const payload = { name: form.name, role: form.role, bio: form.bio || null, image_url: form.image_url || null, sort_order: Number(form.sort_order), active: form.active };
    const { error } = editing
      ? await supabase.from("team_members").update(payload).eq("id", editing.id)
      : await supabase.from("team_members").insert(payload);
    if (error) return toast.error(error.message);
    toast.success("Saved"); onSaved();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader><DialogTitle>{editing ? "Edit member" : "New member"}</DialogTitle></DialogHeader>
        <div className="space-y-3">
          <div><Label>Name</Label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
          <div><Label>Role</Label><Input value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} /></div>
          <div><Label>Bio</Label><Textarea value={form.bio ?? ""} onChange={(e) => setForm({ ...form, bio: e.target.value })} /></div>
          <div><Label>Sort order</Label><Input type="number" value={form.sort_order} onChange={(e) => setForm({ ...form, sort_order: e.target.value })} /></div>
          <div>
            <Label>Photo</Label>
            <Input type="file" accept="image/*" onChange={(e) => e.target.files?.[0] && upload(e.target.files[0])} />
            {form.image_url && <img src={form.image_url} alt="" className="mt-2 h-20 w-20 rounded-full object-cover" />}
          </div>
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.active} onChange={(e) => setForm({ ...form, active: e.target.checked })} /> Active</label>
        </div>
        <DialogFooter><Button onClick={save}>Save</Button></DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

/* ---------------- Sponsors ---------------- */
function SponsorsManager() {
  const [rows, setRows] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<any | null>(null);
  const load = () => supabase.from("sponsors").select("*").order("sort_order").then(({ data }) => setRows(data ?? []));
  useEffect(() => { load(); }, []);

  const remove = async (id: string) => {
    if (!confirm("Delete this sponsor?")) return;
    const { error } = await supabase.from("sponsors").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Deleted"); load();
  };

  return (
    <div className="mt-6 space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="font-display text-xl">Sponsors / Partners</h2>
        <Button onClick={() => { setEditing(null); setOpen(true); }}><Plus className="h-4 w-4 mr-1" /> Add sponsor</Button>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {rows.map((r) => (
          <div key={r.id} className="rounded-lg border border-[color:var(--border)] p-4">
            {r.logo_url && <img src={r.logo_url} alt={r.name} className="h-16 object-contain mb-3" />}
            <div className="font-semibold">{r.name}</div>
            <div className="text-xs uppercase text-[color:var(--secondary)]">{r.level}</div>
            {r.website_url && <a href={r.website_url} target="_blank" rel="noreferrer" className="text-xs text-[color:var(--primary)] underline">{r.website_url}</a>}
            <div className="flex gap-2 mt-3">
              <Button size="sm" variant="outline" onClick={() => { setEditing(r); setOpen(true); }}><Pencil className="h-3 w-3" /></Button>
              <Button size="sm" variant="destructive" onClick={() => remove(r.id)}><Trash2 className="h-3 w-3" /></Button>
            </div>
          </div>
        ))}
      </div>
      <SponsorDialog open={open} onOpenChange={setOpen} editing={editing} onSaved={() => { setOpen(false); load(); }} />
    </div>
  );
}

function SponsorDialog({ open, onOpenChange, editing, onSaved }: any) {
  const [form, setForm] = useState<any>({ name: "", level: "silver", logo_url: "", website_url: "", sort_order: 0, active: true });
  useEffect(() => { setForm(editing ?? { name: "", level: "silver", logo_url: "", website_url: "", sort_order: 0, active: true }); }, [editing, open]);

  const upload = async (file: File) => {
    const path = `${Date.now()}-${file.name}`;
    const { error } = await supabase.storage.from("sponsor-logos").upload(path, file, { upsert: true });
    if (error) return toast.error(error.message);
    const { data } = supabase.storage.from("sponsor-logos").getPublicUrl(path);
    setForm((f: any) => ({ ...f, logo_url: data.publicUrl }));
    toast.success("Logo uploaded");
  };

  const save = async () => {
    const payload = { name: form.name, level: form.level, logo_url: form.logo_url || null, website_url: form.website_url || null, sort_order: Number(form.sort_order), active: form.active };
    const { error } = editing
      ? await supabase.from("sponsors").update(payload).eq("id", editing.id)
      : await supabase.from("sponsors").insert(payload);
    if (error) return toast.error(error.message);
    toast.success("Saved"); onSaved();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader><DialogTitle>{editing ? "Edit sponsor" : "New sponsor"}</DialogTitle></DialogHeader>
        <div className="space-y-3">
          <div><Label>Name</Label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
          <div>
            <Label>Level</Label>
            <Select value={form.level} onValueChange={(v) => setForm({ ...form, level: v })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="platinum">Platinum</SelectItem>
                <SelectItem value="gold">Gold</SelectItem>
                <SelectItem value="silver">Silver</SelectItem>
                <SelectItem value="bronze">Bronze</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div><Label>Website URL</Label><Input value={form.website_url ?? ""} onChange={(e) => setForm({ ...form, website_url: e.target.value })} /></div>
          <div><Label>Sort order</Label><Input type="number" value={form.sort_order} onChange={(e) => setForm({ ...form, sort_order: e.target.value })} /></div>
          <div>
            <Label>Logo</Label>
            <Input type="file" accept="image/*" onChange={(e) => e.target.files?.[0] && upload(e.target.files[0])} />
            {form.logo_url && <img src={form.logo_url} alt="" className="mt-2 h-16 object-contain" />}
          </div>
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.active} onChange={(e) => setForm({ ...form, active: e.target.checked })} /> Active</label>
        </div>
        <DialogFooter><Button onClick={save}>Save</Button></DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

/* ---------------- Site Settings ---------------- */
const SETTINGS_FIELDS: { key: string; label: string; multiline?: boolean }[] = [
  { key: "festival_name", label: "Festival name" },
  { key: "festival_short_name", label: "Short name" },
  { key: "festival_dates", label: "Festival dates" },
  { key: "festival_year", label: "Festival year" },
  { key: "location_name", label: "Location name" },
  { key: "location_address", label: "Location address" },
  { key: "hero_tagline", label: "Hero tagline" },
  { key: "hero_subtitle", label: "Hero subtitle", multiline: true },
  { key: "about_mission", label: "About — mission", multiline: true },
  { key: "about_history", label: "About — history", multiline: true },
  { key: "contact_email", label: "Contact email" },
  { key: "contact_phone", label: "Contact phone" },
  { key: "google_maps_embed", label: "Google Maps embed URL", multiline: true },
];

function SettingsManager() {
  const [values, setValues] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    supabase.from("site_settings").select("key,value").then(({ data }) => {
      const map: Record<string, string> = {};
      (data ?? []).forEach((r: any) => { map[r.key] = r.value; });
      setValues(map);
    });
  }, []);

  const save = async () => {
    setSaving(true);
    const rows = SETTINGS_FIELDS.map((f) => ({ key: f.key, value: values[f.key] ?? "" }));
    const { error } = await supabase.from("site_settings").upsert(rows, { onConflict: "key" });
    setSaving(false);
    if (error) return toast.error(error.message);
    await refreshSiteSettings();
    toast.success("Settings saved");
  };

  return (
    <div className="mt-6 space-y-4 max-w-2xl">
      <h2 className="font-display text-xl">Site settings</h2>
      {SETTINGS_FIELDS.map((f) => (
        <div key={f.key}>
          <Label>{f.label}</Label>
          {f.multiline ? (
            <Textarea value={values[f.key] ?? ""} onChange={(e) => setValues({ ...values, [f.key]: e.target.value })} rows={3} />
          ) : (
            <Input value={values[f.key] ?? ""} onChange={(e) => setValues({ ...values, [f.key]: e.target.value })} />
          )}
        </div>
      ))}
      <Button onClick={save} disabled={saving}>{saving ? "Saving…" : "Save settings"}</Button>
    </div>
  );
}

/* ---------------- Vendor Bookings ---------------- */
function BookingsManager() {
  const [rows, setRows] = useState<any[]>([]);
  const [spots, setSpots] = useState<Record<string, any>>({});
  const confirmFn = useServerFn(adminConfirmBookingAdmin);
  const cancelFn = useServerFn(adminCancelBookingAdmin);

  const load = async () => {
    const [{ data: b }, { data: s }] = await Promise.all([
      supabase.from("vendor_bookings").select("*").order("created_at", { ascending: false }),
      supabase.from("vendor_spots").select("id,code,label"),
    ]);
    setRows(b ?? []);
    const map: Record<string, any> = {};
    (s ?? []).forEach((x: any) => { map[x.id] = x; });
    setSpots(map);
  };
  useEffect(() => { load(); }, []);

  const confirm = async (id: string) => {
    try { await confirmFn({ data: { booking_id: id } }); toast.success("Payment confirmed"); load(); }
    catch (e: any) { toast.error(e?.message ?? "Failed"); }
  };
  const cancel = async (id: string) => {
    if (!window.confirm("Cancel this booking and release the spot?")) return;
    try { await cancelFn({ data: { booking_id: id } }); toast.success("Cancelled"); load(); }
    catch (e: any) { toast.error(e?.message ?? "Failed"); }
  };

  return (
    <div className="mt-6 space-y-3">
      {rows.length === 0 && <p className="text-sm text-[color:var(--muted-foreground)]">No bookings yet.</p>}
      {rows.map((r) => {
        const spot = spots[r.spot_id];
        const overdue = r.pending_until && new Date(r.pending_until) < new Date();
        return (
          <div key={r.id} className="rounded-lg border border-[color:var(--border)] p-4 flex flex-wrap items-center gap-4">
            <div className="flex-1 min-w-[200px]">
              <div className="font-semibold">{r.order_number} <span className="text-xs uppercase ml-2 text-[color:var(--secondary)]">{r.payment_method}</span></div>
              <div className="text-xs text-[color:var(--muted-foreground)]">Spot {spot?.code ?? "?"} — {r.business_name} · ${(r.amount_cents/100).toFixed(0)} · {r.contact_email}</div>
              {r.pending_until && r.status === "pending" && (
                <div className={`text-xs mt-1 ${overdue ? "text-rose-600" : "text-amber-600"}`}>
                  {overdue ? "Expired — awaiting auto-release" : `Holds until ${new Date(r.pending_until).toLocaleString()}`}
                </div>
              )}
            </div>
            <Badge variant={r.status === "paid" ? "default" : r.status === "pending" ? "secondary" : "outline"}>{r.status}</Badge>
            {r.status === "pending" && (
              <div className="flex gap-2">
                <Button size="sm" onClick={() => confirm(r.id)}>Confirm payment</Button>
                <Button size="sm" variant="outline" onClick={() => cancel(r.id)}>Cancel</Button>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

/* ---------------- Contact Messages ---------------- */
function MessagesManager() {
  const [rows, setRows] = useState<any[]>([]);
  const load = () => supabase.from("contact_messages").select("*").order("created_at", { ascending: false }).then(({ data }) => setRows(data ?? []));
  useEffect(() => { load(); }, []);
  const mark = async (id: string, handled: boolean) => {
    const { error } = await supabase.from("contact_messages").update({ handled }).eq("id", id);
    if (error) return toast.error(error.message);
    load();
  };
  return (
    <div className="mt-6 space-y-3">
      {rows.length === 0 && <p className="text-sm text-[color:var(--muted-foreground)]">No messages yet.</p>}
      {rows.map((r) => (
        <div key={r.id} className="rounded-lg border border-[color:var(--border)] p-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="font-semibold flex-1">{r.name} <span className="font-normal text-xs text-[color:var(--muted-foreground)]">· {r.email}</span></div>
            <Badge variant={r.handled ? "default" : "secondary"}>{r.handled ? "handled" : "new"}</Badge>
            <Button size="sm" variant="outline" onClick={() => mark(r.id, !r.handled)}>{r.handled ? "Reopen" : "Mark handled"}</Button>
          </div>
          {r.subject && <div className="text-sm font-medium mb-1">{r.subject}</div>}
          <div className="text-sm text-[color:var(--muted-foreground)] whitespace-pre-wrap">{r.message}</div>
          <div className="text-xs text-[color:var(--muted-foreground)] mt-2">{new Date(r.created_at).toLocaleString()}</div>
        </div>
      ))}
    </div>
  );
}

/* ---------------- Schedule ---------------- */
function ScheduleManager() {
  const [rows, setRows] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<any | null>(null);
  const load = () => supabase.from("festival_schedule").select("*").order("day").order("sort_order").then(({ data }) => setRows(data ?? []));
  useEffect(() => { load(); }, []);
  const remove = async (id: string) => {
    if (!window.confirm("Delete this entry?")) return;
    const { error } = await supabase.from("festival_schedule").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Deleted"); load();
  };
  const days = ["saturday", "sunday"] as const;
  return (
    <div className="mt-6 space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="font-display text-xl">Festival schedule</h2>
        <Button onClick={() => { setEditing(null); setOpen(true); }}><Plus className="h-4 w-4 mr-1" /> Add entry</Button>
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        {days.map((d) => (
          <div key={d} className="rounded-lg border border-[color:var(--border)] p-4">
            <div className="font-display text-lg capitalize mb-3">{d === "saturday" ? "Saturday — July 11" : "Sunday — July 12"}</div>
            <div className="space-y-2">
              {rows.filter((r) => r.day === d).map((r) => (
                <div key={r.id} className="flex items-center gap-2 text-sm border-b border-[color:var(--border)] py-2">
                  <span className="font-mono text-xs w-24 text-[color:var(--muted-foreground)]">{r.start_time}{r.end_time ? `–${r.end_time}` : ""}</span>
                  <div className="flex-1">
                    <div className="font-medium">{r.title}</div>
                    {r.area && <div className="text-xs text-[color:var(--muted-foreground)]">{r.area}</div>}
                  </div>
                  <Button size="sm" variant="ghost" onClick={() => { setEditing(r); setOpen(true); }}><Pencil className="h-3 w-3" /></Button>
                  <Button size="sm" variant="ghost" onClick={() => remove(r.id)}><Trash2 className="h-3 w-3" /></Button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      <ScheduleDialog open={open} onOpenChange={setOpen} editing={editing} onSaved={() => { setOpen(false); load(); }} />
    </div>
  );
}

function ScheduleDialog({ open, onOpenChange, editing, onSaved }: any) {
  const [form, setForm] = useState<any>({ day: "saturday", start_time: "12:00", end_time: "", title: "", description: "", area: "Main Stage", sort_order: 0, active: true });
  useEffect(() => { setForm(editing ?? { day: "saturday", start_time: "12:00", end_time: "", title: "", description: "", area: "Main Stage", sort_order: 0, active: true }); }, [editing, open]);
  const save = async () => {
    const payload = { day: form.day, start_time: form.start_time, end_time: form.end_time || null, title: form.title, description: form.description || null, area: form.area || null, sort_order: Number(form.sort_order), active: form.active };
    const { error } = editing
      ? await supabase.from("festival_schedule").update(payload).eq("id", editing.id)
      : await supabase.from("festival_schedule").insert(payload);
    if (error) return toast.error(error.message);
    toast.success("Saved"); onSaved();
  };
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader><DialogTitle>{editing ? "Edit entry" : "New entry"}</DialogTitle></DialogHeader>
        <div className="space-y-3">
          <div>
            <Label>Day</Label>
            <Select value={form.day} onValueChange={(v) => setForm({ ...form, day: v })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="saturday">Saturday — July 11</SelectItem>
                <SelectItem value="sunday">Sunday — July 12</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div><Label>Start time</Label><Input type="time" value={form.start_time} onChange={(e) => setForm({ ...form, start_time: e.target.value })} /></div>
            <div><Label>End time</Label><Input type="time" value={form.end_time ?? ""} onChange={(e) => setForm({ ...form, end_time: e.target.value })} /></div>
          </div>
          <div><Label>Title</Label><Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></div>
          <div><Label>Description</Label><Textarea value={form.description ?? ""} onChange={(e) => setForm({ ...form, description: e.target.value })} /></div>
          <div className="grid grid-cols-2 gap-3">
            <div><Label>Area</Label><Input value={form.area ?? ""} onChange={(e) => setForm({ ...form, area: e.target.value })} /></div>
            <div><Label>Sort order</Label><Input type="number" value={form.sort_order} onChange={(e) => setForm({ ...form, sort_order: e.target.value })} /></div>
          </div>
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.active} onChange={(e) => setForm({ ...form, active: e.target.checked })} /> Active</label>
        </div>
        <DialogFooter><Button onClick={save}>Save</Button></DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
