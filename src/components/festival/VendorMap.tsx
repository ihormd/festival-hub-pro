import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import festivalMap from "@/assets/festival-map.jpg";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { useAuth } from "@/lib/auth-context";
import { Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { bookVendorSpot } from "@/lib/vendor-booking.functions";
import { sendFormNotification } from "@/lib/notify.functions";
import { CreditCard, Mail, Copy, Check } from "lucide-react";

type Spot = {
  id: string;
  code: string;
  label: string | null;
  status: "available" | "pending" | "occupied";
  x: number; y: number; w: number; h: number;
  price_cents: number;
};

type BookingResult = {
  id: string;
  order_number: string;
  amount_cents: number;
  payment_method: "stripe" | "etransfer";
  pending_until: string | null;
};

const VIEW_W = 1181;
const VIEW_H = 1440;
const ETRANSFER_RECIPIENT = "info@niagarka.ca";

const dotFill = (s: Spot["status"]) =>
  s === "available" ? "#10b981" : s === "pending" ? "#f59e0b" : "#ef4444";

export function VendorMap() {
  const { user } = useAuth();
  const [spots, setSpots] = useState<Spot[]>([]);
  const [selected, setSelected] = useState<Spot | null>(null);
  const [highlight, setHighlight] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | Spot["status"]>("all");
  const [step, setStep] = useState<"choose" | "form" | "etransfer-done">("choose");
  const [method, setMethod] = useState<"stripe" | "etransfer">("etransfer");
  const [form, setForm] = useState({ business_name: "", contact_name: "", contact_email: "", contact_phone: "" });
  const [busy, setBusy] = useState(false);
  const [booking, setBooking] = useState<BookingResult | null>(null);
  const [copied, setCopied] = useState(false);
  const bookFn = useServerFn(bookVendorSpot);
  const notifyFn = useServerFn(sendFormNotification);

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

  const openSpot = (s: Spot) => {
    setSelected(s);
    setBooking(null);
    setStep("choose");
    setForm({
      business_name: "",
      contact_name: user?.user_metadata?.full_name ?? "",
      contact_email: user?.email ?? "",
      contact_phone: "",
    });
  };

  const submit = async () => {
    if (!selected) return;
    if (!user) {
      toast.error("Please sign in first");
      return;
    }
    setBusy(true);
    try {
      const result = await bookFn({
        data: { spot_id: selected.id, method, ...form },
      });
      setBooking(result);
      // Send admin notification (fire-and-forget)
      notifyFn({
        data: {
          kind: "vendor_booking",
          subject: `New booking ${result.order_number} (${method})`,
          fields: {
            order_number: result.order_number,
            spot: `${selected.code} — ${selected.label ?? ""}`,
            payment_method: method,
            amount: `$${(result.amount_cents / 100).toFixed(0)} CAD`,
            business_name: form.business_name,
            contact_name: form.contact_name,
            contact_email: form.contact_email,
            contact_phone: form.contact_phone,
          },
        },
      }).catch(() => {});
      if (method === "etransfer") {
        setStep("etransfer-done");
      } else {
        toast.success("Booking created — Stripe checkout will open shortly (not yet enabled).");
        // Refresh spots
        const { data } = await supabase.from("vendor_spots").select("*").order("code");
        setSpots((data as Spot[]) ?? []);
        setSelected(null);
      }
    } catch (e: any) {
      toast.error(e?.message ?? "Booking failed");
    } finally {
      setBusy(false);
    }
  };

  const copyOrder = () => {
    if (!booking) return;
    navigator.clipboard.writeText(booking.order_number);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="grid lg:grid-cols-[1fr_320px] gap-6">
      <div className="relative w-full overflow-hidden rounded-2xl border border-[color:var(--border)] bg-black/5">
        <svg viewBox={`0 0 ${VIEW_W} ${VIEW_H}`} className="block w-full h-auto">
          <image href={festivalMap} x={0} y={0} width={VIEW_W} height={VIEW_H} preserveAspectRatio="xMidYMid slice" />
          {spots.map((s) => {
            const isHighlight = highlight === s.id;
            const cx = s.x + s.w / 2;
            const cy = s.y + s.h / 2;
            const r = 18;
            const fill = dotFill(s.status);
            const clickable = s.status === "available";
            return (
              <g key={s.id} onClick={() => clickable && openSpot(s)} className={clickable ? "cursor-pointer" : "cursor-not-allowed"}>
                {isHighlight && <circle cx={cx} cy={cy} r={r + 10} fill={fill} opacity={0.25} />}
                {clickable && (
                  <circle cx={cx} cy={cy} r={r + 4} fill="none" stroke={fill} strokeWidth={2} opacity={0.55} className="spot-pulse" />
                )}
                <circle cx={cx} cy={cy} r={r} fill={fill} fillOpacity={0.78} stroke="white" strokeWidth={isHighlight ? 3 : 2} />
                <text x={cx} y={cy + 4} textAnchor="middle" className="fill-white font-bold pointer-events-none" style={{ fontSize: 13 }}>
                  {s.code}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

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
              onClick={() => { setHighlight(s.id); if (s.status === "available") openSpot(s); }}
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
        <DialogContent className="max-w-lg">
          {selected && step === "choose" && (
            <>
              <DialogHeader>
                <DialogTitle>Spot {selected.code} {selected.label ? `— ${selected.label}` : ""}</DialogTitle>
                <DialogDescription>${(selected.price_cents / 100).toFixed(0)} CAD for the weekend</DialogDescription>
              </DialogHeader>
              {!user ? (
                <div className="space-y-3">
                  <p className="text-sm">Please sign in to book this spot.</p>
                  <Link to="/login"><Button className="w-full">Sign in</Button></Link>
                </div>
              ) : (
                <div className="space-y-3">
                  <p className="text-sm font-semibold">Choose how you'd like to pay:</p>
                  <button
                    onClick={() => { setMethod("stripe"); setStep("form"); }}
                    className="w-full flex items-center gap-3 p-4 rounded-lg border-2 border-[color:var(--border)] hover:border-[color:var(--primary)] text-left"
                  >
                    <CreditCard className="h-6 w-6 text-[color:var(--primary)] shrink-0" />
                    <div>
                      <div className="font-semibold">Credit card / Apple Pay / Google Pay</div>
                      <div className="text-xs text-[color:var(--muted-foreground)]">Instant confirmation via Stripe. (Activates once Stripe key is added.)</div>
                    </div>
                  </button>
                  <button
                    onClick={() => { setMethod("etransfer"); setStep("form"); }}
                    className="w-full flex items-center gap-3 p-4 rounded-lg border-2 border-[color:var(--border)] hover:border-[color:var(--primary)] text-left"
                  >
                    <Mail className="h-6 w-6 text-[color:var(--primary)] shrink-0" />
                    <div>
                      <div className="font-semibold">Interac e-Transfer</div>
                      <div className="text-xs text-[color:var(--muted-foreground)]">Spot held 24 hours. Send transfer to {ETRANSFER_RECIPIENT}.</div>
                    </div>
                  </button>
                </div>
              )}
            </>
          )}

          {selected && step === "form" && (
            <>
              <DialogHeader>
                <DialogTitle>Reserve spot {selected.code}</DialogTitle>
                <DialogDescription>{method === "etransfer" ? "We'll hold this spot for 24 hours after you submit." : "Card checkout opens after you confirm."}</DialogDescription>
              </DialogHeader>
              <div className="space-y-3">
                <div><Label>Business / Vendor name *</Label><Input required value={form.business_name} onChange={(e) => setForm({ ...form, business_name: e.target.value })} maxLength={200} /></div>
                <div><Label>Contact name *</Label><Input required value={form.contact_name} onChange={(e) => setForm({ ...form, contact_name: e.target.value })} maxLength={200} /></div>
                <div><Label>Email *</Label><Input type="email" required value={form.contact_email} onChange={(e) => setForm({ ...form, contact_email: e.target.value })} /></div>
                <div><Label>Phone</Label><Input value={form.contact_phone} onChange={(e) => setForm({ ...form, contact_phone: e.target.value })} maxLength={40} /></div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setStep("choose")}>Back</Button>
                <motion.div whileTap={{ scale: 0.97 }}><Button onClick={submit} disabled={busy || !form.business_name || !form.contact_name || !form.contact_email}>{busy ? "Reserving…" : method === "etransfer" ? "Hold spot for 24h" : "Continue to payment"}</Button></motion.div>
              </DialogFooter>
            </>
          )}

          {selected && step === "etransfer-done" && booking && (
            <>
              <DialogHeader>
                <DialogTitle>Spot {selected.code} is held for 24 hours</DialogTitle>
                <DialogDescription>Complete your Interac e-Transfer using the details below. Your spot is locked from other bookings until {booking.pending_until ? new Date(booking.pending_until).toLocaleString() : "the deadline"}.</DialogDescription>
              </DialogHeader>
              <div className="space-y-3 text-sm">
                <div className="rounded-lg bg-[color:var(--cream)] p-4 space-y-2 border border-[color:var(--border)]">
                  <Row label="Send to" value={ETRANSFER_RECIPIENT} />
                  <Row label="Amount" value={`$${(booking.amount_cents / 100).toFixed(2)} CAD`} />
                  <div className="flex justify-between items-center">
                    <span className="text-[color:var(--muted-foreground)]">Memo (Order #)</span>
                    <button onClick={copyOrder} className="font-mono font-semibold flex items-center gap-1.5 hover:text-[color:var(--primary)]">
                      {booking.order_number} {copied ? <Check className="h-4 w-4 text-emerald-600" /> : <Copy className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
                <p className="text-xs text-[color:var(--muted-foreground)] leading-relaxed">
                  <strong>Important:</strong> include the Order # in the e-Transfer memo so we can match your payment to this booking. Once we confirm receipt, your spot is permanently reserved. If we don't receive payment within 24 hours, the spot is automatically released.
                </p>
                <p className="text-xs text-[color:var(--muted-foreground)]">A copy of these instructions has been emailed to our team. Questions? <a href="mailto:info@niagarka.ca" className="text-[color:var(--primary)] underline">info@niagarka.ca</a></p>
              </div>
              <DialogFooter>
                <Button onClick={() => setSelected(null)} className="w-full">Done</Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-center">
      <span className="text-[color:var(--muted-foreground)]">{label}</span>
      <span className="font-semibold">{value}</span>
    </div>
  );
}
