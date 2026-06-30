"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Save, SlidersHorizontal } from "lucide-react";
import { supabase } from "@/lib/supabase";
import type { ServiceInterval, Vehicle } from "@/lib/types";
import { getServiceLabel } from "@/lib/utils";

export function ServiceScheduleForm({
  userId,
  vehicle,
  intervals
}: {
  userId: string | null;
  vehicle: Vehicle;
  intervals: ServiceInterval[];
}) {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [isPending, startTransition] = useTransition();

  function handleSave(formData: FormData) {
    const client = supabase;

    if (!client || !userId) {
      setMessage("Please login before saving service schedule.");
      return;
    }

    const rows = intervals.map((interval) => ({
      user_id: userId,
      vehicle_id: vehicle.id,
      service_type: interval.serviceType,
      custom_service_name: interval.customServiceName || null,
      interval_mileage: Number(formData.get(`${interval.id}-mileage`) ?? interval.intervalMileage),
      interval_months: Number(formData.get(`${interval.id}-months`) ?? interval.intervalMonths)
    }));

    startTransition(async () => {
      const result = await client
        .from("service_intervals")
        .upsert(rows, { onConflict: "vehicle_id,service_type,custom_service_key" });

      if (result.error) {
        setMessage(result.error.message);
        return;
      }

      setMessage("Service schedule saved.");
      router.refresh();
    });
  }

  return (
    <form action={handleSave} className="space-y-4">
      <section className="soft-card">
        <div className="flex items-center gap-3">
          <span className="grid h-11 w-11 place-items-center rounded-xl bg-moss text-white">
            <SlidersHorizontal size={22} />
          </span>
          <div>
            <h2 className="text-lg font-bold">Service Schedule</h2>
            <p className="theme-muted text-sm">Set how often each item should be serviced for this vehicle.</p>
          </div>
        </div>
      </section>

      <div className="grid gap-3">
        {intervals.map((interval) => (
          <article key={interval.id} className="soft-card">
            <h3 className="mb-1 font-bold capitalize">{getServiceLabel(interval.serviceType, interval.customServiceName)}</h3>
            {interval.customServiceName && <p className="theme-muted mb-3 text-sm">Custom service</p>}
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="block">
                <span className="mb-2 block text-sm font-semibold">Every mileage</span>
                <input
                  className="field"
                  name={`${interval.id}-mileage`}
                  type="number"
                  min={1}
                  defaultValue={interval.intervalMileage}
                  required
                />
              </label>
              <label className="block">
                <span className="mb-2 block text-sm font-semibold">Or every months</span>
                <input
                  className="field"
                  name={`${interval.id}-months`}
                  type="number"
                  min={1}
                  defaultValue={interval.intervalMonths}
                  required
                />
              </label>
            </div>
          </article>
        ))}
      </div>

      <button type="submit" className="large-button w-full bg-moss text-white" disabled={isPending}>
        <Save size={20} /> {isPending ? "Saving..." : "Save Schedule"}
      </button>
      {message && <p className="text-center text-sm font-semibold text-moss dark:text-sage">{message}</p>}
    </form>
  );
}
