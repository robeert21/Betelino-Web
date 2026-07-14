import {
  getTeamsWithPoints,
  getRecentPointLogs,
  getLeaderboardLastSyncedAt,
  getCamperMembers,
  getTeamMemberBreakdown,
} from "./data";
import { AddPointsForm } from "./AddPointsForm";
import { SyncLeaderboardSection } from "./SyncLeaderboardSection";
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

      <div className="mt-20">
        <h2 className="animate-fade-in font-display text-lg font-medium text-ink-umber">
          Punctaj pe echipe
        </h2>
        <div className="mt-6 grid gap-6 sm:grid-cols-2">
          {teams.map((team, index) => (
            <div
              key={team.id}
              className="animate-fade-in flex items-center justify-between gap-4 rounded-[16px] bg-soft-linen p-7"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <div>
                <h3 className="text-lg font-semibold text-ink-umber">
                  {team.name}
                </h3>
                <p className="mt-1 text-sm text-ink-umber-soft">
                  {team.memberCount} membri
                </p>
              </div>
              <p
                key={team.totalPoints}
                className="animate-value-pop tabular-nums text-2xl font-semibold text-ink-umber"
              >
                {team.totalPoints}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-20">
        <h2 className="animate-fade-in font-display text-lg font-medium text-ink-umber">
          Puncte individuale
        </h2>
        <p className="animate-fade-in mt-2 max-w-[65ch] text-sm leading-relaxed text-ink-umber-soft">
          Cât a contribuit fiecare copil la punctajul echipei lui.
        </p>
        <div className="mt-6 grid gap-6 sm:grid-cols-2">
          {memberBreakdown.map((team, index) => (
            <div
              key={team.id}
              className="animate-fade-in rounded-[16px] bg-soft-linen p-7"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <div className="flex items-baseline justify-between gap-4">
                <h3 className="text-lg font-semibold text-ink-umber">{team.name}</h3>
                <span className="text-xs text-ink-umber-soft">{team.members.length} copii</span>
              </div>
              {team.members.length === 0 ? (
                <p className="mt-3 text-sm text-ink-umber-soft">Niciun copil în echipă încă.</p>
              ) : (
                <ul className="mt-4 max-h-[360px] divide-y divide-border-sand overflow-y-auto pr-1">
                  {team.members.map((member, memberIndex) => (
                    <li key={member.id} className="flex items-center justify-between gap-4 py-1.5">
                      <span className="flex min-w-0 items-center gap-2.5">
                        <span className="w-4 shrink-0 text-right text-xs tabular-nums text-ink-umber-soft/70">
                          {memberIndex + 1}
                        </span>
                        <span className="truncate text-sm text-ink-umber">{member.name}</span>
                      </span>
                      <span className="shrink-0 tabular-nums text-sm font-semibold text-ink-umber">
                        {member.points}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="mt-20">
        <h2 className="animate-fade-in font-display text-lg font-medium text-ink-umber">
          Istoric puncte
        </h2>
        <div className="mt-6 divide-y divide-border-sand rounded-[16px] bg-soft-linen px-7">
          {logs.length === 0 && (
            <p className="animate-fade-in py-7 text-sm text-ink-umber-soft">
              Nicio modificare înregistrată încă.
            </p>
          )}
          {logs.map((log, index) => (
            <div
              key={log.id}
              className="animate-fade-in flex items-center justify-between gap-6 py-5"
              style={{ animationDelay: `${Math.min(index, 6) * 0.04}s` }}
            >
              <div>
                <p className="text-sm font-semibold text-ink-umber">
                  {log.memberName ? `${log.memberName} (${log.teamName})` : log.teamName}
                  {log.reason ? ` — ${log.reason}` : ""}
                </p>
                <p className="text-xs text-ink-umber-soft">
                  {log.createdByName} ·{" "}
                  {log.createdAt.toLocaleString("ro-RO", {
                    day: "2-digit",
                    month: "2-digit",
                    hour: "2-digit",
                    minute: "2-digit",
                    timeZone: "Europe/Bucharest",
                  })}
                </p>
              </div>
              <p
                className={`tabular-nums text-lg font-semibold ${
                  log.amount < 0 ? "text-signal-red" : "text-sage-deep"
                }`}
              >
                {log.amount > 0 ? `+${log.amount}` : log.amount}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
