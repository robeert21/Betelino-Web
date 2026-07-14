import { redirect } from "next/navigation";
import { getCurrentUser, isAdminRole, isLeaderRole } from "@/lib/auth";
import { getAllMembers, getTeamsWithPoints } from "../data";
import { MembersTable } from "../MembersTable";

export const metadata = {
  title: "Membri — Dashboard lideri — Betelino",
};

export default async function DashboardMembersPage() {
  const user = await getCurrentUser();
  if (!user || !isLeaderRole(user.role)) {
    redirect("/dashboard");
  }

  const [members, teams] = await Promise.all([
    getAllMembers(),
    getTeamsWithPoints(),
  ]);

  return (
    <div>
      <h1 className="animate-fade-in font-display text-[clamp(1.5rem,3vw,2.25rem)] font-medium leading-[1.15] text-ink-umber">
        Membri
      </h1>
      <p className="animate-fade-in stagger-1 mt-5 max-w-[65ch] leading-relaxed text-ink-umber-soft">
        Alege echipa și rolul fiecărui cont din listă. Salvarea se face
        automat.
      </p>
      <div className="animate-fade-in stagger-2 mt-10">
        <MembersTable
          members={members}
          teams={teams}
          currentUserId={user.id}
          isAdmin={isAdminRole(user.role)}
        />
      </div>
    </div>
  );
}
