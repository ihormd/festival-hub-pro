import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { cart, useCart } from "@/lib/cart-store";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { ShoppingBag, Plus, Minus, Trash2 } from "lucide-react";
import { toast } from "sonner";

type Product = { id: string; name: string; description: string | null; price_cents: number; image_url: string | null; stock: number };

export const Route = createFileRoute("/merch")({
  component: MerchPage,
  head: () => ({
    meta: [
      { title: "Merch Store — NUFF" },
      { name: "description", content: "Festival apparel, vyshyvanka-inspired prints, mugs, and gifts. Free shipping in Canada over $75." },
    ],
  }),
});

function MerchPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const items = useCart();
  const cartCount = items.reduce((s, i) => s + i.qty, 0);
  const cartTotal = items.reduce((s, i) => s + i.qty * i.price_cents, 0);

  useEffect(() => {
    supabase.from("merch_products").select("*").eq("active", true).order("created_at").then(({ data }) => setProducts(data ?? []));
  }, []);

  return (
    <>
      <PageHeader eyebrow="Festival Store" title="Wear the festival home" subtitle="Limited-run apparel and gifts inspired by Ukrainian craft." />
      <section className="container-page py-12">
        <div className="flex justify-end mb-6">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" className="relative">
                <ShoppingBag className="h-4 w-4 mr-2" /> Cart
                {cartCount > 0 && <span className="ml-2 inline-flex h-5 w-5 items-center justify-center rounded-full bg-[color:var(--primary)] text-[color:var(--primary-foreground)] text-xs font-semibold">{cartCount}</span>}
              </Button>
            </SheetTrigger>
            <SheetContent className="flex flex-col">
              <SheetHeader><SheetTitle>Your cart</SheetTitle></SheetHeader>
              <div className="flex-1 overflow-y-auto py-4 space-y-4">
                {items.length === 0 && <p className="text-sm text-[color:var(--muted-foreground)]">Cart is empty.</p>}
                {items.map((i) => (
                  <div key={i.id} className="flex gap-3 items-center">
                    {i.image_url && <img src={i.image_url} alt={i.name} className="h-14 w-14 rounded object-cover" />}
                    <div className="flex-1">
                      <div className="text-sm font-medium">{i.name}</div>
                      <div className="text-xs text-[color:var(--muted-foreground)]">${(i.price_cents / 100).toFixed(2)}</div>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <button onClick={() => cart.setQty(i.id, i.qty - 1)} className="p-1 hover:bg-[color:var(--muted)] rounded"><Minus className="h-3.5 w-3.5" /></button>
                      <span className="w-6 text-center text-sm">{i.qty}</span>
                      <button onClick={() => cart.setQty(i.id, i.qty + 1)} className="p-1 hover:bg-[color:var(--muted)] rounded"><Plus className="h-3.5 w-3.5" /></button>
                      <button onClick={() => cart.remove(i.id)} className="p-1 hover:bg-[color:var(--muted)] rounded text-rose-600 ml-1"><Trash2 className="h-3.5 w-3.5" /></button>
                    </div>
                  </div>
                ))}
              </div>
              <div className="border-t border-[color:var(--border)] pt-4 space-y-3">
                <div className="flex justify-between font-semibold"><span>Total</span><span>${(cartTotal / 100).toFixed(2)} CAD</span></div>
                <Button className="w-full" disabled={items.length === 0} onClick={() => toast.info("Stripe checkout activates once Payments is enabled in Connectors.")}>Checkout</Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((p) => (
            <article key={p.id} className="group rounded-xl border border-[color:var(--border)] overflow-hidden bg-[color:var(--card)]">
              <div className="aspect-square bg-[color:var(--muted)] overflow-hidden">
                {p.image_url ? <img src={p.image_url} alt={p.name} className="h-full w-full object-cover group-hover:scale-105 transition-transform" /> : <div className="h-full grid place-items-center text-[color:var(--muted-foreground)] text-sm">No image</div>}
              </div>
              <div className="p-4">
                <h3 className="font-semibold">{p.name}</h3>
                <p className="text-sm text-[color:var(--muted-foreground)] mt-1 line-clamp-2">{p.description}</p>
                <div className="mt-3 flex items-center justify-between">
                  <span className="font-display text-lg font-semibold">${(p.price_cents / 100).toFixed(2)}</span>
                  <Button size="sm" onClick={() => { cart.add({ id: p.id, name: p.name, price_cents: p.price_cents, image_url: p.image_url }); toast.success("Added to cart"); }}>Add</Button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
