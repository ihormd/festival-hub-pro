import { createFileRoute, Link, useNavigate, useSearch } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

const search = z.object({ redirect: z.string().optional() });

export const Route = createFileRoute("/login")({
  validateSearch: (s) => search.parse(s),
  component: LoginPage,
  head: () => ({ meta: [{ title: "Sign in — Festua" }] }),
});

function LoginPage() {
  const navigate = useNavigate();
  const { redirect } = useSearch({ from: "/login" });
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) return toast.error(error.message);
    toast.success("Welcome back");
    navigate({ to: redirect || "/dashboard" });
  };

  const onGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}${redirect || "/dashboard"}` },
    });
  };

  return (
    <div className="container-page py-16 max-w-md">
      <h1 className="font-display text-3xl font-semibold mb-2">Welcome back</h1>
      <p className="text-sm text-[color:var(--muted-foreground)] mb-8">Sign in to manage your applications, bookings, and orders.</p>
      <Button variant="outline" className="w-full mb-4" onClick={onGoogle}>Continue with Google</Button>
      <div className="relative my-6 text-center text-xs uppercase tracking-widest text-[color:var(--muted-foreground)]">
        <span className="bg-[color:var(--background)] px-3 relative z-10">or email</span>
        <div className="absolute inset-x-0 top-1/2 h-px bg-[color:var(--border)]" />
      </div>
      <form onSubmit={onSubmit} className="space-y-4">
        <div><Label>Email</Label><Input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} /></div>
        <div><Label>Password</Label><Input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} /></div>
        <Button type="submit" className="w-full" disabled={loading}>{loading ? "Signing in…" : "Sign in"}</Button>
      </form>
      <p className="mt-6 text-sm text-center text-[color:var(--muted-foreground)]">
        New here? <Link to="/signup" className="text-[color:var(--foreground)] underline">Create an account</Link>
      </p>
    </div>
  );
}
