import { PageFrame } from "@/components/PageFrame";
import { ServiceHistoryList } from "@/components/ServiceHistoryList";
import { getAppData } from "@/lib/data";

export default async function HistoryPage() {
  const { records, vehicles, isDemo } = await getAppData();

  return (
    <PageFrame>
      <section className="mb-5">
        <h1 className="section-title">Service History</h1>
        <p className="theme-muted mt-2">Filter by vehicle or service type when the list grows.</p>
        {isDemo && <p className="mt-2 text-sm font-semibold text-clay">Demo history shown. Login to see your real records.</p>}
      </section>
      <ServiceHistoryList records={records} vehicles={vehicles} isDemo={isDemo} />
    </PageFrame>
  );
}
