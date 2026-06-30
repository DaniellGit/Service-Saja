import Link from "next/link";
import { notFound } from "next/navigation";
import { Pencil, PlusCircle, SlidersHorizontal, Trash2 } from "lucide-react";
import { DeleteButton } from "@/components/DeleteButton";
import { MileageUpdateForm } from "@/components/MileageUpdateForm";
import { PageFrame } from "@/components/PageFrame";
import { getAppData } from "@/lib/data";
import { formatCurrency, formatDate, formatMileage, getReminderTone, getServiceLabel } from "@/lib/utils";

export default async function VehicleDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { vehicles, records: allRecords, reminders: allReminders, isDemo } = await getAppData();
  const vehicle = vehicles.find((item) => item.id === id);
  if (!vehicle) notFound();

  const records = allRecords.filter((record) => record.vehicleId === vehicle.id);
  const reminders = allReminders.filter((reminder) => reminder.vehicleId === vehicle.id);

  return (
    <PageFrame>
      <section className="soft-card mb-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-wider text-moss">{vehicle.plateNumber}</p>
            <h1 className="font-display text-4xl font-semibold">{vehicle.name}</h1>
            <p className="theme-muted mt-2">{vehicle.model} - {vehicle.type}</p>
            <p className="mt-4 text-lg font-bold">{formatMileage(vehicle.currentMileage)} km</p>
          </div>
          <div className="flex gap-2">
            <Link href={`/vehicles/${vehicle.id}/edit`} className="large-button secondary-button">
              <Pencil size={18} /> Edit
            </Link>
            {isDemo ? (
              <button className="large-button danger-button" type="button">
                <Trash2 size={18} /> Delete
              </button>
            ) : (
              <DeleteButton table="vehicles" id={vehicle.id} redirectTo="/dashboard" />
            )}
          </div>
        </div>
        {isDemo && <p className="mt-4 text-sm font-semibold text-clay">Demo vehicle shown. Login to manage real vehicles.</p>}
      </section>
      <Link href="/service/new" className="large-button mb-5 w-full bg-clay text-white">
        <PlusCircle size={22} /> Add Service for This Vehicle
      </Link>
      <Link href={`/vehicles/${vehicle.id}/schedule`} className="large-button secondary-button mb-5 w-full">
        <SlidersHorizontal size={22} /> Service Schedule
      </Link>
      <section className="grid gap-5 lg:grid-cols-2">
        <div>
          {!isDemo && <div className="mb-5"><MileageUpdateForm vehicleId={vehicle.id} currentMileage={vehicle.currentMileage} /></div>}
          <h2 className="mb-3 text-xl font-bold">Recent Services</h2>
          <div className="grid gap-3">
            {records.map((record) => (
              <article key={record.id} className="soft-card">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-bold capitalize">{getServiceLabel(record.serviceType, record.customServiceName)}</p>
                    <p className="theme-muted text-sm">{formatDate(record.date)} - {formatMileage(record.mileage)} km</p>
                  </div>
                  <p className="font-bold text-moss">{formatCurrency(record.cost)}</p>
                </div>
                <p className="theme-muted mt-3 text-sm">{record.notes}</p>
              </article>
            ))}
            {records.length === 0 && <div className="soft-card theme-muted text-center">No services yet.</div>}
          </div>
        </div>
        <div>
          <h2 className="mb-3 text-xl font-bold">Reminders</h2>
          <div className="grid gap-3">
            {reminders.map((reminder) => (
              <article key={reminder.id} className={`rounded-lg border p-4 ${getReminderTone(reminder.status)}`}>
                <div className="flex items-start justify-between gap-3">
                  <p className="font-bold capitalize">{getServiceLabel(reminder.serviceType, reminder.customServiceName)}</p>
                  <p className="text-sm font-bold capitalize">{reminder.status}</p>
                </div>
                <p className="mt-2 text-sm">Due at {formatMileage(reminder.dueMileage)} km or {formatDate(reminder.dueDate)}</p>
              </article>
            ))}
            {reminders.length === 0 && <div className="soft-card theme-muted text-center">No reminders yet.</div>}
          </div>
        </div>
      </section>
    </PageFrame>
  );
}
