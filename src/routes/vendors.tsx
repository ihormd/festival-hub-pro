import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { VendorMap } from "@/components/festival/VendorMap";

export const Route = createFileRoute("/vendors")({
  component: VendorsPage,
  head: () => ({
    meta: [
      { title: "Vendors — Interactive Booth Map | Festua" },
      { name: "description", content: "Pick your booth on Festua's live festival map. Real-time availability for food, retail, and sponsor spots." },
      { property: "og:title", content: "Vendor Booth Map — Festua" },
    ],
  }),
});

function VendorsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Become a vendor"
        title="Reserve your booth in real time"
        subtitle="Click any green spot to book. Spots turn yellow when in checkout and red once paid — fully automated, no email tag."
      />
      <section className="container-page py-12">
        <div className="flex flex-wrap items-center gap-6 mb-6 text-sm">
          <Legend color="bg-emerald-500" label="Available" />
          <Legend color="bg-amber-400" label="Pending" />
          <Legend color="bg-rose-500" label="Sold out" />
          <div className="ml-auto">
            <Link to="/apply/vendor"><Button variant="outline">Vendor application</Button></Link>
          </div>
        </div>
        <VendorMap />
      </section>
    </>
  );
}

function Legend({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className={`inline-block h-3 w-3 rounded-sm ${color}`} />
      <span>{label}</span>
    </div>
  );
}
