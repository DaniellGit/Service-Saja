import { notFound } from "next/navigation";
import { PageFrame } from "@/components/PageFrame";
import { ServiceScheduleForm } from "@/components/ServiceScheduleForm";
import { getAppData } from "@/lib/data";
import { getVehicleIntervals } from "@/lib/service-intervals";

export default async function VehicleSchedulePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { vehicles, intervals, userId, isDemo } = await getAppData();
  const vehicle = vehicles.find((item) => item.id === id);

  if (!vehicle) notFound();

  const vehicleIntervals = getVehicleIntervals(vehicle, intervals);

  return (
    <PageFrame>
      <section className="mb-5">
        <h1 className="section-title">Service Schedule</h1>
        <p className="theme-muted mt-2">
          Customize reminders for {vehicle.name}. These settings decide the next due mileage and date after each service record.
        </p>
        {isDemo && <p className="mt-2 text-sm font-semibold text-clay">Login first to save real schedules.</p>}
      </section>
      <ServiceScheduleForm userId={userId} vehicle={vehicle} intervals={vehicleIntervals} />
    </PageFrame>
  );
}
