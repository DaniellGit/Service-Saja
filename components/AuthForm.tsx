"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { LogIn, UserPlus } from "lucide-react";
import { supabase } from "@/lib/supabase";

export function AuthForm({ isConfigured }: { isConfigured: boolean }) {
  const router = useRouter();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [isPending, startTransition] = useTransition();

  function handleSubmit(formData: FormData) {
    const client = supabase;

    if (!client || !isConfigured) {
      setMessage("Supabase is not configured yet.");
      return;
    }

    const formEmail = String(formData.get("email") ?? "");
    const formPassword = String(formData.get("password") ?? "");
    const formFullName = String(formData.get("fullName") ?? "Service Saja User");

    startTransition(async () => {
      const result =
        mode === "login"
          ? await client.auth.signInWithPassword({ email: formEmail, password: formPassword })
          : await client.auth.signUp({
              email: formEmail,
              password: formPassword,
              options: { data: { full_name: formFullName } }
            });

      if (result.error) {
        setMessage(result.error.message);
        return;
      }

      if (result.data.session) {
        await fetch("/auth/session", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            accessToken: result.data.session.access_token,
            refreshToken: result.data.session.refresh_token
          })
        });
      }

      setMessage(mode === "login" ? "Logged in successfully." : "Account created. Check email if confirmation is enabled.");
      router.push("/dashboard");
      router.refresh();
    });
  }

  return (
    <form action={handleSubmit} className="space-y-4">
      {mode === "signup" && (
        <label className="block">
          <span className="mb-2 block font-semibold">Full Name</span>
          <input className="field" name="fullName" placeholder="Your name" value={fullName} onChange={(event) => setFullName(event.target.value)} />
        </label>
      )}
      <label className="block">
        <span className="mb-2 block font-semibold">Email</span>
        <input className="field" name="email" type="email" placeholder="you@example.com" value={email} onChange={(event) => setEmail(event.target.value)} required />
      </label>
      <label className="block">
        <span className="mb-2 block font-semibold">Password</span>
        <input className="field" name="password" type="password" placeholder="Your password" value={password} onChange={(event) => setPassword(event.target.value)} required minLength={6} />
      </label>
      <button type="submit" className="large-button w-full bg-moss text-white" disabled={isPending}>
        {mode === "login" ? <LogIn size={20} /> : <UserPlus size={20} />}
        {isPending ? "Please wait..." : mode === "login" ? "Login" : "Create Account"}
      </button>
      <button
        type="button"
        className="large-button secondary-button w-full"
        onClick={() => {
          setMode(mode === "login" ? "signup" : "login");
          setMessage("");
        }}
      >
        {mode === "login" ? "Need an account? Sign up" : "Already have an account? Login"}
      </button>
      {message && <p className="text-center text-sm font-semibold text-moss">{message}</p>}
    </form>
  );
}
