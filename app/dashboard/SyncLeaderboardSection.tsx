"use client";

import { useEffect, useState, useTransition } from "react";
import { syncLeaderboardAction } from "./actions";

function formatSyncedAt(date: Date | null) {
  if (!date) return "Clasamentul nu a fost încă sincronizat.";
  return `Ultima actualizare a clasamentului: ${date.toLocaleString("ro-RO", {
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Europe/Bucharest",
  })}`;
}

export function SyncLeaderboardSection({
  lastSyncedAt,
}: {
  lastSyncedAt: Date | null;
}) {
  const [syncedAt, setSyncedAt] = useState(lastSyncedAt);
  const [error, setError] = useState<string | null>(null);
  const [justSynced, setJustSynced] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleSync = () => {
    setError(null);
    setJustSynced(false);
    startTransition(async () => {
      const result = await syncLeaderboardAction();
      if (result.error) {
        setError(result.error);
        return;
      }
      setSyncedAt(new Date());
      setJustSynced(true);
    });
  };

  useEffect(() => {
    if (!justSynced) return;
    const timer = setTimeout(() => setJustSynced(false), 2500);
    return () => clearTimeout(timer);
  }, [justSynced]);

  return (
    <div className="flex flex-col gap-4 rounded-[16px] border border-dashed border-sage-deep/40 bg-warm-cream p-7">
      <div>
        <p className="text-[0.8125rem] font-semibold uppercase tracking-[0.04em] text-sage-deep">
          Doar administratori
        </p>
        <h2 className="mt-2 text-lg font-semibold text-ink-umber">
          Actualizează clasamentul public
        </h2>
        <p className="mt-2 max-w-[65ch] text-sm leading-relaxed text-ink-umber-soft">
          Punctele din pagina de clasament nu se schimbă automat când liderii
          adaugă sau scad puncte. Apasă butonul pentru a copia punctajul
          curent al fiecărei echipe în clasament, atunci când decizi tu.
        </p>
      </div>

      {error && (
        <p className="animate-alert-in rounded-[8px] bg-soft-linen px-4 py-3 text-sm text-signal-red">
          {error}
        </p>
      )}

      <div className="flex flex-wrap items-center gap-4">
        <button
          type="button"
          onClick={handleSync}
          disabled={isPending}
          className="rounded-full bg-sage-deep px-6 py-3 text-sm font-semibold text-warm-cream transition-[background-color,transform] duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] hover:bg-ink-umber focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sage-deep active:scale-[0.98] disabled:cursor-not-allowed disabled:bg-border-sand disabled:text-ink-umber-soft"
        >
          {isPending ? "Se actualizează…" : "Trimite punctele în clasament"}
        </button>
        <p
          key={syncedAt ? syncedAt.getTime() : "never"}
          className="animate-value-pop text-sm text-ink-umber-soft"
        >
          {formatSyncedAt(syncedAt)}
        </p>
        {justSynced && (
          <span className="animate-alert-in rounded-full bg-sage-trust/15 px-3 py-1 text-[0.8125rem] font-semibold text-sage-deep">
            Actualizat
          </span>
        )}
      </div>
    </div>
  );
}
