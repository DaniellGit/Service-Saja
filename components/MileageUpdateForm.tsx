"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Gauge, Plus } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { formatMileage } from "@/lib/utils";

export function MileageUpdateForm({ vehicleId, currentMileage }: { vehicleId: string; currentMileage: number }) {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [mileage, setMileage] = useState(currentMileage);
  const [isPending, startTransition] = useTransition();

  function handleSave(formData: FormData) {
    const client = supabase;
    if (!client) {
      setMessage("Please login before updating mileage.");
      return;
    }

    const nextMileage = Number(formData.get("currentMileage") ?? mileage);

    if (nextMileage < currentMileage) {
      setMessage("Mileage cannot be lower than the current reading.");
      return;
    }

    startTransition(async () => {
      const result = await client.from("vehicles").update({ current_mileage: nextMileage }).eq("id", vehicleId);

      if (result.error) {
        setMessage(result.error.message);
        return;
      }

      setMessage("Mileage updated. Reminders now use this latest reading.");
      router.refresh();
    });
  }

  return (
    <form action={handleSave} className="relative overflow-hidden rounded-2xl border border-moss/10 bg-gradient-to-br from-white to-mist p-5 shadow-soft dark:border-white/10 dark:from-white/10 dark:to-moss/10">
      <div className="absolute -right-8 -top-8 h-28 w-28 rounded-full bg-sage/20 blur-2xl" />
      <div className="relative space-y-4">
        <div className="flex items-center gap-3">
          <span className="grid h-12 w-12 place-items-center rounded-xl bg-moss text-white shadow-soft">
            <Gauge size={24} />
          </span>
          <div>
            <h2 className="text-xl font-bold">Current Mileage</h2>
            <p className="text-sm text-ink/60 dark:text-white/60">Tap, enter today&apos;s odometer, and we keep reminders aligned.</p>
          </div>
        </div>
        <div className="rounded-2xl bg-white/70 p-4 dark:bg-black/10">
          <p className="text-sm font-semibold text-ink/55 dark:text-white/55">Latest reading</p>
          <p className="mt-1 text-4xl font-bold tracking-tight">{formatMileage(mileage)} km</p>
        </div>
        <input
          className="field text-lg font-bold"
          name="currentMileage"
          type="number"
          value={mileage}
          min={currentMileage}
          onChange={(event) => setMileage(Number(event.target.value))}
          required
        />
        <div className="grid grid-cols-3 gap-2">
          {[500, 1000, 5000].map((amount) => (
            <button
              key={amount}
              type="button"
              className="large-button secondary-button"
              onClick={() => setMileage((value) => value + amount)}
            >
              <Plus size={16} /> {amount}
            </button>
          ))}
        </div>
        <button type="submit" className="large-button w-full bg-moss text-white" disabled={isPending}>
          {isPending ? "Updating..." : "Update Mileage"}
        </button>
        {message && <p className="text-center text-sm font-semibold text-moss dark:text-sage">{message}</p>}
      </div>
    </form>
  );
}
