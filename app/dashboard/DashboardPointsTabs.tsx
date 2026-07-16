"use client";

import { useState, useTransition } from "react";
import type { TeamWithPoints, TeamMemberBreakdown, PointLogEntry } from "./data";
import { CancelPointsSection } from "./CancelPointsSection";
import { getMorePointLogsAction } from "./actions";

type TabSlug = "echipe" | "individual" | "istoric" | "anuleaza";

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
  logsTotal,
  isAdmin,
  currentUserName,
}: {
  teams: TeamWithPoints[];
  memberBreakdown: TeamMemberBreakdown[];
  logs: PointLogEntry[];
  logsTotal: number;
  isAdmin: boolean;
  currentUserName: string;
}) {
  const [activeTab, setActiveTab] = useState<TabSlug>("echipe");
  const [liveLogs, setLiveLogs] = useState(logs);
  const [isLoadingMore, startLoadingMore] = useTransition();
  const [loadMoreError, setLoadMoreError] = useState<string | null>(null);

  const activeLogCount = liveLogs.filter((log) => !log.canceledAt).length;
  const hasMoreLogs = liveLogs.length < logsTotal;

  function handleLoadMore() {
    setLoadMoreError(null);
    startLoadingMore(async () => {
      const result = await getMorePointLogsAction(liveLogs.length);
      if (result.error) {
        setLoadMoreError(result.error);
        return;
      }
      setLiveLogs((current) => [...current, ...result.logs]);
    });
  }

  function handleCanceled(logId: string) {
    setLiveLogs((current) =>
      current.map((log) =>
        log.id === logId ? { ...log, canceledAt: new Date(), canceledByName: currentUserName } : log,
      ),
    );
  }

  function handleEdited(logId: string, amount: number, reason: string | null) {
    setLiveLogs((current) =>
      current.map((log) => (log.id === logId ? { ...log, amount, reason } : log)),
    );
  }

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
    { slug: "istoric", label: "Istoric", hint: logsTotal > 0 ? String(logsTotal) : undefined },
    ...(isAdmin
      ? [
          {
            slug: "anuleaza" as TabSlug,
            label: "Anulează puncte",
            hint: activeLogCount > 0 ? String(activeLogCount) : undefined,
          },
        ]
      : []),
  ];

  return (
    <div className="mt-20">
      <div
        role="tablist"
        aria-label="Secțiuni punctaj"
        className={`grid gap-2 ${isAdmin ? "grid-cols-2 sm:grid-cols-4" : "grid-cols-3"}`}
      >
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
            {liveLogs.length === 0 ? (
              <EmptyState>Nicio modificare înregistrată încă.</EmptyState>
            ) : (
              <div className="divide-y divide-border-sand rounded-[16px] bg-soft-linen px-7">
                {liveLogs.map((log, index) => (
                  <div
                    key={log.id}
                    className={`animate-fade-in flex items-center justify-between gap-6 py-5 ${
                      log.canceledAt ? "opacity-50" : ""
                    }`}
                    style={{ animationDelay: `${Math.min(index, 6) * 0.04}s` }}
                  >
                    <div>
                      <p
                        className={`text-sm font-semibold text-ink-umber ${
                          log.canceledAt ? "line-through decoration-2" : ""
                        }`}
                      >
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
                        {log.canceledAt && (
                          <span className="text-signal-red">
                            {" "}
                            · Anulat de {log.canceledByName ?? "un administrator"}
                          </span>
                        )}
                      </p>
                    </div>
                    <p
                      className={`tabular-nums text-lg font-semibold ${
                        log.canceledAt ? "line-through decoration-2 text-ink-umber-soft" : log.amount < 0 ? "text-signal-red" : "text-sage-deep"
                      }`}
                    >
                      {log.amount > 0 ? `+${log.amount}` : log.amount}
                    </p>
                  </div>
                ))}
              </div>
            )}
            {hasMoreLogs && (
              <LoadMoreLogsButton
                isLoading={isLoadingMore}
                error={loadMoreError}
                onClick={handleLoadMore}
                remaining={logsTotal - liveLogs.length}
              />
            )}
          </div>
        )}

        {activeTab === "anuleaza" && isAdmin && (
          <div>
            <CancelPointsSection logs={liveLogs} onCanceled={handleCanceled} onEdited={handleEdited} />
            {hasMoreLogs && (
              <LoadMoreLogsButton
                isLoading={isLoadingMore}
                error={loadMoreError}
                onClick={handleLoadMore}
                remaining={logsTotal - liveLogs.length}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function LoadMoreLogsButton({
  isLoading,
  error,
  onClick,
  remaining,
}: {
  isLoading: boolean;
  error: string | null;
  onClick: () => void;
  remaining: number;
}) {
  return (
    <div className="mt-6 flex flex-col items-center gap-2">
      <button
        type="button"
        onClick={onClick}
        disabled={isLoading}
        className="rounded-full border border-border-sand px-5 py-2.5 text-sm font-medium text-ink-umber-soft transition-colors duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] hover:border-sage-trust/50 hover:text-ink-umber disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isLoading ? "Se încarcă…" : `Încarcă mai multe (${remaining} rămase)`}
      </button>
      {error && <p className="text-xs text-signal-red">{error}</p>}
    </div>
  );
}
