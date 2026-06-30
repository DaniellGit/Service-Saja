import Link from "next/link";
import { Wrench } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";

export function AppHeader() {
  return (
    <header className="mb-6 flex items-center justify-between">
      <Link href="/dashboard" className="flex items-center gap-3">
        <span className="grid h-11 w-11 place-items-center rounded-lg bg-moss text-white shadow-soft">
          <Wrench size={22} />
        </span>
        <span>
          <span className="block font-display text-2xl font-bold leading-none text-ink dark:text-linen">Service Saja</span>
          <span className="text-sm text-ink/60 dark:text-white/60">Life easier, service clearer</span>
        </span>
      </Link>
      <div className="flex items-center gap-2">
        <ThemeToggle />
        <Link href="/settings" className="secondary-button rounded-lg px-3 py-2 text-sm font-semibold">
          Profile
        </Link>
      </div>
    </header>
  );
}
