import { notFound } from "next/navigation";
import { PageFrame } from "@/components/PageFrame";
import { VehicleForm } from "@/components/VehicleForm";
import { getAppData } from "@/lib/data";

export default async function EditVehiclePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { vehicles, userId, isDemo } = await getAppData();
  const vehicle = vehicles.find((item) => item.id === id);

  if (!vehicle) notFound();

  return (
    <PageFrame>
      <section className="mb-5">
        <h1 className="section-title">Edit Vehicle</h1>
        <p className="theme-muted mt-2">Update the name, plate number, model, type, or current mileage.</p>
        {isDemo && <p className="mt-2 text-sm font-semibold text-clay">Login first to edit real vehicles.</p>}
      </section>
      <VehicleForm userId={userId} vehicle={vehicle} />
    </PageFrame>
  );
}
