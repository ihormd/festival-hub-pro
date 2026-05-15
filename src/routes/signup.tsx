import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export const Route = createFileRoute("/signup")({
  component: SignupPage,
  head: () => ({ meta: [{ title: "Create account — Festua" }] }),
});

function SignupPage() {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName },
        emailRedirectTo: `${window.location.origin}/dashboard`,
      },
    });
    setLoading(false);
    if (error) return toast.error(error.message);
    toast.success("Check your email to confirm your account");
    navigate({ to: "/login" });
  };

  const onGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/dashboard` },
    });
  };

  return (
    <div className="container-page py-16 max-w-md">
      <h1 className="font-display text-3xl font-semibold mb-2">Join Festua</h1>
      <p className="text-sm text-[color:var(--muted-foreground)] mb-8">One account for vendor, artist, volunteer, and donor flows.</p>
      <Button variant="outline" className="w-full mb-4" onClick={onGoogle}>Continue with Google</Button>
      <div className="relative my-6 text-center text-xs uppercase tracking-widest text-[color:var(--muted-foreground)]">
        <span className="bg-[color:var(--background)] px-3 relative z-10">or email</span>
        <div className="absolute inset-x-0 top-1/2 h-px bg-[color:var(--border)]" />
      </div>
      <form onSubmit={onSubmit} className="space-y-4">
        <div><Label>Full name</Label><Input required value={fullName} onChange={(e) => setFullName(e.target.value)} /></div>
        <div><Label>Email</Label><Input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} /></div>
        <div><Label>Password</Label><Input type="password" required minLength={8} value={password} onChange={(e) => setPassword(e.target.value)} /></div>
        <Button type="submit" className="w-full" disabled={loading}>{loading ? "Creating…" : "Create account"}</Button>
      </form>
      <p className="mt-6 text-sm text-center text-[color:var(--muted-foreground)]">
        Already have an account? <Link to="/login" className="text-[color:var(--foreground)] underline">Sign in</Link>
      </p>
    </div>
  );
}
