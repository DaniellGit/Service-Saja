import { PageFrame } from "@/components/PageFrame";
import { ServiceForm } from "@/components/ServiceForm";
import { getAppData } from "@/lib/data";

export default async function AddServicePage() {
  const { userId, vehicles, isDemo } = await getAppData();

  return (
    <PageFrame>
      <section className="mb-5">
        <h1 className="section-title">Add Service Record</h1>
        <p className="theme-muted mt-2">
          Add the odometer reading during service. Service Saja uses it to align mileage and prepare the next reminder.
        </p>
        {isDemo && <p className="mt-2 text-sm font-semibold text-clay">Login first to save real service records.</p>}
      </section>
      <ServiceForm userId={userId} vehicles={vehicles} />
    </PageFrame>
  );
}
