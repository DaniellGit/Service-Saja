import Link from "next/link";
import { History, PlusCircle, ReceiptText, WalletCards } from "lucide-react";
import { PageFrame } from "@/components/PageFrame";
import { ServiceAlertCard } from "@/components/ServiceAlertCard";
import { StatCard } from "@/components/StatCard";
import { VehicleCard } from "@/components/VehicleCard";
import { getAppData } from "@/lib/data";
import { formatCurrency, getTotalCost } from "@/lib/utils";

export default async function DashboardPage() {
  const { vehicles, records, reminders, isDemo } = await getAppData();

  return (
    <PageFrame>
      <section className="mb-6">
        <p className="text-sm font-bold uppercase tracking-wider text-moss">Dashboard</p>
        <h1 className="section-title mt-1">Your vehicle care, made simple.</h1>
        {isDemo && <p className="mt-2 text-sm font-semibold text-clay">Demo data shown. Login to see your real records.</p>}
      </section>
      <div className="mb-5">
        <ServiceAlertCard reminders={reminders} vehicles={vehicles} />
      </div>
      <div className="grid gap-4 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-xl font-bold">My Vehicles</h2>
            <Link href="/vehicles/new" className="large-button bg-moss text-white">
              <PlusCircle size={20} /> Add
            </Link>
          </div>
          <div className="grid gap-3">
            {vehicles.map((vehicle) => (
              <VehicleCard key={vehicle.id} vehicle={vehicle} />
            ))}
            {vehicles.length === 0 && (
              <div className="soft-card theme-muted text-center">No vehicles yet. Add your first one to begin.</div>
            )}
          </div>
        </div>
        <div className="grid gap-4 lg:col-span-2">
          <Link href="/service/new" className="large-button min-h-16 bg-clay text-white">
            <PlusCircle size={22} /> Add Service
          </Link>
          <Link href="/history" className="large-button secondary-button min-h-16">
            <History size={22} /> History
          </Link>
          <StatCard title="Total Cost" value={formatCurrency(getTotalCost(records))} helper="All service records" icon={WalletCards} />
          <Link href="/costs" className="large-button secondary-button">
            <ReceiptText size={20} /> Cost Summary
          </Link>
        </div>
      </div>
    </PageFrame>
  );
}
