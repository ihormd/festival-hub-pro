import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const BookSchema = z.object({
  spot_id: z.string().uuid(),
  method: z.enum(["stripe", "etransfer"]),
  contact_name: z.string().min(1).max(200),
  contact_email: z.string().email().max(320),
  contact_phone: z.string().max(40).optional().default(""),
  business_name: z.string().min(1).max(200),
});

export const bookVendorSpot = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) => BookSchema.parse(input))
  .handler(async ({ data, context }) => {
    const { supabase } = context;
    const { data: row, error } = await supabase.rpc("book_vendor_spot", {
      _spot_id: data.spot_id,
      _method: data.method,
      _contact_name: data.contact_name,
      _contact_email: data.contact_email,
      _contact_phone: data.contact_phone || "",
      _business_name: data.business_name,
    });
    if (error) throw new Error(error.message);
    return row as {
      id: string;
      order_number: string;
      amount_cents: number;
      payment_method: "stripe" | "etransfer";
      pending_until: string | null;
    };
  });

export const adminConfirmBooking = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) => z.object({ booking_id: z.string().uuid() }).parse(input))
  .handler(async ({ data, context }) => {
    const { supabase } = context;
    const { error } = await supabase.rpc("confirm_vendor_booking", { _booking_id: data.booking_id });
    if (error) throw new Error(error.message);
    return { ok: true };
  });
