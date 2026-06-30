"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { CalendarDays, Gauge, ReceiptText, Save, Wrench } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { serviceTypes, type ServiceType, type Vehicle } from "@/lib/types";

export function ServiceForm({ userId, vehicles }: { userId: string | null; vehicles: Vehicle[] }) {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [isPending, startTransition] = useTransition();
  const today = new Date().toISOString().slice(0, 10);

  function handleSave(formData: FormData) {
    const client = supabase;

    if (!client || !userId) {
      setMessage("Please login before saving.");
      return;
    }

    if (vehicles.length === 0) {
      setMessage("Add a vehicle first.");
      return;
    }

    const payload = {
      user_id: userId,
      vehicle_id: String(formData.get("vehicleId") ?? ""),
      service_date: String(formData.get("date") ?? today),
      mileage: Number(formData.get("mileage") ?? 0),
      service_type: String(formData.get("serviceType") ?? "engine oil") as ServiceType,
      cost: Number(formData.get("cost") ?? 0),
      shop_name: String(formData.get("shopName") ?? ""),
      notes: String(formData.get("notes") ?? "")
    };

    startTransition(async () => {
      const result = await client.from("service_records").insert(payload);

      if (result.error) {
        setMessage(result.error.message);
        return;
      }

      router.push("/history");
      router.refresh();
    });
  }

  return (
    <form action={handleSave} className="soft-card space-y-5">
      {vehicles.length === 0 && (
        <div className="rounded-xl bg-amber-50 p-4 text-sm font-semibold text-amber-700 dark:bg-amber-400/10 dark:text-amber-200">
          Add one vehicle before saving a service record.
        </div>
      )}
      <div className="flex items-center gap-3 rounded-2xl bg-mist p-4 dark:bg-white/10">
        <span className="grid h-11 w-11 place-items-center rounded-xl bg-moss text-white">
          <Wrench size={22} />
        </span>
        <div>
          <h2 className="text-lg font-bold">Service Details</h2>
          <p className="text-sm text-ink/60 dark:text-white/60">A clean record today prevents guessing later.</p>
        </div>
      </div>
      <label className="block">
        <span className="mb-2 block font-semibold">Vehicle</span>
        <select className="field" name="vehicleId" defaultValue={vehicles[0]?.id}>
          {vehicles.map((vehicle) => (
            <option key={vehicle.id} value={vehicle.id}>
              {vehicle.name} - {vehicle.plateNumber}
            </option>
          ))}
        </select>
      </label>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="mb-2 flex items-center gap-2 font-semibold"><CalendarDays size={18} /> Date</span>
          <input className="field" name="date" type="date" defaultValue={today} />
        </label>
        <label className="block">
          <span className="mb-2 flex items-center gap-2 font-semibold"><Gauge size={18} /> Mileage</span>
          <input className="field" name="mileage" type="number" placeholder="30000" required />
          <span className="mt-2 block text-sm text-ink/55 dark:text-white/55">
            Enter the odometer reading at service time. Service Saja updates the vehicle mileage and next reminder from this.
          </span>
        </label>
      </div>
      <label className="block">
        <span className="mb-2 block font-semibold">Service Type</span>
        <select className="field" name="serviceType" defaultValue="engine oil">
          {serviceTypes.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </label>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="mb-2 flex items-center gap-2 font-semibold"><ReceiptText size={18} /> Cost</span>
          <input className="field" name="cost" type="number" placeholder="80" required />
        </label>
        <label className="block">
          <span className="mb-2 block font-semibold">Shop / Mechanic</span>
          <input className="field" name="shopName" placeholder="Workshop name" />
        </label>
      </div>
      <label className="block">
        <span className="mb-2 block font-semibold">Notes</span>
        <textarea className="field min-h-28 py-3" name="notes" placeholder="Example: changed oil filter too" />
      </label>
      <button type="submit" className="large-button w-full bg-moss text-white" disabled={isPending || vehicles.length === 0}>
        <Save size={20} /> {isPending ? "Saving..." : "Save Service Record"}
      </button>
      {message && <p className="text-center text-sm font-semibold text-red-700 dark:text-red-200">{message}</p>}
    </form>
  );
}
