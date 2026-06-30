"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { supabase } from "@/lib/supabase";

type DeleteButtonProps = {
  table: "vehicles" | "service_records" | "reminders";
  id: string;
  label?: string;
  redirectTo?: string;
};

export function DeleteButton({ table, id, label = "Delete", redirectTo }: DeleteButtonProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  return (
    <button
      className="large-button danger-button"
      type="button"
      disabled={isPending}
      onClick={() => {
        startTransition(async () => {
          const client = supabase;
          if (!client) return;

          await client.from(table).delete().eq("id", id);
          if (redirectTo) router.push(redirectTo);
          router.refresh();
        });
      }}
    >
      <Trash2 size={18} /> {isPending ? "Deleting..." : label}
    </button>
  );
}
