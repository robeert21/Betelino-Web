"use client";

import { useState, useTransition } from "react";
import { updateShopRequestStatusAction } from "./actions";
import type { ShopRequestEntry } from "./data";

const STATUS_LABELS: Record<string, string> = {
  PENDING: "În așteptare",
  APPROVED: "Aprobată",
  REJECTED: "Respinsă",
};

export function ShopRequestsTable({ requests }: { requests: ShopRequestEntry[] }) {
  return (
    <div className="overflow-x-auto rounded-[16px] bg-soft-linen">
      <table className="w-full min-w-[860px] table-fixed border-collapse text-sm">
        <colgroup>
          <col className="w-[20%]" />
          <col className="w-[30%]" />
          <col className="w-[14%]" />
          <col className="w-[14%]" />
          <col className="w-[22%]" />
        </colgroup>
        <thead>
          <tr className="border-b border-border-sand text-left text-ink-umber-soft">
            <th className="px-7 py-5 font-medium">Membru</th>
            <th className="px-7 py-5 font-medium">Obiecte</th>
            <th className="px-7 py-5 font-medium">Data</th>
            <th className="px-7 py-5 font-medium">Status</th>
            <th className="px-7 py-5 font-medium">Acțiuni</th>
          </tr>
        </thead>
        <tbody>
          {requests.map((request) => (
            <ShopRequestRow key={request.id} request={request} />
          ))}
        </tbody>
      </table>
    </div>
  );
}

function ShopRequestRow({ request }: { request: ShopRequestEntry }) {
  const [status, setStatus] = useState(request.status);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function handleUpdate(nextStatus: "APPROVED" | "REJECTED") {
    setError(null);
    startTransition(async () => {
      const result = await updateShopRequestStatusAction(request.id, nextStatus);
      if (result.error) {
        setError(result.error);
      } else {
        setStatus(nextStatus);
      }
    });
  }

  return (
    <tr className="border-b border-border-sand last:border-0">
      <td className="px-7 py-5">
        <p className="font-semibold text-ink-umber break-words">{request.userName}</p>
        <p className="break-all text-xs text-ink-umber-soft">{request.userEmail}</p>
      </td>
      <td className="px-7 py-5 text-ink-umber">
        <ul className="flex flex-col gap-1">
          {request.items.map((line) => (
            <li key={line.id}>
              {line.itemTitle}
              {line.itemFlavor && (
                <span className="text-ink-umber-soft"> — {line.itemFlavor}</span>
              )}{" "}
              <span className="tabular-nums text-ink-umber-soft">× {line.quantity}</span>
            </li>
          ))}
        </ul>
      </td>
      <td className="px-7 py-5 text-ink-umber-soft">
        {request.createdAt.toLocaleString("ro-RO", {
          day: "2-digit",
          month: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
        })}
      </td>
      <td className="px-7 py-5">
        <span
          className={`rounded-full px-3 py-1 text-xs font-semibold ${
            status === "APPROVED"
              ? "text-sage-deep"
              : status === "REJECTED"
                ? "text-signal-red"
                : "text-ink-umber-soft"
          }`}
        >
          {STATUS_LABELS[status] ?? status}
        </span>
        {error && <p className="mt-1 text-xs text-signal-red">{error}</p>}
      </td>
      <td className="px-7 py-5">
        {status === "PENDING" ? (
          <div className="flex gap-2">
            <button
              type="button"
              disabled={isPending}
              onClick={() => handleUpdate("APPROVED")}
              className="rounded-full bg-amber-glow px-4 py-2 text-xs font-semibold text-ink-umber transition-colors duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] hover:bg-amber-deep disabled:opacity-60"
            >
              Aprobă
            </button>
            <button
              type="button"
              disabled={isPending}
              onClick={() => handleUpdate("REJECTED")}
              className="rounded-full bg-border-sand px-4 py-2 text-xs font-semibold text-ink-umber transition-colors duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] hover:bg-warm-cream disabled:opacity-60"
            >
              Respinge
            </button>
          </div>
        ) : (
          <span className="text-xs text-ink-umber-soft">—</span>
        )}
      </td>
    </tr>
  );
}
