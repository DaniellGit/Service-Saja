import { PageFrame } from "@/components/PageFrame";
import { VehicleForm } from "@/components/VehicleForm";
import { getAppData } from "@/lib/data";

export default async function AddVehiclePage() {
  const { userId, isDemo } = await getAppData();

  return (
    <PageFrame>
      <section className="mb-5">
        <h1 className="section-title">Add Vehicle</h1>
        <p className="theme-muted mt-2">Keep the details simple so service records stay easy to find.</p>
        {isDemo && <p className="mt-2 text-sm font-semibold text-clay">Login first to save real vehicles.</p>}
      </section>
      <VehicleForm userId={userId} />
    </PageFrame>
  );
}
