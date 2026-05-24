import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const RESEND_API_URL = "https://api.resend.com/emails";

const PayloadSchema = z.object({
  kind: z.enum(["contact", "volunteer", "artist", "vendor", "sponsor", "vendor_booking"]),
  subject: z.string().min(1).max(200),
  fields: z.record(z.string().min(1).max(100), z.string().max(5000)).default({}),
  message: z.string().max(8000).optional(),
});

function renderHtml(kind: string, subject: string, fields: Record<string, string>, message?: string) {
  const rows = Object.entries(fields)
    .map(
      ([k, v]) =>
        `<tr><td style="padding:6px 14px;border-bottom:1px solid #eee;color:#666;font-size:13px;width:160px;vertical-align:top">${escapeHtml(k)}</td><td style="padding:6px 14px;border-bottom:1px solid #eee;font-size:14px">${escapeHtml(v)}</td></tr>`,
    )
    .join("");
  const msg = message
    ? `<div style="padding:14px;background:#fafaf7;border:1px solid #eee;border-radius:8px;margin-top:14px;white-space:pre-wrap;font-size:14px;line-height:1.5">${escapeHtml(message)}</div>`
    : "";
  return `<!doctype html><html><body style="font-family:-apple-system,Inter,Arial,sans-serif;background:#fff;padding:24px;color:#111">
    <div style="max-width:600px;margin:auto;border:1px solid #e5e5e5;border-radius:12px;overflow:hidden">
      <div style="background:#0057B7;color:#fff;padding:16px 20px;font-weight:700">NUFF · ${escapeHtml(kind.toUpperCase())}</div>
      <div style="padding:20px">
        <h2 style="margin:0 0 14px;font-size:18px">${escapeHtml(subject)}</h2>
        <table style="width:100%;border-collapse:collapse">${rows}</table>
        ${msg}
        <p style="color:#999;font-size:12px;margin-top:20px">Sent automatically from niagarka.ca</p>
      </div>
    </div>
  </body></html>`;
}

function escapeHtml(s: string) {
  return String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);
}

export const sendFormNotification = createServerFn({ method: "POST" })
  .inputValidator((input) => PayloadSchema.parse(input))
  .handler(async ({ data }) => {
    const RESEND_API_KEY = process.env.RESEND_API_KEY;
    if (!RESEND_API_KEY) {
      console.warn("[notify] missing RESEND_API_KEY, skip send");
      return { sent: false, reason: "missing-keys" as const };
    }

    const body = {
      from: "NUFF Notifications <onboarding@resend.dev>",
      to: ["niagarka@gmail.com"],
      cc: ["ihorledger@gmail.com"],
      reply_to: data.fields.contact_email || data.fields.email || undefined,
      subject: `[NUFF · ${data.kind}] ${data.subject}`,
      html: renderHtml(data.kind, data.subject, data.fields, data.message),
    };

    const res = await fetch(RESEND_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const text = await res.text();
      console.error("[notify] resend error", res.status, text);
      return { sent: false, reason: "resend-error" as const, status: res.status };
    }
    return { sent: true };
  });
