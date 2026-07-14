"use client";

import { useState } from "react";
import type { TeamWithPoints, TeamMemberBreakdown, PointLogEntry } from "./data";

type TabSlug = "echipe" | "individual" | "istoric";

function EmptyState({ children }: { children: React.ReactNode }) {
  return (
    <p className="animate-fade-in mt-6 max-w-[65ch] rounded-[14px] bg-soft-linen px-6 py-8 text-center text-sm leading-relaxed text-ink-umber-soft">
      {children}
    </p>
  );
}

export function DashboardPointsTabs({
  teams,
  memberBreakdown,
  logs,
}: {
  teams: TeamWithPoints[];
  memberBreakdown: TeamMemberBreakdown[];
  logs: PointLogEntry[];
}) {
  const [activeTab, setActiveTab] = useState<TabSlug>("echipe");

  const tabs: { slug: TabSlug; label: string; hint?: string }[] = [
    { slug: "echipe", label: "Echipe", hint: teams.length > 0 ? String(teams.length) : undefined },
    {
      slug: "individual",
      label: "Individual",
      hint:
        memberBreakdown.reduce((sum, team) => sum + team.members.length, 0) > 0
          ? String(memberBreakdown.reduce((sum, team) => sum + team.members.length, 0))
          : undefined,
    },
    { slug: "istoric", label: "Istoric", hint: logs.length > 0 ? String(logs.length) : undefined },
  ];

  return (
    <div className="mt-20">
      <div role="tablist" aria-label="Secțiuni punctaj" className="grid grid-cols-3 gap-2">
        {tabs.map((tab) => {
          const isActive = tab.slug === activeTab;
          return (
            <button
              key={tab.slug}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => setActiveTab(tab.slug)}
              className={`flex min-h-[48px] items-center justify-center gap-1.5 rounded-full px-3 text-sm font-semibold transition-colors duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                isActive
                  ? "bg-sage-trust text-warm-cream"
                  : "bg-soft-linen text-ink-umber-soft hover:text-ink-umber"
              }`}
            >
              <span>{tab.label}</span>
              {tab.hint && (
                <span
                  className={`tabular-nums text-xs ${
                    isActive ? "text-warm-cream/80" : "text-ink-umber-soft"
                  }`}
                >
                  {tab.hint}
                </span>
              )}
            </button>
          );
        })}
      </div>

      <div key={activeTab} className="animate-fade-in mt-8">
        {activeTab === "echipe" && (
          <div>
            {teams.length === 0 ? (
              <EmptyState>Nicio echipă creată încă.</EmptyState>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2">
                {teams.map((team, index) => (
                  <div
                    key={team.id}
                    className="animate-fade-in flex items-center justify-between gap-4 rounded-[16px] bg-soft-linen p-7"
                    style={{ animationDelay: `${index * 0.05}s` }}
                  >
                    <div>
                      <h3 className="text-lg font-semibold text-ink-umber">{team.name}</h3>
                      <p className="mt-1 text-sm text-ink-umber-soft">{team.memberCount} membri</p>
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
            )}
          </div>
        )}

        {activeTab === "individual" && (
          <div>
            <p className="max-w-[65ch] text-sm leading-relaxed text-ink-umber-soft">
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
        )}

        {activeTab === "istoric" && (
          <div>
            {logs.length === 0 ? (
              <EmptyState>Nicio modificare înregistrată încă.</EmptyState>
            ) : (
              <div className="divide-y divide-border-sand rounded-[16px] bg-soft-linen px-7">
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
            )}
          </div>
        )}
      </div>
    </div>
  );
}
