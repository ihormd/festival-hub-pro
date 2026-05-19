import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

export const adminConfirmBookingAdmin = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) => z.object({ booking_id: z.string().uuid() }).parse(input))
  .handler(async ({ data, context }) => {
    const { userId, supabase } = context;
    // Verify the caller is an admin via the per-user client (RLS protected)
    const { data: roles } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", userId)
      .eq("role", "admin")
      .maybeSingle();
    if (!roles) throw new Error("Admin only");

    // Service-role bypasses the function permission revoke
    const { data: booking, error: bErr } = await supabaseAdmin
      .from("vendor_bookings")
      .update({ status: "paid", pending_until: null })
      .eq("id", data.booking_id)
      .select()
      .single();
    if (bErr) throw new Error(bErr.message);
    await supabaseAdmin
      .from("vendor_spots")
      .update({ status: "occupied", pending_until: null })
      .eq("id", booking.spot_id);
    return { ok: true };
  });

export const adminCancelBookingAdmin = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) => z.object({ booking_id: z.string().uuid() }).parse(input))
  .handler(async ({ data, context }) => {
    const { userId, supabase } = context;
    const { data: roles } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", userId)
      .eq("role", "admin")
      .maybeSingle();
    if (!roles) throw new Error("Admin only");

    const { data: booking, error } = await supabaseAdmin
      .from("vendor_bookings")
      .update({ status: "cancelled", pending_until: null })
      .eq("id", data.booking_id)
      .select()
      .single();
    if (error) throw new Error(error.message);
    await supabaseAdmin
      .from("vendor_spots")
      .update({ status: "available", vendor_user_id: null, pending_until: null })
      .eq("id", booking.spot_id);
    return { ok: true };
  });
