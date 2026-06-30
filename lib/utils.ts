import type { Reminder, ServiceRecord, Vehicle } from "@/lib/types";
import type { ServiceType } from "@/lib/types";

const alwaysUppercaseWords = new Set(["abs", "bmw", "cvt", "jpj", "smc"]);

export function cleanText(value: string) {
  return value.trim().replace(/\s+/g, " ");
}

export function normalizeSearchKey(value: string) {
  return cleanText(value).toLowerCase();
}

export function toTitleCase(value: string) {
  return cleanText(value)
    .toLowerCase()
    .split(" ")
    .map((word) => {
      if (alwaysUppercaseWords.has(word)) return word.toUpperCase();
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(" ");
}

export function normalizeCustomServiceName(value: string) {
  return toTitleCase(value).slice(0, 40);
}

export function normalizeShopName(value: string) {
  return toTitleCase(value).slice(0, 80);
}

export function formatMileage(mileage: number) {
  return new Intl.NumberFormat("en-MY").format(mileage);
}

export function formatCurrency(cost: number) {
  return new Intl.NumberFormat("en-MY", {
    style: "currency",
    currency: "MYR",
    maximumFractionDigits: 0
  }).format(cost);
}

export function formatDate(date: string) {
  if (!date || date === "No date") return "No date";

  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric"
  }).format(new Date(`${date}T00:00:00`));
}

export function getServiceLabel(serviceType: ServiceType, customServiceName?: string) {
  if (serviceType === "other" && customServiceName?.trim()) {
    return customServiceName.trim();
  }

  return serviceType;
}

export function getVehicleName(vehicles: Vehicle[], vehicleId: string) {
  return vehicles.find((vehicle) => vehicle.id === vehicleId)?.name ?? "Vehicle";
}

export function getTotalCost(records: ServiceRecord[]) {
  return records.reduce((sum, record) => sum + record.cost, 0);
}

export function getMonthlyCost(records: ServiceRecord[]) {
  const totals = records.reduce<Record<string, number>>((months, record) => {
    const month = new Intl.DateTimeFormat("en-MY", {
      month: "short",
      year: "numeric"
    }).format(new Date(record.date));
    months[month] = (months[month] ?? 0) + record.cost;
    return months;
  }, {});

  return Object.entries(totals).map(([month, total]) => ({ month, total }));
}

export function getNextReminder(reminders: Reminder[]) {
  return reminders.find((reminder) => reminder.status !== "completed") ?? reminders[0];
}

export function getReminderTone(status: Reminder["status"]) {
  if (status === "overdue") return "border-red-200 bg-red-50 text-red-700 dark:border-red-400/25 dark:bg-red-500/15 dark:text-red-100";
  if (status === "completed") return "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-400/25 dark:bg-emerald-500/15 dark:text-emerald-100";
  return "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-400/25 dark:bg-amber-500/15 dark:text-amber-100";
}
