import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Mail, MapPin, Phone } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useSiteSettings } from "@/lib/site-content";
import { useServerFn } from "@tanstack/react-start";
import { sendFormNotification } from "@/lib/notify.functions";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact NUFF — Niagara Ukrainian Family Festival" },
      { name: "description", content: "Get in touch with the NUFF organizing team. Visit us at Fireman's Park, 2275 Dorchester Road, Niagara Falls." },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  const s = useSiteSettings();
  const [busy, setBusy] = useState(false);
  const notify = useServerFn(sendFormNotification);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const name = String(fd.get("name") ?? "");
    const email = String(fd.get("email") ?? "");
    const subject = String(fd.get("subject") ?? "") || null;
    const message = String(fd.get("message") ?? "");
    setBusy(true);
    const { error } = await supabase.from("contact_messages").insert({ name, email, subject, message });
    if (error) { setBusy(false); return toast.error(error.message); }
    // Fire-and-forget email
    notify({ data: { kind: "contact", subject: subject || `Message from ${name}`, fields: { name, email, subject: subject || "" }, message } }).catch(() => {});
    setBusy(false);
    toast.success("Thanks — we'll be in touch shortly.");
    (e.target as HTMLFormElement).reset();
  };

  return (
    <>
      <PageHeader eyebrow="Contact" title="Let's talk." subtitle="Questions about the festival, partnerships, or media inquiries? Send us a note." />
      <section className="container-page py-16 grid lg:grid-cols-2 gap-12">
        <div>
          <form onSubmit={onSubmit} className="space-y-4 max-w-lg">
            <div className="grid sm:grid-cols-2 gap-4">
              <div><Label htmlFor="name">Name</Label><Input id="name" name="name" required maxLength={200} /></div>
              <div><Label htmlFor="email">Email</Label><Input id="email" name="email" type="email" required /></div>
            </div>
            <div><Label htmlFor="subject">Subject</Label><Input id="subject" name="subject" maxLength={300} /></div>
            <div><Label htmlFor="message">Message</Label><Textarea id="message" name="message" rows={6} required minLength={5} maxLength={5000} /></div>
            <Button type="submit" size="lg" disabled={busy}>{busy ? "Sending…" : "Send message"}</Button>
          </form>

          <div className="mt-10 space-y-3 text-sm">
            <div className="flex gap-3"><MapPin className="h-5 w-5 text-[color:var(--primary)] shrink-0" /><div><div className="font-semibold">{s.location_name}</div><div className="text-[color:var(--muted-foreground)]">{s.location_address}</div></div></div>
            {s.contact_email && <div className="flex gap-3"><Mail className="h-5 w-5 text-[color:var(--primary)] shrink-0" /><a href={`mailto:${s.contact_email}`} className="hover:underline">{s.contact_email}</a></div>}
            {s.contact_phone && <div className="flex gap-3"><Phone className="h-5 w-5 text-[color:var(--primary)] shrink-0" /><a href={`tel:${s.contact_phone}`} className="hover:underline">{s.contact_phone}</a></div>}
          </div>
        </div>
        <div className="rounded-2xl overflow-hidden border border-[color:var(--border)] min-h-[400px]">
          <iframe
            title="NUFF location"
            src="https://www.google.com/maps?q=Fireman%27s+Park%2C+2275+Dorchester+Road%2C+Niagara+Falls%2C+ON&output=embed"
            className="w-full h-full min-h-[400px]"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </section>
    </>
  );
}
