"use client";

import { useState, useTransition } from "react";
import { toggleFinePaidAction } from "../actions";
import type { FineEntry } from "../data";
import { formatPrice } from "@/app/magazin/format";

export function FinesTable({ fines }: { fines: FineEntry[] }) {
  const [liveFines, setLiveFines] = useState(fines);
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleToggle(fineId: string, paid: boolean) {
    setPendingId(fineId);
    startTransition(async () => {
      const result = await toggleFinePaidAction(fineId, paid);
      if (!result.error) {
        setLiveFines((current) =>
          current.map((fine) =>
            fine.id === fineId
              ? { ...fine, paidAt: paid ? new Date() : null }
              : fine,
          ),
        );
      }
      setPendingId(null);
    });
  }

  if (liveFines.length === 0) {
    return (
      <p className="animate-fade-in py-7 text-sm text-ink-umber-soft">
        Nicio amendă înregistrată încă.
      </p>
    );
  }

  return (
    <div className="divide-y divide-border-sand">
      {liveFines.map((fine, index) => {
        const paid = !!fine.paidAt;
        return (
          <div
            key={fine.id}
            className="animate-fade-in flex items-center justify-between gap-6 py-5"
            style={{ animationDelay: `${Math.min(index, 6) * 0.04}s` }}
          >
            <div className="min-w-0">
              <p className="text-sm font-semibold text-ink-umber">
                {fine.userName} — {fine.reason}
              </p>
              <p className="text-xs text-ink-umber-soft">
                {fine.createdByName} ·{" "}
                {fine.createdAt.toLocaleString("ro-RO", {
                  day: "2-digit",
                  month: "2-digit",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
            <div className="flex shrink-0 items-center gap-3">
              <span className="tabular-nums text-sm font-semibold text-ink-umber">
                {formatPrice(fine.amount)}
              </span>
              <span
                className={`rounded-full px-3 py-1 text-xs font-semibold ${
                  paid
                    ? "bg-sage-deep/10 text-sage-deep"
                    : "bg-signal-red/10 text-signal-red"
                }`}
              >
                {paid ? "Plătită" : "Neplătită"}
              </span>
              <button
                type="button"
                disabled={isPending && pendingId === fine.id}
                onClick={() => handleToggle(fine.id, !paid)}
                className="rounded-full border border-border-sand bg-warm-cream px-4 py-2 text-xs font-semibold text-ink-umber-soft transition-[border-color,color,transform] duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] hover:border-ink-umber-soft hover:text-ink-umber active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isPending && pendingId === fine.id
                  ? "Se salvează…"
                  : paid
                    ? "Marchează neplătită"
                    : "Marchează plătită"}
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
