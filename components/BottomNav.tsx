"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Car, Clock3, Home, PlusCircle, ReceiptText } from "lucide-react";

const items = [
  { href: "/dashboard", label: "Home", icon: Home },
  { href: "/vehicles/new", label: "Vehicle", icon: Car },
  { href: "/service/new", label: "Service", icon: PlusCircle },
  { href: "/history", label: "History", icon: ReceiptText },
  { href: "/reminders", label: "Remind", icon: Clock3 }
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-20 border-t border-mist bg-porcelain/95 px-2 pb-3 pt-2 shadow-soft backdrop-blur dark:border-white/10 dark:bg-[#17201d]/95 md:hidden">
      <div className="mx-auto grid max-w-md grid-cols-5 gap-1">
        {items.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex min-h-14 flex-col items-center justify-center rounded-lg text-xs font-semibold ${
                active ? "bg-moss text-white" : "text-ink/65 dark:text-white/65"
              }`}
            >
              <Icon size={20} />
              {item.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
