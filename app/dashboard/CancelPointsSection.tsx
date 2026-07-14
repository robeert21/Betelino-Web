"use client";

import { useState, useTransition } from "react";
import { cancelPointLogAction, editPointLogAction } from "./actions";
import type { PointLogEntry } from "./data";

function useCancelControls(log: PointLogEntry, onCanceled: (logId: string) => void) {
  const [confirming, setConfirming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleCancel() {
    if (!confirming) {
      setConfirming(true);
      return;
    }
    setError(null);
    startTransition(async () => {
      const result = await cancelPointLogAction(log.id);
      if (result.error) {
        setError(result.error);
        setConfirming(false);
      } else {
        onCanceled(log.id);
      }
    });
  }

  return { confirming, setConfirming, error, isPending, handleCancel };
}

function useEditControls(
  log: PointLogEntry,
  onEdited: (logId: string, amount: number, reason: string | null) => void,
) {
  const [editing, setEditing] = useState(false);
  const [amount, setAmount] = useState(String(log.amount));
  const [reason, setReason] = useState(log.reason ?? "");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function startEditing() {
    setAmount(String(log.amount));
    setReason(log.reason ?? "");
    setError(null);
    setEditing(true);
  }

  function cancelEditing() {
    setEditing(false);
    setError(null);
  }

  function handleSave() {
    const parsedAmount = Number(amount);
    if (!Number.isInteger(parsedAmount)) {
      setError("Numărul de puncte trebuie să fie întreg.");
      return;
    }
    setError(null);
    startTransition(async () => {
      const result = await editPointLogAction(log.id, parsedAmount, reason);
      if (result.error) {
        setError(result.error);
      } else {
        onEdited(log.id, parsedAmount, reason.trim() ? reason.trim() : null);
        setEditing(false);
      }
    });
  }

  return {
    editing,
    amount,
    setAmount,
    reason,
    setReason,
    error,
    isPending,
    startEditing,
    cancelEditing,
    handleSave,
  };
}

function CancelLogRow({
  log,
  onCanceled,
  onEdited,
}: {
  log: PointLogEntry;
  onCanceled: (logId: string) => void;
  onEdited: (logId: string, amount: number, reason: string | null) => void;
}) {
  const c = useCancelControls(log, onCanceled);
  const e = useEditControls(log, onEdited);
  const isCanceled = !!log.canceledAt;

  if (e.editing) {
    return (
      <div className="animate-fade-in flex flex-col gap-4 py-5">
        <div>
          <p className="text-sm font-semibold text-ink-umber">
            {log.memberName ? `${log.memberName} (${log.teamName})` : log.teamName}
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

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <input
            type="number"
            value={e.amount}
            onChange={(event) => e.setAmount(event.target.value)}
            disabled={e.isPending}
            className="w-full rounded-[8px] border border-border-sand bg-warm-cream px-3.5 py-2.5 text-sm tabular-nums text-ink-umber transition-colors duration-200 ease-out focus:border-sage-trust focus:outline-none disabled:cursor-not-allowed disabled:opacity-60 sm:w-28"
          />
          <input
            type="text"
            value={e.reason}
            onChange={(event) => e.setReason(event.target.value)}
            disabled={e.isPending}
            placeholder="Motiv (opțional)"
            maxLength={280}
            className="w-full rounded-[8px] border border-border-sand bg-warm-cream px-3.5 py-2.5 text-sm text-ink-umber placeholder:text-ink-umber-soft/70 transition-colors duration-200 ease-out focus:border-sage-trust focus:outline-none disabled:cursor-not-allowed disabled:opacity-60"
          />
          <div className="flex shrink-0 items-center gap-3">
            <button
              type="button"
              onClick={e.cancelEditing}
              disabled={e.isPending}
              className="text-xs font-medium text-ink-umber-soft transition-colors duration-200 ease-out hover:text-ink-umber disabled:opacity-60"
            >
              Renunță
            </button>
            <button
              type="button"
              onClick={e.handleSave}
              disabled={e.isPending}
              className="rounded-full bg-sage-trust px-4 py-2 text-xs font-medium text-warm-cream transition-colors duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] hover:bg-sage-deep focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sage-deep disabled:cursor-not-allowed disabled:opacity-60"
            >
              {e.isPending ? "Se salvează…" : "Salvează"}
            </button>
          </div>
        </div>

        {e.error && <p className="text-xs text-signal-red">{e.error}</p>}
      </div>
    );
  }

  return (
    <div className="animate-fade-in flex flex-col gap-4 py-5 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
      <div className={isCanceled ? "opacity-50" : ""}>
        <p className={`text-sm font-semibold text-ink-umber ${isCanceled ? "line-through decoration-2" : ""}`}>
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
        {isCanceled && (
          <p className="mt-0.5 text-xs font-medium text-signal-red">
            Anulat de {log.canceledByName ?? "un administrator"}
          </p>
        )}
      </div>

      <div className="flex shrink-0 items-center gap-4 sm:justify-end">
        <p
          className={`tabular-nums text-lg font-semibold ${
            isCanceled ? "line-through decoration-2 text-ink-umber-soft" : log.amount < 0 ? "text-signal-red" : "text-sage-deep"
          }`}
        >
          {log.amount > 0 ? `+${log.amount}` : log.amount}
        </p>

        {!isCanceled && (
          <div className="flex items-center gap-2.5">
            {c.confirming && (
              <button
                type="button"
                onClick={() => c.setConfirming(false)}
                disabled={c.isPending}
                className="text-xs font-medium text-ink-umber-soft transition-colors duration-200 ease-out hover:text-ink-umber disabled:opacity-60"
              >
                Renunță
              </button>
            )}
            {!c.confirming && (
              <button
                type="button"
                onClick={e.startEditing}
                disabled={c.isPending}
                className="rounded-full border border-border-sand px-4 py-2 text-xs font-medium text-ink-umber-soft transition-colors duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] hover:border-sage-trust/50 hover:text-ink-umber focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sage-deep disabled:cursor-not-allowed disabled:opacity-60"
              >
                Modifică
              </button>
            )}
            <button
              type="button"
              onClick={c.handleCancel}
              disabled={c.isPending}
              className={`rounded-full px-4 py-2 text-xs font-medium transition-colors duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sage-deep disabled:cursor-not-allowed disabled:opacity-60 ${
                c.confirming
                  ? "bg-signal-red text-warm-cream hover:bg-signal-red/90"
                  : "border border-signal-red/30 text-signal-red hover:bg-signal-red/10"
              }`}
            >
              {c.isPending ? "Se anulează…" : c.confirming ? "Sigur, anulează" : "Anulează"}
            </button>
          </div>
        )}
      </div>

      {c.error && <p className="text-right text-xs text-signal-red sm:col-span-2">{c.error}</p>}
    </div>
  );
}

export function CancelPointsSection({
  logs,
  onCanceled,
  onEdited,
}: {
  logs: PointLogEntry[];
  onCanceled: (logId: string) => void;
  onEdited: (logId: string, amount: number, reason: string | null) => void;
}) {
  return (
    <div>
      <p className="max-w-[65ch] text-sm leading-relaxed text-ink-umber-soft">
        Secțiune vizibilă doar administratorilor. Modificarea sau anularea unei
        înregistrări ajustează automat punctele din totalul echipei (și al
        copilului, dacă e cazul). Anularea păstrează înregistrarea în istoric,
        marcată ca anulată.
      </p>
      {logs.length === 0 ? (
        <p className="animate-fade-in mt-6 max-w-[65ch] rounded-[14px] bg-soft-linen px-6 py-8 text-center text-sm leading-relaxed text-ink-umber-soft">
          Nicio modificare înregistrată încă.
        </p>
      ) : (
        <div className="mt-6 divide-y divide-border-sand rounded-[16px] bg-soft-linen px-7">
          {logs.map((log) => (
            <CancelLogRow key={log.id} log={log} onCanceled={onCanceled} onEdited={onEdited} />
          ))}
        </div>
      )}
    </div>
  );
}
