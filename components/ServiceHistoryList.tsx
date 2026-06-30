"use client";

import { useMemo, useState } from "react";
import { Search, Trash2 } from "lucide-react";
import { DeleteButton } from "@/components/DeleteButton";
import type { ServiceRecord, Vehicle } from "@/lib/types";
import { formatCurrency, formatDate, formatMileage, getServiceLabel, getVehicleName } from "@/lib/utils";

export function ServiceHistoryList({
  records,
  vehicles,
  isDemo
}: {
  records: ServiceRecord[];
  vehicles: Vehicle[];
  isDemo: boolean;
}) {
  const [search, setSearch] = useState("");
  const [vehicleId, setVehicleId] = useState("all");
  const [serviceName, setServiceName] = useState("all");

  const serviceNames = useMemo(() => {
    return Array.from(
      new Set(records.map((record) => getServiceLabel(record.serviceType, record.customServiceName)))
    ).sort((first, second) => first.localeCompare(second));
  }, [records]);

  const filteredRecords = useMemo(() => {
    const cleanSearch = search.trim().toLowerCase();

    return records.filter((record) => {
      const label = getServiceLabel(record.serviceType, record.customServiceName);
      const vehicleName = getVehicleName(vehicles, record.vehicleId);
      const searchableText = `${label} ${vehicleName} ${record.shopName} ${record.notes}`.toLowerCase();

      return (
        (vehicleId === "all" || record.vehicleId === vehicleId) &&
        (serviceName === "all" || label === serviceName) &&
        (!cleanSearch || searchableText.includes(cleanSearch))
      );
    });
  }, [records, search, serviceName, vehicleId, vehicles]);

  const hasFilters = search || vehicleId !== "all" || serviceName !== "all";

  return (
    <>
      <div className="soft-card mb-5 grid gap-3 sm:grid-cols-[1fr_180px_180px]">
        <label className="relative block">
          <Search className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink/40 dark:text-white/40" size={20} />
          <input
            className="field pl-12"
            placeholder="Search service, shop, notes"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </label>
        <select className="field" value={vehicleId} onChange={(event) => setVehicleId(event.target.value)}>
          <option value="all">All vehicles</option>
          {vehicles.map((vehicle) => (
            <option key={vehicle.id} value={vehicle.id}>
              {vehicle.name}
            </option>
          ))}
        </select>
        <select className="field" value={serviceName} onChange={(event) => setServiceName(event.target.value)}>
          <option value="all">All services</option>
          {serviceNames.map((name) => (
            <option key={name} value={name}>
              {name}
            </option>
          ))}
        </select>
      </div>

      {hasFilters && (
        <button
          className="secondary-button mb-5 rounded-full px-4 py-2 text-sm font-bold"
          type="button"
          onClick={() => {
            setSearch("");
            setVehicleId("all");
            setServiceName("all");
          }}
        >
          Clear filters
        </button>
      )}

      <div className="grid gap-3">
        {filteredRecords.map((record) => (
          <article key={record.id} className="soft-card">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-bold text-moss">{getVehicleName(vehicles, record.vehicleId)}</p>
                <h2 className="text-lg font-bold capitalize">{getServiceLabel(record.serviceType, record.customServiceName)}</h2>
                <p className="theme-muted text-sm">{formatDate(record.date)} - {formatMileage(record.mileage)} km</p>
              </div>
              <p className="font-bold">{formatCurrency(record.cost)}</p>
            </div>
            {(record.shopName || record.notes) && (
              <p className="theme-muted mt-3 text-sm">
                {[record.shopName, record.notes].filter(Boolean).join(": ")}
              </p>
            )}
            <div className="mt-4 flex gap-2">
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
        {records.length > 0 && filteredRecords.length === 0 && (
          <div className="soft-card theme-muted text-center">No records match those filters.</div>
        )}
      </div>
    </>
  );
}
