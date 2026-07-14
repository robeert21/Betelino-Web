"use client";

import { useState, useTransition } from "react";
import { toggleFinePaidAction } from "../actions";
import type { FineEntry } from "../data";
import { formatPrice } from "@/app/magazin/format";

export function FinesTable({ fines }: { fines: FineEntry[] }) {
  const [liveFines, setLiveFines] = useState(fines);

  function handleToggled(fineId: string, paid: boolean) {
    setLiveFines((current) =>
      current.map((fine) =>
        fine.id === fineId ? { ...fine, paidAt: paid ? new Date() : null } : fine,
      ),
    );
  }

  if (liveFines.length === 0) {
    return (
      <p className="animate-fade-in rounded-[16px] bg-soft-linen px-7 py-7 text-sm text-ink-umber-soft">
        Nicio amendă înregistrată încă.
      </p>
    );
  }

  return (
    <ul className="flex flex-col gap-4">
      {liveFines.map((fine, index) => (
        <FineCard
          key={fine.id}
          fine={fine}
          index={index}
          onToggled={(paid) => handleToggled(fine.id, paid)}
        />
      ))}
    </ul>
  );
}

function FineCard({
  fine,
  index,
  onToggled,
}: {
  fine: FineEntry;
  index: number;
  onToggled: (paid: boolean) => void;
}) {
  const paid = !!fine.paidAt;
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function handleToggle() {
    setError(null);
    startTransition(async () => {
      const result = await toggleFinePaidAction(fine.id, !paid);
      if (result.error) {
        setError(result.error);
      } else {
        onToggled(!paid);
      }
    });
  }

  return (
    <li
      className="animate-fade-in rounded-[16px] bg-soft-linen p-6"
      style={{ animationDelay: `${Math.min(index, 6) * 0.04}s` }}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="font-semibold text-ink-umber break-words">{fine.userName}</p>
          <p className="mt-0.5 break-words text-sm text-ink-umber-soft">{fine.reason}</p>
        </div>
        <span
          className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${
            paid ? "bg-sage-deep/10 text-sage-deep" : "bg-signal-red/10 text-signal-red"
          }`}
        >
          {paid ? "Plătită" : "Neplătită"}
        </span>
      </div>

      <div className="mt-3 flex flex-wrap items-center justify-between gap-x-4 gap-y-1">
        <p className="text-xs text-ink-umber-soft">
          {fine.createdByName} ·{" "}
          {fine.createdAt.toLocaleString("ro-RO", {
            day: "2-digit",
            month: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            timeZone: "Europe/Bucharest",
          })}
        </p>
        <p className="tabular-nums text-sm font-semibold text-ink-umber">
          {formatPrice(fine.amount)}
        </p>
      </div>

      {error && <p className="mt-2 text-xs text-signal-red">{error}</p>}

      <div className="mt-4 border-t border-border-sand pt-4">
        <button
          type="button"
          disabled={isPending}
          onClick={handleToggle}
          className="w-full rounded-full border border-border-sand bg-warm-cream px-4 py-2.5 text-xs font-semibold text-ink-umber-soft transition-[border-color,color,transform] duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] hover:border-ink-umber-soft hover:text-ink-umber active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isPending ? "Se salvează…" : paid ? "Marchează neplătită" : "Marchează plătită"}
        </button>
      </div>
    </li>
  );
}
