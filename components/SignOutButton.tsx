"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { supabase } from "@/lib/supabase";

export function SignOutButton() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  return (
    <button
      type="button"
      className="large-button secondary-button w-full"
      disabled={isPending}
      onClick={() => {
        startTransition(async () => {
          const client = supabase;
          if (client) {
            await client.auth.signOut();
          }
          await fetch("/auth/session", { method: "DELETE" });
          router.push("/");
          router.refresh();
        });
      }}
    >
      <LogOut size={20} />
      {isPending ? "Signing out..." : "Sign Out"}
    </button>
  );
}
