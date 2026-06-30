import { AppHeader } from "@/components/AppHeader";
import { BottomNav } from "@/components/BottomNav";

export function PageFrame({ children }: { children: React.ReactNode }) {
  return (
    <>
      <main className="page-shell">
        <AppHeader />
        {children}
      </main>
      <BottomNav />
    </>
  );
}
