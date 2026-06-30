import { HeartHandshake, ShieldCheck, UserRound } from "lucide-react";
import { PageFrame } from "@/components/PageFrame";
import { SignOutButton } from "@/components/SignOutButton";
import { getAppData } from "@/lib/data";
import { isSupabaseConfigured } from "@/lib/supabase";

export default async function SettingsPage() {
  const { profile, isDemo } = await getAppData();

  return (
    <PageFrame>
      <section className="mb-5">
        <h1 className="section-title">Settings</h1>
        <p className="mt-2 text-ink/65 dark:text-white/65">Manage your profile, theme, and account access.</p>
      </section>
      <section className="soft-card mb-5 flex items-center gap-4">
        <span className="grid h-14 w-14 place-items-center rounded-2xl bg-moss text-white">
          <UserRound size={28} />
        </span>
        <div>
          <h2 className="text-xl font-bold">{profile.fullName}</h2>
          <p className="text-sm text-ink/60 dark:text-white/60">{profile.email}</p>
        </div>
      </section>
      <section className="mb-5 grid gap-3 sm:grid-cols-2">
        <article className="soft-card">
          <HeartHandshake className="mb-3 text-clay" size={24} />
          <h2 className="font-bold">Mission</h2>
          <p className="mt-1 text-sm text-ink/65 dark:text-white/65">Make service tracking for families and friends. All made with ♥ -Daniel</p>
        </article>
        <article className="soft-card">
          <ShieldCheck className="mb-3 text-moss dark:text-sage" size={24} />
          <h2 className="font-bold">Promise</h2>
          <p className="mt-1 text-sm text-ink/65 dark:text-white/65">Clear reminders, friendly forms, and less guessing about vehicle care.</p>
        </article>
      </section>
      <form className="soft-card space-y-4">
        <label className="block">
          <span className="mb-2 block font-semibold">Full Name</span>
          <input className="field" defaultValue={profile.fullName} />
        </label>
        <label className="block">
          <span className="mb-2 block font-semibold">Email</span>
          <input className="field" defaultValue={profile.email} type="email" />
        </label>
        <div className="rounded-xl bg-mist p-4 text-sm text-ink/70 dark:bg-white/10 dark:text-white/70">
          Supabase status: <span className="font-bold text-moss">{isSupabaseConfigured && !isDemo ? "Connected" : "Demo mode"}</span>
        </div>
        <button type="button" className="large-button w-full bg-moss text-white">
          Save Profile
        </button>
      </form>
      <section className="mt-5 soft-card">
        <h2 className="text-lg font-bold">Account</h2>
        <p className="mt-1 text-sm text-ink/60 dark:text-white/60">Use this when you are done on a shared phone or computer.</p>
        <div className="mt-4">{!isDemo ? <SignOutButton /> : <p className="text-sm font-semibold text-clay">Login first to enable logout.</p>}</div>
      </section>
    </PageFrame>
  );
}
