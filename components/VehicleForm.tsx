"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Save } from "lucide-react";
import { supabase } from "@/lib/supabase";
import type { Vehicle, VehicleType } from "@/lib/types";

export function VehicleForm({ userId, vehicle }: { userId: string | null; vehicle?: Vehicle }) {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [isPending, startTransition] = useTransition();

  function handleSave(formData: FormData) {
    const client = supabase;

    if (!client || !userId) {
      setMessage("Please login before saving.");
      return;
    }

    const payload = {
      user_id: userId,
      name: String(formData.get("name") ?? ""),
      plate_number: String(formData.get("plateNumber") ?? "").toUpperCase(),
      type: String(formData.get("type") ?? "Motorcycle") as VehicleType,
      model: String(formData.get("model") ?? ""),
      current_mileage: Number(formData.get("currentMileage") ?? 0)
    };

    startTransition(async () => {
      const result = vehicle
        ? await client.from("vehicles").update(payload).eq("id", vehicle.id)
        : await client.from("vehicles").insert(payload).select("id").single();

      if (result.error) {
        setMessage(result.error.message);
        return;
      }

      router.push(vehicle ? `/vehicles/${vehicle.id}` : "/dashboard");
      router.refresh();
    });
  }

  return (
    <form action={handleSave} className="soft-card space-y-4">
      <label className="block">
        <span className="mb-2 block font-semibold">Vehicle Name</span>
        <input className="field" name="name" defaultValue={vehicle?.name} placeholder="Example: Daily Scooter" required />
      </label>
      <label className="block">
        <span className="mb-2 block font-semibold">Plate Number</span>
        <input className="field" name="plateNumber" defaultValue={vehicle?.plateNumber} placeholder="ABC 1234" required />
      </label>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="mb-2 block font-semibold">Type</span>
          <select className="field" name="type" defaultValue={vehicle?.type ?? "Motorcycle"}>
            <option>Motorcycle</option>
            <option>Car</option>
          </select>
        </label>
        <label className="block">
          <span className="mb-2 block font-semibold">Current Mileage</span>
          <input className="field" name="currentMileage" type="number" defaultValue={vehicle?.currentMileage} placeholder="28000" required />
        </label>
      </div>
      <label className="block">
        <span className="mb-2 block font-semibold">Model</span>
        <input className="field" name="model" defaultValue={vehicle?.model} placeholder="Example: Yamaha NVX 155" required />
      </label>
      <button type="submit" className="large-button w-full bg-moss text-white" disabled={isPending}>
        <Save size={20} /> {isPending ? "Saving..." : "Save Vehicle"}
      </button>
      {message && <p className="text-center text-sm font-semibold text-red-700 dark:text-red-200">{message}</p>}
    </form>
  );
}
