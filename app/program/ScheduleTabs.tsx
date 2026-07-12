"use client";

import { useEffect, useState } from "react";
import type { ScheduleDay } from "./data";
import { getScheduleSnapshot } from "./schedule-utils";

function StatusPill({ day, now }: { day: ScheduleDay; now: Date | null }) {
  if (!now) {
    return (
      <div className="h-9 w-48 animate-pulse rounded-full bg-border-sand/60" />
    );
  }

  const snapshot = getScheduleSnapshot(day, now);

  if (snapshot.dayStatus === "before") {
    const label =
      snapshot.daysUntil <= 1 ? "Începe mâine" : `Începe peste ${snapshot.daysUntil} zile`;
    return (
      <div className="inline-flex items-center gap-2.5 rounded-full bg-amber-glow/20 px-5 py-2 text-sm font-semibold text-amber-deep">
        <span className="h-2 w-2 rounded-full bg-amber-glow" />
        {label}
      </div>
    );
  }

  if (snapshot.dayStatus === "after") {
    return (
      <div className="inline-flex items-center gap-2.5 rounded-full bg-soft-linen px-5 py-2 text-sm font-semibold text-ink-umber-soft">
        Ziua s-a încheiat
      </div>
    );
  }

  if (snapshot.currentIndex !== null) {
    const current = day.items[snapshot.currentIndex];
    return (
      <div className="inline-flex items-center gap-3 rounded-full bg-sage-trust px-5 py-2 text-sm font-semibold text-warm-cream">
        <span className="relative flex h-2.5 w-2.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-warm-cream/70" />
          <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-warm-cream" />
        </span>
        Acum: {current.activity}
      </div>
    );
  }

  if (snapshot.nextIndex !== null) {
    const next = day.items[snapshot.nextIndex];
    return (
      <div className="inline-flex items-center gap-2.5 rounded-full bg-soft-linen px-5 py-2 text-sm font-semibold text-ink-umber-soft">
        Următorul: {next.activity}
        <span className="text-ink-umber">{next.time.split("–")[0].trim()}</span>
      </div>
    );
  }

  return null;
}

function ScheduleTimeline({ day, now }: { day: ScheduleDay; now: Date | null }) {
  const snapshot = now ? getScheduleSnapshot(day, now) : null;

  return (
    <div>
      <div className="mb-8 flex items-center justify-between gap-4">
        <h3 className="text-xl font-semibold text-ink-umber">{day.date}</h3>
        <StatusPill day={day} now={now} />
      </div>

      <ol className="relative">
        <div className="absolute left-[3px] top-2 bottom-2 w-px bg-border-sand" />
        {day.items.map((item, index) => {
          const status = snapshot?.statuses[index] ?? "upcoming";
          const isCurrent = status === "current";
          const isPast = status === "past";

          return (
            <li key={index} className="relative flex gap-6 pb-9 pl-8 last:pb-0">
              <span className="absolute left-0 top-1.5 flex h-2 w-2 items-center justify-center">
                {isCurrent ? (
                  <>
                    <span className="absolute inline-flex h-4 w-4 -translate-x-1/2 -translate-y-1/2 animate-ping rounded-full bg-sage-trust/50" />
                    <span className="relative h-2 w-2 rounded-full bg-sage-trust" />
                  </>
                ) : (
                  <span
                    className={`h-2 w-2 rounded-full ${
                      isPast ? "bg-border-sand" : "border-2 border-sage-trust bg-warm-cream"
                    }`}
                  />
                )}
              </span>

              <span
                className={`w-[7.5rem] shrink-0 text-sm font-semibold uppercase tracking-[0.03em] ${
                  isPast ? "text-ink-umber-soft/50" : isCurrent ? "text-sage-deep" : "text-sage-deep/80"
                }`}
              >
                {item.time}
              </span>

              <span
                className={`text-base leading-relaxed ${
                  isPast ? "text-ink-umber-soft/60" : "text-ink-umber"
                } ${isCurrent ? "font-semibold" : ""}`}
              >
                {item.activity}
                {item.location ? (
                  <span className="text-ink-umber-soft"> ({item.location})</span>
                ) : null}
                {item.optional ? (
                  <span className="ml-2 rounded-full bg-amber-glow/20 px-2.5 py-0.5 text-xs font-semibold uppercase tracking-[0.04em] text-amber-glow">
                    Opțional
                  </span>
                ) : null}
              </span>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

export function ScheduleTabs({ days }: { days: ScheduleDay[] }) {
  const [activeDay, setActiveDay] = useState(days[0]?.slug);
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());
    const interval = setInterval(() => setNow(new Date()), 30_000);
    return () => clearInterval(interval);
  }, []);

  const day = days.find((d) => d.slug === activeDay) ?? days[0];

  if (!day) return null;

  return (
    <div>
      {days.length > 1 ? (
        <div role="tablist" aria-label="Zile" className="mb-8 flex flex-wrap gap-2.5">
          {days.map((d) => {
            const isActive = d.slug === day.slug;
            return (
              <button
                key={d.slug}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => setActiveDay(d.slug)}
                className={`min-h-[48px] rounded-full px-6 py-2.5 text-sm font-semibold uppercase tracking-[0.04em] transition-colors duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                  isActive
                    ? "bg-forest-night text-warm-cream"
                    : "bg-soft-linen text-ink-umber-soft hover:text-ink-umber"
                }`}
              >
                {d.label}
              </button>
            );
          })}
        </div>
      ) : null}
      <div key={day.slug} className="animate-fade-in">
        <ScheduleTimeline day={day} now={now} />
      </div>
    </div>
  );
}
