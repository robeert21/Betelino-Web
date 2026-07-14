import {
  getTeamsWithPoints,
  getRecentPointLogs,
  getLeaderboardLastSyncedAt,
  getCamperMembers,
  getTeamMemberBreakdown,
} from "./data";
import { AddPointsForm } from "./AddPointsForm";
import { SyncLeaderboardSection } from "./SyncLeaderboardSection";
import { DashboardPointsTabs } from "./DashboardPointsTabs";
import { getCurrentUser, isAdminRole } from "@/lib/auth";

export const metadata = {
  title: "Puncte — Dashboard lideri — Betelino",
};

export default async function DashboardPointsPage() {
  const currentUser = await getCurrentUser();
  const isAdmin = !!currentUser && isAdminRole(currentUser.role);

  const [teams, members, memberBreakdown, logs, leaderboardLastSyncedAt] = await Promise.all([
    getTeamsWithPoints(),
    getCamperMembers(),
    getTeamMemberBreakdown(),
    getRecentPointLogs(),
    isAdmin ? getLeaderboardLastSyncedAt() : Promise.resolve(null),
  ]);

  return (
    <div>
      <h1 className="animate-fade-in font-display text-[clamp(1.5rem,3vw,2.25rem)] font-medium leading-[1.15] text-ink-umber">
        Echipele taberei
      </h1>
      <p className="animate-fade-in stagger-1 mt-5 max-w-[65ch] leading-relaxed text-ink-umber-soft">
        Adaugă sau scade puncte pentru o echipă. Fiecare modificare este
        înregistrată cu numele tău și motivul.
      </p>

      {isAdmin && (
        <div className="mt-10">
          <SyncLeaderboardSection lastSyncedAt={leaderboardLastSyncedAt} />
        </div>
      )}

      <div className="mt-14">
        <AddPointsForm teams={teams} members={members} />
      </div>

      <DashboardPointsTabs teams={teams} memberBreakdown={memberBreakdown} logs={logs} />
    </div>
  );
}
