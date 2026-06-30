import Link from "next/link";
import Image from "next/image";
import { ThemeToggle } from "@/components/ThemeToggle";

export function AppHeader() {
  return (
    <header className="mb-6 flex flex-wrap items-center justify-between gap-3">
      <Link href="/dashboard" className="flex min-w-0 items-center gap-3">
        <span className="grid h-10 w-10 shrink-0 place-items-center overflow-hidden rounded-lg bg-white shadow-soft sm:h-11 sm:w-11">
          <Image src="/servicesaja.png" alt="Service Saja logo" width={44} height={44} className="h-full w-full object-cover" priority />
        </span>
        <span className="min-w-0">
          <span className="block truncate font-display text-xl font-bold leading-none text-ink dark:text-linen sm:text-2xl">Service Saja</span>
          <span className="hidden text-sm text-ink/60 dark:text-white/60 sm:block">Make your life easier</span>
        </span>
      </Link>
      <div className="ml-auto flex items-center gap-2">
        <ThemeToggle />
        <Link href="/settings" className="secondary-button rounded-lg px-3 py-2 text-sm font-semibold">
          Profile
        </Link>
      </div>
    </header>
  );
}
