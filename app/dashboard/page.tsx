import { getTeamsWithPoints, getRecentPointLogs } from "./data";
import { AddPointsForm } from "./AddPointsForm";

export const metadata = {
  title: "Puncte — Dashboard lideri — Betelino",
};

export default async function DashboardPointsPage() {
  const [teams, logs] = await Promise.all([
    getTeamsWithPoints(),
    getRecentPointLogs(),
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

      <div className="mt-14">
        <AddPointsForm teams={teams} />
      </div>

      <div className="mt-20">
        <h2 className="animate-fade-in font-display text-lg font-medium text-ink-umber">
          Punctaj pe echipe
        </h2>
        <div className="animate-fade-in mt-6 grid gap-6 sm:grid-cols-2">
          {teams.map((team) => (
            <div
              key={team.id}
              className="flex items-center justify-between gap-4 rounded-[16px] bg-soft-linen p-7"
            >
              <div>
                <h3 className="text-lg font-semibold text-ink-umber">
                  {team.name}
                </h3>
                <p className="mt-1 text-sm text-ink-umber-soft">
                  {team.memberCount} membri
                </p>
              </div>
              <p className="tabular-nums text-2xl font-semibold text-ink-umber">
                {team.totalPoints}
              </p>
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
            <p className="py-7 text-sm text-ink-umber-soft">
              Nicio modificare înregistrată încă.
            </p>
          )}
          {logs.map((log) => (
            <div
              key={log.id}
              className="flex items-center justify-between gap-6 py-5"
            >
              <div>
                <p className="text-sm font-semibold text-ink-umber">
                  {log.teamName}
                  {log.reason ? ` — ${log.reason}` : ""}
                </p>
                <p className="text-xs text-ink-umber-soft">
                  {log.createdByName} ·{" "}
                  {log.createdAt.toLocaleString("ro-RO", {
                    day: "2-digit",
                    month: "2-digit",
                    hour: "2-digit",
                    minute: "2-digit",
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
