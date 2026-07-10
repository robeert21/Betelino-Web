import { redirect } from "next/navigation";
import { getCurrentUser, isAdminRole, isCalauzaRole } from "@/lib/auth";
import { getTeamRoster, getTeamsWithPoints } from "../data";
import { TeamPicker } from "./TeamPicker";

export const metadata = {
  title: "Membrii echipei — Dashboard lideri — Betelino",
};

export default async function TeamMembersPage({
  searchParams,
}: {
  searchParams: Promise<{ team?: string }>;
}) {
  const user = await getCurrentUser();
  const isAdmin = !!user && isAdminRole(user.role);
  const isCalauza = !!user && isCalauzaRole(user.role);
  if (!user || !(isAdmin || isCalauza)) {
    redirect("/dashboard");
  }

  const teams = await getTeamsWithPoints();

  if (isCalauza && !user.teamId) {
    return (
      <div>
        <h1 className="animate-fade-in font-display text-[clamp(1.5rem,3vw,2.25rem)] font-medium leading-[1.15] text-ink-umber">
          Membrii echipei
        </h1>
        <p className="animate-fade-in stagger-1 mt-5 max-w-[65ch] leading-relaxed text-ink-umber-soft">
          Nu ești asignat(ă) încă unei echipe. Cere unui administrator să te
          atribuie unei echipe.
        </p>
      </div>
    );
  }

  if (isAdmin && teams.length === 0) {
    return (
      <div>
        <h1 className="animate-fade-in font-display text-[clamp(1.5rem,3vw,2.25rem)] font-medium leading-[1.15] text-ink-umber">
          Membrii echipei
        </h1>
        <p className="animate-fade-in stagger-1 mt-5 max-w-[65ch] leading-relaxed text-ink-umber-soft">
          Nu există încă nicio echipă.
        </p>
      </div>
    );
  }

  const { team: teamParam } = await searchParams;
  const selectedTeamId = isCalauza
    ? user.teamId!
    : (teamParam && teams.some((t) => t.id === teamParam) ? teamParam : teams[0].id);

  const roster = await getTeamRoster(selectedTeamId);
  const team = teams.find((t) => t.id === selectedTeamId);

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="animate-fade-in font-display text-[clamp(1.5rem,3vw,2.25rem)] font-medium leading-[1.15] text-ink-umber">
          Membrii echipei {team ? team.name : ""}
        </h1>
        {isAdmin && <TeamPicker teams={teams} selectedTeamId={selectedTeamId} />}
      </div>
      <p className="animate-fade-in stagger-1 mt-5 max-w-[65ch] leading-relaxed text-ink-umber-soft">
        {isAdmin
          ? "Toți copiii din echipa selectată, ordonați după punctajul individual."
          : "Toți copiii din echipa ta, ordonați după punctajul individual."}
      </p>

      <div className="mt-10 rounded-[16px] bg-soft-linen p-7">
        {roster.length === 0 ? (
          <p className="text-sm text-ink-umber-soft">Niciun copil în echipă încă.</p>
        ) : (
          <ul className="divide-y divide-border-sand">
            {roster.map((member, index) => (
              <li key={member.id} className="flex items-center justify-between gap-4 py-2.5">
                <span className="flex min-w-0 items-center gap-2.5">
                  <span className="w-5 shrink-0 text-right text-xs tabular-nums text-ink-umber-soft/70">
                    {index + 1}
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
    </div>
  );
}
