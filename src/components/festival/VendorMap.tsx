import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import festivalMap from "@/assets/festival-map.jpg";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

type Spot = {
  id: string;
  code: string;
  label: string | null;
  status: "available" | "pending" | "occupied";
  x: number; y: number; w: number; h: number;
  price_cents: number;
};

const VIEW_W = 1200;
const VIEW_H = 1500;

const fillFor = (s: Spot["status"]) =>
  s === "available" ? "fill-emerald-500/70 stroke-emerald-700" :
  s === "pending"   ? "fill-amber-400/70 stroke-amber-700" :
                      "fill-rose-500/70 stroke-rose-700";

export function VendorMap() {
  const [spots, setSpots] = useState<Spot[]>([]);
  const [selected, setSelected] = useState<Spot | null>(null);

  useEffect(() => {
    supabase.from("vendor_spots").select("*").order("code").then(({ data }) => setSpots((data as any) ?? []));
    const ch = supabase
      .channel("vendor_spots_rt")
      .on("postgres_changes", { event: "*", schema: "public", table: "vendor_spots" }, (payload: any) => {
        setSpots((prev) => prev.map((s) => (s.id === payload.new?.id ? { ...s, ...payload.new } : s)));
      })
      .subscribe();
    return () => { supabase.removeChannel(ch); };
  }, []);

  return (
    <>
      <div className="relative w-full overflow-hidden rounded-2xl border border-[color:var(--border)] bg-black/5">
        <svg viewBox={`0 0 ${VIEW_W} ${VIEW_H}`} className="block w-full h-auto">
          <image href={festivalMap} x={0} y={0} width={VIEW_W} height={VIEW_H} preserveAspectRatio="xMidYMid slice" />
          {spots.map((s) => (
            <g key={s.id} onClick={() => setSelected(s)} className="cursor-pointer">
              <rect
                x={s.x} y={s.y} width={s.w} height={s.h} rx={4}
                className={`${fillFor(s.status)} stroke-2 hover:stroke-[3px] transition-all`}
              />
              <text x={s.x + s.w / 2} y={s.y + s.h / 2 + 5} textAnchor="middle" className="fill-white font-bold pointer-events-none" style={{ fontSize: 14 }}>
                {s.code}
              </text>
            </g>
          ))}
        </svg>
      </div>

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
                  <Button className="w-full" size="lg" onClick={() => toast.info("Booking checkout activates once Payments is enabled in Connectors.")}>Book this spot</Button>
                )}
                {selected.status === "pending" && <p className="text-sm text-amber-700">Currently in another vendor's checkout. Try again in 15 minutes.</p>}
                {selected.status === "occupied" && <p className="text-sm text-rose-700 font-medium">Sold out</p>}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
