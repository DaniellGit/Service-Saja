import type { LucideIcon } from "lucide-react";

type StatCardProps = {
  title: string;
  value: string;
  helper: string;
  icon: LucideIcon;
};

export function StatCard({ title, value, helper, icon: Icon }: StatCardProps) {
  return (
    <article className="soft-card">
      <div className="mb-4 flex items-center justify-between gap-4">
        <p className="theme-muted text-sm font-semibold">{title}</p>
        <span className="grid h-10 w-10 place-items-center rounded-lg bg-mist text-moss dark:bg-white/10 dark:text-sage">
          <Icon size={20} />
        </span>
      </div>
      <p className="font-display text-3xl font-semibold">{value}</p>
      <p className="theme-muted mt-1 text-sm">{helper}</p>
    </article>
  );
}
