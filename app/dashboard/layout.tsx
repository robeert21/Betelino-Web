import { redirect } from "next/navigation";
import { getCurrentUser, isLeaderRole, isAdminRole, isCalauzaRole } from "@/lib/auth";
import { DashboardNav } from "./DashboardNav";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/cont/login");
  }
  if (!isLeaderRole(user.role)) {
    redirect("/cont");
  }

  return (
    <div className="mx-auto max-w-6xl px-6 py-16 md:px-12 md:py-28">
      <p className="animate-fade-in text-[0.8125rem] font-semibold uppercase tracking-[0.04em] text-sage-deep">
        Dashboard lideri
      </p>

      <div className="mt-10 flex flex-col gap-10 md:flex-row md:items-start md:gap-20">
        <div className="md:w-44 md:shrink-0">
          <DashboardNav isAdmin={isAdminRole(user.role)} isCalauza={isCalauzaRole(user.role)} />
        </div>
        <div className="min-w-0 flex-1">{children}</div>
      </div>
    </div>
  );
}
