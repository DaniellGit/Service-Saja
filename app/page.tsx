import Link from "next/link";
import { ArrowRight, ShieldCheck, Wrench } from "lucide-react";
import { AuthForm } from "@/components/AuthForm";
import { isSupabaseConfigured } from "@/lib/supabase";

export default function LandingPage() {
  return (
    <main className="page-shell grid items-center lg:grid-cols-[1.05fr_0.95fr] lg:gap-12">
      <section className="py-8">
        <div className="secondary-button mb-8 inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-bold">
          <Wrench size={18} />
          Service Saja
        </div>
        <h1 className="font-display text-5xl font-semibold leading-tight text-ink dark:text-linen sm:text-6xl">
          Simple care records for every vehicle.
        </h1>
        <p className="theme-muted mt-5 max-w-xl text-lg leading-8">
          Track motorcycle and car services, reminders, mileage, and costs in one calm place built for real life.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link href="/dashboard" className="large-button bg-moss text-white">
            Try Sample Dashboard <ArrowRight size={20} />
          </Link>
          <Link href="/service/new" className="large-button secondary-button">
            Add Service
          </Link>
        </div>
      </section>
      <section className="soft-card">
        <div className="mb-5 flex items-center gap-3">
          <span className="grid h-12 w-12 place-items-center rounded-lg bg-mist text-moss dark:bg-white/10 dark:text-sage">
            <ShieldCheck size={24} />
          </span>
          <div>
            <h2 className="text-xl font-bold">Login / Signup</h2>
            <p className="theme-muted text-sm">
              {isSupabaseConfigured ? "Supabase is configured." : "Demo mode is active."}
            </p>
          </div>
        </div>
        <AuthForm isConfigured={isSupabaseConfigured} />
      </section>
    </main>
  );
}
