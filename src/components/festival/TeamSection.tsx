import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";

type Member = { id: string; name: string; role: string; bio: string | null; image_url: string | null; sort_order: number };

function initials(name: string) {
  return name.split(" ").map((s) => s[0]).slice(0, 2).join("").toUpperCase();
}

export function TeamSection() {
  const [members, setMembers] = useState<Member[]>([]);
  useEffect(() => {
    supabase.from("team_members").select("*").eq("active", true).order("sort_order").then(({ data }) => setMembers((data as Member[]) ?? []));
  }, []);

  return (
    <section className="container-page py-20 lg:py-28">
      <div className="max-w-2xl">
        <p className="eyebrow">Board of Directors</p>
        <h2 className="display-lg mt-2">The volunteers behind NUFF.</h2>
        <p className="mt-4 text-[color:var(--muted-foreground)]">An all-volunteer board guides the festival's vision, finances, and partnerships.</p>
      </div>
      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.15 }}
        variants={{ hidden: {}, show: { transition: { staggerChildren: 0.08 } } }}
        className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
      >
        {members.map((m) => (
          <motion.article
            key={m.id}
            variants={{ hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0, transition: { duration: 0.45 } } }}
            className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--card)] p-6 shadow-[var(--shadow-soft)] flex gap-4"
          >
            {m.image_url ? (
              <img src={m.image_url} alt={m.name} className="h-20 w-20 rounded-full object-cover shrink-0" />
            ) : (
              <div className="h-20 w-20 rounded-full shrink-0 grid place-items-center font-display text-xl font-semibold bg-gradient-to-br from-[color:var(--primary)] to-[color:var(--secondary)] text-white">
                {initials(m.name)}
              </div>
            )}
            <div className="min-w-0">
              <h3 className="font-display text-lg font-semibold">{m.name}</h3>
              <p className="text-xs uppercase tracking-wider text-[color:var(--primary)] font-semibold mt-0.5">{m.role}</p>
              {m.bio && <p className="text-sm text-[color:var(--muted-foreground)] mt-2 leading-relaxed">{m.bio}</p>}
            </div>
          </motion.article>
        ))}
      </motion.div>
    </section>
  );
}
