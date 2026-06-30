import Link from "next/link";
import { AlertTriangle, CheckCircle2 } from "lucide-react";
import { CompleteReminderButton } from "@/components/CompleteReminderButton";
import { PageFrame } from "@/components/PageFrame";
import { getAppData } from "@/lib/data";
import { formatDate, formatMileage, getReminderTone, getServiceLabel, getVehicleName } from "@/lib/utils";

export default async function RemindersPage() {
  const { reminders, vehicles, isDemo } = await getAppData();

  return (
    <PageFrame>
      <section className="mb-5">
        <h1 className="section-title">Reminders</h1>
        <p className="mt-2 text-ink/65 dark:text-white/65">See what is due soon, overdue, and already completed.</p>
        {isDemo && <p className="mt-2 text-sm font-semibold text-clay">Demo reminders shown. Login to see your real reminders.</p>}
      </section>
      <div className="grid gap-3">
        {reminders.map((reminder) => {
          const serviceParams = new URLSearchParams({
            vehicleId: reminder.vehicleId,
            serviceType: reminder.serviceType,
            customServiceName: reminder.customServiceName,
            reminderId: reminder.id
          });

          return (
          <article key={reminder.id} className={`relative overflow-hidden rounded-2xl border p-4 shadow-soft ${getReminderTone(reminder.status)}`}>
            <div className="absolute right-0 top-0 h-20 w-20 rounded-full bg-white/30 blur-xl" />
            <div className="flex items-start justify-between gap-3">
              <div className="flex gap-3">
                <span className="grid h-11 w-11 place-items-center rounded-xl bg-white/70 dark:bg-white/10">
                  {reminder.status === "overdue" ? <AlertTriangle size={22} /> : <CheckCircle2 size={22} />}
                </span>
                <div>
                <p className="text-sm font-bold">{getVehicleName(vehicles, reminder.vehicleId)}</p>
                <h2 className="text-lg font-bold capitalize">{getServiceLabel(reminder.serviceType, reminder.customServiceName)}</h2>
                </div>
              </div>
              <span className="rounded-lg bg-white/70 px-3 py-1 text-sm font-bold capitalize dark:bg-white/10">{reminder.status}</span>
            </div>
            <p className="mt-3 text-sm">Due at {formatMileage(reminder.dueMileage)} km or {formatDate(reminder.dueDate)}</p>
            {isDemo ? (
              <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                <Link href={`/service/new?${serviceParams.toString()}`} className="large-button bg-moss text-white">
                  I Serviced This
                </Link>
                <button className="large-button secondary-button" type="button">
                  <CheckCircle2 size={19} /> Demo Only
                </button>
              </div>
            ) : reminder.status === "completed" ? (
              <p className="mt-4 text-sm font-bold text-emerald-700 dark:text-emerald-200">Completed already</p>
            ) : (
              <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                <Link href={`/service/new?${serviceParams.toString()}`} className="large-button bg-moss text-white">
                  I Serviced This
                </Link>
                <CompleteReminderButton id={reminder.id} />
              </div>
            )}
          </article>
          );
        })}
        {reminders.length === 0 && <div className="soft-card theme-muted text-center">No reminders yet.</div>}
      </div>
    </PageFrame>
  );
}
