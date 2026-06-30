import Link from "next/link";
import { CarFront, Bike } from "lucide-react";
import type { Vehicle } from "@/lib/types";
import { formatMileage } from "@/lib/utils";

export function VehicleCard({ vehicle }: { vehicle: Vehicle }) {
  const Icon = vehicle.type === "Car" ? CarFront : Bike;

  return (
    <Link href={`/vehicles/${vehicle.id}`} className="soft-card group block transition hover:-translate-y-1">
      <div className="flex items-start gap-4">
        <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-moss text-white shadow-soft transition group-hover:scale-105">
          <Icon size={24} />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="text-lg font-bold">{vehicle.name}</h3>
              <p className="text-sm text-ink/60 dark:text-white/60">{vehicle.model}</p>
            </div>
            <span className="rounded-xl bg-mist px-3 py-1 text-sm font-bold text-moss dark:bg-white/10 dark:text-sage">{vehicle.plateNumber}</span>
          </div>
          <p className="mt-4 text-sm text-ink/70 dark:text-white/70">
            Current mileage: <span className="font-bold text-ink dark:text-linen">{formatMileage(vehicle.currentMileage)} km</span>
          </p>
        </div>
      </div>
    </Link>
  );
}
