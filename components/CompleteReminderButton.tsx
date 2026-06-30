"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2 } from "lucide-react";
import { supabase } from "@/lib/supabase";

export function CompleteReminderButton({ id }: { id: string }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  return (
    <button
      className="large-button secondary-button"
      type="button"
      disabled={isPending}
      onClick={() => {
        startTransition(async () => {
          const client = supabase;
          if (!client) return;

          await client
            .from("reminders")
            .update({
              status: "completed",
              completed_at: new Date().toISOString()
            })
            .eq("id", id);

          router.refresh();
        });
      }}
    >
      <CheckCircle2 size={19} /> {isPending ? "Saving..." : "Mark Completed"}
    </button>
  );
}
