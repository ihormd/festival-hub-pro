import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import festivalMap from "@/assets/festival-map.jpg";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { toast } from "sonner";

type Spot = {
  id: string;
  code: string;
  label: string | null;
  status: "available" | "pending" | "occupied";
  x: number; y: number; w: number; h: number;
  price_cents: number;
};

const VIEW_W = 1181;
const VIEW_H = 1440;

const dotFill = (s: Spot["status"]) =>
  s === "available" ? "#10b981" : s === "pending" ? "#f59e0b" : "#ef4444";

export function VendorMap() {
  const [spots, setSpots] = useState<Spot[]>([]);
  const [selected, setSelected] = useState<Spot | null>(null);
  const [highlight, setHighlight] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | Spot["status"]>("all");

  useEffect(() => {
    supabase.from("vendor_spots").select("*").order("code").then(({ data }) => setSpots((data as Spot[]) ?? []));
    const ch = supabase
      .channel("vendor_spots_rt")
      .on("postgres_changes", { event: "*", schema: "public", table: "vendor_spots" }, (payload: any) => {
        setSpots((prev) => prev.map((s) => (s.id === payload.new?.id ? { ...s, ...payload.new } : s)));
      })
      .subscribe();
    return () => { supabase.removeChannel(ch); };
  }, []);

  const filtered = useMemo(() => filter === "all" ? spots : spots.filter((s) => s.status === filter), [spots, filter]);

  return (
    <div className="grid lg:grid-cols-[1fr_320px] gap-6">
      {/* Map */}
      <div className="relative w-full overflow-hidden rounded-2xl border border-[color:var(--border)] bg-black/5">
        <svg viewBox={`0 0 ${VIEW_W} ${VIEW_H}`} className="block w-full h-auto">
          <image href={festivalMap} x={0} y={0} width={VIEW_W} height={VIEW_H} preserveAspectRatio="xMidYMid slice" />
          {spots.map((s) => {
            const isHighlight = highlight === s.id;
            const cx = s.x + s.w / 2;
            const cy = s.y + s.h / 2;
            const r = 18;
            const fill = dotFill(s.status);
            return (
              <g key={s.id} onClick={() => setSelected(s)} className="cursor-pointer">
                {/* Soft halo on highlight */}
                {isHighlight && (
                  <circle cx={cx} cy={cy} r={r + 10} fill={fill} opacity={0.25} />
                )}
                {/* Pulse ring on available spots */}
                {s.status === "available" && (
                  <circle cx={cx} cy={cy} r={r + 4} fill="none" stroke={fill} strokeWidth={2} opacity={0.55} className="spot-pulse" />
                )}
                {/* Semi-transparent badge dot */}
                <circle
                  cx={cx}
                  cy={cy}
                  r={r}
                  fill={fill}
                  fillOpacity={0.78}
                  stroke="white"
                  strokeWidth={isHighlight ? 3 : 2}
                />
                <text x={cx} y={cy + 4} textAnchor="middle" className="fill-white font-bold pointer-events-none" style={{ fontSize: 13 }}>
                  {s.code}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Sidebar list */}
      <aside className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--card)] flex flex-col max-h-[80vh] lg:sticky lg:top-24">
        <div className="p-4 border-b border-[color:var(--border)]">
          <div className="font-display text-lg font-semibold mb-3">Spots ({filtered.length})</div>
          <div className="flex gap-1 text-xs">
            {(["all","available","pending","occupied"] as const).map((f) => (
              <button key={f} onClick={() => setFilter(f)} className={`px-2.5 py-1 rounded-full capitalize ${filter === f ? "bg-[color:var(--primary)] text-white" : "bg-[color:var(--muted)] hover:bg-[color:var(--accent)]/20"}`}>{f}</button>
            ))}
          </div>
        </div>
        <div className="overflow-y-auto flex-1">
          {filtered.map((s) => (
            <button
              key={s.id}
              onMouseEnter={() => setHighlight(s.id)}
              onMouseLeave={() => setHighlight(null)}
              onClick={() => { setHighlight(s.id); setSelected(s); }}
              className={`w-full text-left p-3 border-b border-[color:var(--border)] hover:bg-[color:var(--muted)] flex items-center gap-3 ${highlight === s.id ? "bg-[color:var(--secondary)]/15" : ""}`}
            >
              <span className={`inline-block h-2.5 w-2.5 rounded-full ${s.status === "available" ? "bg-emerald-500" : s.status === "pending" ? "bg-amber-400" : "bg-rose-500"}`} />
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-sm">{s.code} {s.label && <span className="text-[color:var(--muted-foreground)] font-normal">— {s.label}</span>}</div>
                <div className="text-xs text-[color:var(--muted-foreground)] capitalize">{s.status} · ${(s.price_cents / 100).toFixed(0)}</div>
              </div>
            </button>
          ))}
        </div>
      </aside>

      <Dialog open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <DialogContent>
          {selected && (
            <>
              <DialogHeader>
                <DialogTitle>Spot {selected.code} {selected.label ? `— ${selected.label}` : ""}</DialogTitle>
                <DialogDescription>
                  Status: <span className="font-semibold capitalize">{selected.status}</span>
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="text-2xl font-display font-semibold">${(selected.price_cents / 100).toFixed(0)} <span className="text-sm font-normal text-[color:var(--muted-foreground)]">CAD for the weekend</span></div>
                {selected.status === "available" && (
                  <motion.div whileTap={{ scale: 0.95 }}>
                    <Button className="w-full" size="lg" onClick={() => toast.info("Booking checkout activates once Payments are enabled.")}>Book this spot</Button>
                  </motion.div>
                )}
                {selected.status === "pending" && <p className="text-sm text-amber-700">Currently in another vendor's checkout. Try again in 15 minutes.</p>}
                {selected.status === "occupied" && <p className="text-sm text-rose-700 font-medium">Sold out</p>}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
