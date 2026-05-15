import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth-context";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/admin")({
  component: Admin,
  head: () => ({ meta: [{ title: "Admin — Festua" }] }),
});

function Admin() {
  const { isAdmin, loading } = useAuth();
  if (loading) return <div className="container-page py-12">Loading…</div>;
  if (!isAdmin) return <div className="container-page py-12"><h1 className="font-display text-2xl">Admin access required</h1><p className="text-[color:var(--muted-foreground)] mt-2">Contact a Festua organizer to grant you admin role.</p></div>;
  return (
    <>
      <PageHeader eyebrow="Internal" title="Admin dashboard" />
      <section className="container-page py-8">
        <Tabs defaultValue="vendors">
          <TabsList>
            <TabsTrigger value="vendors">Vendors</TabsTrigger>
            <TabsTrigger value="artists">Artists</TabsTrigger>
            <TabsTrigger value="volunteers">Volunteers</TabsTrigger>
            <TabsTrigger value="sponsors">Sponsors</TabsTrigger>
          </TabsList>
          <TabsContent value="vendors"><AppList table="vendor_applications" titleField="business_name" /></TabsContent>
          <TabsContent value="artists"><AppList table="artist_applications" titleField="stage_name" /></TabsContent>
          <TabsContent value="volunteers"><AppList table="volunteer_applications" titleField="full_name" /></TabsContent>
          <TabsContent value="sponsors"><SponsorList /></TabsContent>
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

function SponsorList() {
  const [rows, setRows] = useState<any[]>([]);
  useEffect(() => { supabase.from("sponsorships").select("*").order("created_at", { ascending: false }).then(({ data }) => setRows(data ?? [])); }, []);
  return (
    <div className="mt-6 space-y-3">
      {rows.length === 0 && <p className="text-sm text-[color:var(--muted-foreground)]">No sponsorships yet.</p>}
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
