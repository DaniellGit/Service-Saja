import { PageFrame } from "@/components/PageFrame";
import { getAppData } from "@/lib/data";
import { formatCurrency, getMonthlyCost, getTotalCost } from "@/lib/utils";

export default async function CostSummaryPage() {
  const { records, isDemo } = await getAppData();
  const monthlyCosts = getMonthlyCost(records);
  const totalCost = getTotalCost(records);

  return (
    <PageFrame>
      <section className="mb-5">
        <h1 className="section-title">Cost Summary</h1>
        <p className="theme-muted mt-2">A clear view of vehicle maintenance spending.</p>
        {isDemo && <p className="mt-2 text-sm font-semibold text-clay">Demo costs shown. Login to see your real spending.</p>}
      </section>
      <section className="soft-card mb-5">
        <p className="text-sm font-bold uppercase tracking-wider text-moss">Total Maintenance Cost</p>
        <p className="mt-2 font-display text-5xl font-semibold">{formatCurrency(totalCost)}</p>
        <p className="theme-muted mt-2">For all recorded services.</p>
      </section>
      <section className="soft-card">
        <h2 className="mb-4 text-xl font-bold">By Month</h2>
        <div className="space-y-4">
          {monthlyCosts.map((item) => (
            <div key={item.month}>
              <div className="mb-2 flex items-center justify-between gap-3">
                <p className="font-semibold">{item.month}</p>
                <p className="font-bold text-moss">{formatCurrency(item.total)}</p>
              </div>
              <div className="h-3 rounded-full bg-mist dark:bg-white/10">
                <div className="h-3 rounded-full bg-moss" style={{ width: `${Math.max(18, totalCost > 0 ? (item.total / totalCost) * 100 : 0)}%` }} />
              </div>
            </div>
          ))}
          {monthlyCosts.length === 0 && <p className="theme-muted">No costs recorded yet.</p>}
        </div>
      </section>
    </PageFrame>
  );
}
