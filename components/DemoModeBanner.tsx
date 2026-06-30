import Link from "next/link";
import { ArrowRight, Eye } from "lucide-react";

export function DemoModeBanner() {
  return (
    <section className="mb-5 rounded-2xl border border-clay/20 bg-clay/10 p-4 dark:border-clay/30 dark:bg-clay/15">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex gap-3">
          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-clay text-white">
            <Eye size={22} />
          </span>
          <div>
            <p className="text-sm font-bold uppercase tracking-wider text-clay">Sample Dashboard</p>
            <h2 className="font-bold">You are viewing example data only.</h2>
            <p className="theme-muted mt-1 text-sm">
              Explore how Service Saja works. Login or sign up when you want to save your own vehicles and services.
            </p>
          </div>
        </div>
        <Link href="/" className="large-button shrink-0 bg-moss text-white">
          Login / Sign up <ArrowRight size={18} />
        </Link>
      </div>
    </section>
  );
}
