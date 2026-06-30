import Link from "next/link";
import { AlertTriangle, CheckCircle2, Clock3 } from "lucide-react";
import type { Reminder, Vehicle } from "@/lib/types";
import { formatDate, formatMileage, getServiceLabel, getVehicleName } from "@/lib/utils";

export function ServiceAlertCard({ reminders, vehicles }: { reminders: Reminder[]; vehicles: Vehicle[] }) {
  const overdue = reminders.filter((reminder) => reminder.status === "overdue");
  const dueSoon = reminders.filter((reminder) => reminder.status === "due soon");
  const mainReminder = overdue[0] ?? dueSoon[0];

  if (!mainReminder) {
    return (
      <section className="relative overflow-hidden rounded-2xl border border-emerald-200 bg-gradient-to-br from-emerald-50 to-white p-5 shadow-soft dark:border-emerald-400/20 dark:from-emerald-500/15 dark:to-white/5">
        <div className="flex items-start gap-4">
          <span className="grid h-12 w-12 place-items-center rounded-xl bg-emerald-600 text-white">
            <CheckCircle2 size={24} />
          </span>
          <div>
            <p className="text-sm font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-300">All Good</p>
            <h2 className="mt-1 text-2xl font-bold">No urgent service yet.</h2>
            <p className="mt-2 text-sm text-ink/65 dark:text-white/65">Add service records and Service Saja will watch the next due items.</p>
          </div>
        </div>
      </section>
    );
  }

  const isOverdue = mainReminder.status === "overdue";
  const Icon = isOverdue ? AlertTriangle : Clock3;

  return (
    <section className="relative overflow-hidden rounded-2xl border border-clay/25 bg-gradient-to-br from-white via-porcelain to-orange-50 p-5 shadow-soft dark:border-clay/30 dark:from-white/10 dark:via-white/5 dark:to-clay/10">
      <div className="absolute right-0 top-0 h-28 w-28 rounded-full bg-clay/10 blur-2xl" />
      <div className="relative flex items-start gap-4">
        <span className={`grid h-12 w-12 place-items-center rounded-xl text-white ${isOverdue ? "bg-red-600" : "bg-clay"}`}>
          <Icon size={24} />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-bold uppercase tracking-wider text-clay">{isOverdue ? "Needs Attention" : "Coming Soon"}</p>
          <h2 className="mt-1 text-2xl font-bold capitalize">
            {getServiceLabel(mainReminder.serviceType, mainReminder.customServiceName)}
          </h2>
          <p className="mt-2 text-sm text-ink/70 dark:text-white/70">
            {getVehicleName(vehicles, mainReminder.vehicleId)} is due at {formatMileage(mainReminder.dueMileage)} km or {formatDate(mainReminder.dueDate)}.
          </p>
          <div className="mt-4 flex flex-col gap-2 sm:flex-row">
            <Link href="/service/new" className="large-button bg-moss text-white">
              Add Service
            </Link>
            <Link href="/reminders" className="large-button secondary-button">
              View Alerts
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
