import { Pencil, Search, Trash2 } from "lucide-react";
import { DeleteButton } from "@/components/DeleteButton";
import { PageFrame } from "@/components/PageFrame";
import { getAppData } from "@/lib/data";
import { formatCurrency, formatDate, formatMileage, getVehicleName } from "@/lib/utils";

export default async function HistoryPage() {
  const { records, vehicles, isDemo } = await getAppData();

  return (
    <PageFrame>
      <section className="mb-5">
        <h1 className="section-title">Service History</h1>
        <p className="theme-muted mt-2">Filter by vehicle or service type when the list grows.</p>
        {isDemo && <p className="mt-2 text-sm font-semibold text-clay">Demo history shown. Login to see your real records.</p>}
      </section>
      <div className="soft-card mb-5 grid gap-3 sm:grid-cols-[1fr_180px_180px]">
        <label className="relative block">
          <Search className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink/40 dark:text-white/40" size={20} />
          <input className="field pl-12" placeholder="Search service or shop" />
        </label>
        <select className="field">
          <option>All vehicles</option>
          {vehicles.map((vehicle) => (
            <option key={vehicle.id}>{vehicle.name}</option>
          ))}
        </select>
        <select className="field">
          <option>All services</option>
          <option>engine oil</option>
          <option>brake pad</option>
          <option>tire</option>
        </select>
      </div>
      <div className="grid gap-3">
        {records.map((record) => (
          <article key={record.id} className="soft-card">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-bold text-moss">{getVehicleName(vehicles, record.vehicleId)}</p>
                <h2 className="text-lg font-bold capitalize">{record.serviceType}</h2>
                <p className="theme-muted text-sm">{formatDate(record.date)} - {formatMileage(record.mileage)} km</p>
              </div>
              <p className="font-bold">{formatCurrency(record.cost)}</p>
            </div>
            <p className="theme-muted mt-3 text-sm">{record.shopName}: {record.notes}</p>
            <div className="mt-4 flex gap-2">
              <button className="large-button secondary-button" type="button">
                <Pencil size={18} /> Edit
              </button>
              {isDemo ? (
                <button className="large-button danger-button" type="button">
                  <Trash2 size={18} /> Delete
                </button>
              ) : (
                <DeleteButton table="service_records" id={record.id} />
              )}
            </div>
          </article>
        ))}
        {records.length === 0 && <div className="soft-card theme-muted text-center">No service records yet.</div>}
      </div>
    </PageFrame>
  );
}
