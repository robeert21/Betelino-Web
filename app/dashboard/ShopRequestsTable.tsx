"use client";

import { useMemo, useState, useTransition } from "react";
import {
  markShopRequestDeliveredAction,
  markShopRequestsFulfilledAction,
  updateShopRequestStatusAction,
} from "./actions";
import type { ShopRequestEntry } from "./data";
import { SHOP_CATEGORY_LABELS, SHOP_CATEGORY_ORDER, isShopCategory } from "@/lib/shop-categories";
import { formatPrice } from "@/app/magazin/format";

const STATUS_LABELS: Record<string, string> = {
  PENDING: "În așteptare",
  APPROVED: "Aprobată",
  FULFILLED: "Cumpărată",
  DELIVERED: "Predată",
  REJECTED: "Respinsă",
};

const STATUS_FILTERS = ["PENDING", "APPROVED", "FULFILLED", "DELIVERED", "REJECTED"] as const;

const OTHER_CATEGORY_LABEL = "Alte produse";

type ShoppingLine = { itemTitle: string; itemFlavor: string | null; quantity: number };
type ShoppingGroup = { label: string; lines: ShoppingLine[] };
type SpecialRequest = { userName: string; note: string };

export function ShopRequestsTable({ requests }: { requests: ShopRequestEntry[] }) {
  const [statuses, setStatuses] = useState(
    () => new Map(requests.map((request) => [request.id, request.status])),
  );
  const [filter, setFilter] = useState<"ALL" | (typeof STATUS_FILTERS)[number]>(
    requests.some((request) => request.status === "PENDING") ? "PENDING" : "ALL",
  );
  const [showShoppingList, setShowShoppingList] = useState(false);
  const [isClearing, startClearTransition] = useTransition();
  const [clearError, setClearError] = useState<string | null>(null);
  const [query, setQuery] = useState("");

  function handleStatusChange(id: string, status: string) {
    setStatuses((current) => {
      const next = new Map(current);
      next.set(id, status);
      return next;
    });
  }

  const counts = useMemo(() => {
    const result: Record<string, number> = {
      PENDING: 0,
      APPROVED: 0,
      FULFILLED: 0,
      DELIVERED: 0,
      REJECTED: 0,
    };
    for (const status of statuses.values()) {
      result[status] = (result[status] ?? 0) + 1;
    }
    return result;
  }, [statuses]);

  const filtered = useMemo(() => {
    const byStatus =
      filter === "ALL"
        ? requests
        : requests.filter((request) => statuses.get(request.id) === filter);
    const q = query.trim().toLowerCase();
    if (!q) return byStatus;
    return byStatus.filter((request) => request.userName.toLowerCase().includes(q));
  }, [requests, statuses, filter, query]);

  const approvedRequests = useMemo(
    () => requests.filter((request) => statuses.get(request.id) === "APPROVED"),
    [requests, statuses],
  );

  const shoppingList = useMemo(() => {
    const byCategory = new Map<string, Map<string, ShoppingLine>>();
    for (const request of approvedRequests) {
      for (const line of request.items) {
        const categoryLabel =
          line.category && isShopCategory(line.category)
            ? SHOP_CATEGORY_LABELS[line.category]
            : OTHER_CATEGORY_LABEL;
        const byKey = byCategory.get(categoryLabel) ?? new Map<string, ShoppingLine>();
        const key = `${line.itemTitle}__${line.itemFlavor ?? ""}`;
        const existing = byKey.get(key);
        if (existing) {
          existing.quantity += line.quantity;
        } else {
          byKey.set(key, {
            itemTitle: line.itemTitle,
            itemFlavor: line.itemFlavor,
            quantity: line.quantity,
          });
        }
        byCategory.set(categoryLabel, byKey);
      }
    }

    const categoryOrder = [
      ...SHOP_CATEGORY_ORDER.map((category) => SHOP_CATEGORY_LABELS[category]),
      OTHER_CATEGORY_LABEL,
    ];

    const groups: ShoppingGroup[] = [];
    for (const label of categoryOrder) {
      const byKey = byCategory.get(label);
      if (!byKey || byKey.size === 0) continue;
      const lines = Array.from(byKey.values()).sort(
        (a, b) =>
          a.itemTitle.localeCompare(b.itemTitle, "ro") ||
          (a.itemFlavor ?? "").localeCompare(b.itemFlavor ?? "", "ro"),
      );
      groups.push({ label, lines });
    }
    return groups;
  }, [approvedRequests]);

  const specialRequests = useMemo(
    () =>
      approvedRequests
        .filter((request) => request.note)
        .map((request) => ({ userName: request.userName, note: request.note as string })),
    [approvedRequests],
  );

  function handleClearList() {
    setClearError(null);
    startClearTransition(async () => {
      const ids = approvedRequests.map((request) => request.id);
      const result = await markShopRequestsFulfilledAction(ids);
      if (result.error) {
        setClearError(result.error);
        return;
      }
      setStatuses((current) => {
        const next = new Map(current);
        for (const id of ids) next.set(id, "FULFILLED");
        return next;
      });
    });
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          <FilterPill
            label={`Toate (${requests.length})`}
            active={filter === "ALL"}
            onClick={() => setFilter("ALL")}
          />
          {STATUS_FILTERS.map((status) => (
            <FilterPill
              key={status}
              label={`${STATUS_LABELS[status]} (${counts[status] ?? 0})`}
              active={filter === status}
              onClick={() => setFilter(status)}
            />
          ))}
        </div>

        <button
          type="button"
          onClick={() => setShowShoppingList((value) => !value)}
          className="rounded-full bg-sage-trust px-5 py-2.5 text-xs font-semibold text-warm-cream transition-colors duration-200 ease-out hover:bg-sage-deep focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sage-deep"
        >
          {showShoppingList ? "Ascunde lista de cumpărături" : "Lista de cumpărături"}
        </button>
      </div>

      <div className="mt-5 sm:max-w-xs">
        <input
          type="text"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Caută după numele membrului…"
          className="w-full rounded-[8px] border border-border-sand bg-warm-cream px-4 py-2.5 text-sm text-ink-umber placeholder:text-ink-umber-soft/70 transition-colors duration-200 ease-out focus:border-sage-trust focus:outline-none"
        />
      </div>

      {showShoppingList && (
        <ShoppingListPanel
          groups={shoppingList}
          specialRequests={specialRequests}
          onClear={handleClearList}
          isClearing={isClearing}
          error={clearError}
        />
      )}

      {filtered.length === 0 ? (
        <p className="mt-8 rounded-[16px] bg-soft-linen px-7 py-7 text-sm text-ink-umber-soft">
          Nicio solicitare în această categorie.
        </p>
      ) : (
        <>
          {/* Desktop table */}
          <div className="mt-8 hidden overflow-x-auto rounded-[16px] bg-soft-linen xl:block">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="border-b border-border-sand text-left text-ink-umber-soft">
                  <th className="whitespace-nowrap px-5 py-6 font-medium">Membru</th>
                  <th className="w-full px-6 py-6 font-medium">Obiecte</th>
                  <th className="whitespace-nowrap px-5 py-6 font-medium">Status</th>
                  <th className="whitespace-nowrap px-5 py-6 font-medium">Acțiuni</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((request) => (
                  <ShopRequestRow
                    key={request.id}
                    request={request}
                    status={statuses.get(request.id) ?? request.status}
                    onStatusChange={(status) => handleStatusChange(request.id, status)}
                  />
                ))}
              </tbody>
            </table>
          </div>

          {/* Card layout for phones and narrow tablets */}
          <ul className="mt-8 flex flex-col gap-4 xl:hidden">
            {filtered.map((request) => (
              <ShopRequestCard
                key={request.id}
                request={request}
                status={statuses.get(request.id) ?? request.status}
                onStatusChange={(status) => handleStatusChange(request.id, status)}
              />
            ))}
          </ul>
        </>
      )}
    </div>
  );
}

function FilterPill({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full px-4 py-2 text-xs font-semibold transition-colors duration-200 ease-out focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sage-deep ${
        active
          ? "bg-sage-trust text-warm-cream"
          : "bg-soft-linen text-ink-umber-soft hover:text-ink-umber"
      }`}
    >
      {label}
    </button>
  );
}

function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={`inline-block whitespace-nowrap rounded-full bg-warm-cream px-3.5 py-1.5 text-xs font-semibold ${
        status === "APPROVED"
          ? "text-sage-deep"
          : status === "REJECTED"
            ? "text-signal-red"
            : status === "FULFILLED"
              ? "text-ink-umber"
              : status === "DELIVERED"
                ? "text-sage-trust"
                : "text-ink-umber-soft"
      }`}
    >
      {STATUS_LABELS[status] ?? status}
    </span>
  );
}

function ShoppingListPanel({
  groups,
  onClear,
  isClearing,
  specialRequests,
  error,
}: {
  groups: ShoppingGroup[];
  specialRequests: SpecialRequest[];
  onClear: () => void;
  isClearing: boolean;
  error: string | null;
}) {
  const isEmpty = groups.length === 0 && specialRequests.length === 0;

  return (
    <div className="mt-4 rounded-[16px] bg-soft-linen p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-display text-lg font-medium text-ink-umber">
            Lista de cumpărături
          </h2>
          <p className="mt-1 text-xs text-ink-umber-soft">
            Cantitățile totale din toate solicitările aprobate, grupate pe categorii, gata pentru cel care merge la cumpărături azi.
          </p>
        </div>
        <button
          type="button"
          onClick={onClear}
          disabled={isClearing || isEmpty}
          className="rounded-full border border-signal-red/30 px-4 py-2 text-xs font-medium text-signal-red transition-colors duration-200 ease-out hover:bg-signal-red/10 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isClearing ? "Se marchează…" : "Am cumpărat, golește lista"}
        </button>
      </div>

      {error && <p className="mt-2 text-xs text-signal-red">{error}</p>}

      {isEmpty ? (
        <p className="mt-5 text-sm text-ink-umber-soft">
          Nicio solicitare aprobată momentan.
        </p>
      ) : (
        <div className="mt-6 flex flex-col gap-6">
          {groups.map((group) => (
            <div key={group.label}>
              <h3 className="text-[0.6875rem] font-semibold uppercase tracking-[0.04em] text-ink-umber-soft">
                {group.label}
              </h3>
              <div className="mt-2.5 divide-y divide-border-sand overflow-x-auto rounded-[10px] bg-warm-cream">
                {group.lines.map((line) => (
                  <div
                    key={`${line.itemTitle}__${line.itemFlavor ?? ""}`}
                    className="flex items-center justify-between gap-4 px-5 py-3.5 text-sm"
                  >
                    <p className="text-ink-umber">
                      {line.itemTitle}
                      {line.itemFlavor && (
                        <span className="text-ink-umber-soft"> — {line.itemFlavor}</span>
                      )}
                    </p>
                    <p className="shrink-0 tabular-nums font-semibold text-ink-umber">
                      × {line.quantity}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}

          {specialRequests.length > 0 && (
            <div>
              <h3 className="text-[0.6875rem] font-semibold uppercase tracking-[0.04em] text-ink-umber-soft">
                Produse speciale
              </h3>
              <div className="mt-2.5 divide-y divide-border-sand overflow-x-auto rounded-[10px] bg-warm-cream">
                {specialRequests.map((special, index) => (
                  <div key={`${special.userName}__${index}`} className="px-5 py-3.5 text-sm">
                    <span className="font-semibold text-ink-umber">{special.userName}: </span>
                    <span className="text-ink-umber-soft">{special.note}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function ItemsList({ request, status }: { request: ShopRequestEntry; status: string }) {
  return (
    <>
      <ul className="flex flex-col gap-2">
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
      {request.note && (
        <p className="mt-3 whitespace-pre-wrap break-words rounded-[10px] bg-warm-cream py-2.5 pl-2.5 pr-4 text-xs text-ink-umber-soft">
          <span className="font-semibold text-ink-umber">Produse speciale: </span>
          {request.note}
        </p>
      )}
      {status === "FULFILLED" && request.total > 0 && (
        <p className="mt-3 text-sm font-semibold text-sage-deep">
          De încasat la ridicare: {formatPrice(request.total)}
        </p>
      )}
    </>
  );
}

function useRequestActions(
  requestId: string,
  onStatusChange: (status: string) => void,
) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function handleUpdate(nextStatus: "APPROVED" | "REJECTED") {
    setError(null);
    startTransition(async () => {
      const result = await updateShopRequestStatusAction(requestId, nextStatus);
      if (result.error) {
        setError(result.error);
      } else {
        onStatusChange(nextStatus);
      }
    });
  }

  return { isPending, error, handleUpdate };
}

function useDeliverAction(requestId: string, onStatusChange: (status: string) => void) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function handleDeliver() {
    setError(null);
    startTransition(async () => {
      const result = await markShopRequestDeliveredAction(requestId);
      if (result.error) {
        setError(result.error);
      } else {
        onStatusChange("DELIVERED");
      }
    });
  }

  return { isPending, error, handleDeliver };
}

function ShopRequestRow({
  request,
  status,
  onStatusChange,
}: {
  request: ShopRequestEntry;
  status: string;
  onStatusChange: (status: string) => void;
}) {
  const { isPending, error, handleUpdate } = useRequestActions(request.id, onStatusChange);
  const {
    isPending: isDelivering,
    error: deliverError,
    handleDeliver,
  } = useDeliverAction(request.id, onStatusChange);

  return (
    <tr className="border-b border-border-sand last:border-0">
      <td className="whitespace-nowrap px-5 py-6 align-top">
        <p className="font-semibold text-ink-umber">{request.userName}</p>
        <p
          className="mt-1 max-w-[220px] truncate text-xs text-ink-umber-soft"
          title={request.userEmail ?? undefined}
        >
          {request.userEmail}
        </p>
      </td>
      <td className="px-6 py-6 align-top text-ink-umber">
        <ItemsList request={request} status={status} />
      </td>
      <td className="whitespace-nowrap px-5 py-6 align-middle">
        <div className="flex flex-col items-center gap-1.5">
          <StatusBadge status={status} />
          <p className="text-center text-xs text-ink-umber-soft">
            {request.createdAt.toLocaleString("ro-RO", {
              day: "2-digit",
              month: "2-digit",
              hour: "2-digit",
              minute: "2-digit",
              timeZone: "Europe/Bucharest",
            })}
          </p>
        </div>
        {error && <p className="mt-1.5 text-center text-xs text-signal-red">{error}</p>}
        {deliverError && (
          <p className="mt-1.5 text-center text-xs text-signal-red">{deliverError}</p>
        )}
      </td>
      <td className="px-5 py-6 align-middle">
        {status === "PENDING" ? (
          <div className="flex flex-nowrap gap-2">
            <button
              type="button"
              disabled={isPending}
              onClick={() => handleUpdate("APPROVED")}
              className="rounded-full bg-amber-glow px-3.5 py-2.5 text-xs font-semibold text-ink-umber transition-colors duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] hover:bg-amber-deep focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sage-deep disabled:opacity-60"
            >
              Aprobă
            </button>
            <button
              type="button"
              disabled={isPending}
              onClick={() => handleUpdate("REJECTED")}
              className="rounded-full bg-border-sand px-3.5 py-2.5 text-xs font-semibold text-ink-umber transition-colors duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] hover:bg-warm-cream focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sage-deep disabled:opacity-60"
            >
              Respinge
            </button>
          </div>
        ) : status === "FULFILLED" ? (
          <button
            type="button"
            disabled={isDelivering}
            onClick={handleDeliver}
            className="rounded-full bg-sage-trust px-4 py-2.5 text-xs font-semibold text-warm-cream transition-colors duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] hover:bg-sage-deep focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sage-deep disabled:opacity-60"
          >
            {isDelivering ? "Se predă…" : "Predă"}
          </button>
        ) : (
          <span className="text-xs text-ink-umber-soft">—</span>
        )}
      </td>
    </tr>
  );
}

function ShopRequestCard({
  request,
  status,
  onStatusChange,
}: {
  request: ShopRequestEntry;
  status: string;
  onStatusChange: (status: string) => void;
}) {
  const { isPending, error, handleUpdate } = useRequestActions(request.id, onStatusChange);
  const {
    isPending: isDelivering,
    error: deliverError,
    handleDeliver,
  } = useDeliverAction(request.id, onStatusChange);

  return (
    <li className="rounded-[16px] bg-soft-linen p-6">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="font-semibold text-ink-umber break-words">{request.userName}</p>
          <p className="truncate text-xs text-ink-umber-soft">{request.userEmail}</p>
        </div>
        <StatusBadge status={status} />
      </div>

      <p className="mt-3 text-xs text-ink-umber-soft">
        {request.createdAt.toLocaleString("ro-RO", {
          day: "2-digit",
          month: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
          timeZone: "Europe/Bucharest",
        })}
      </p>

      <div className="mt-4 text-sm text-ink-umber">
        <ItemsList request={request} status={status} />
      </div>

      {error && <p className="mt-2 text-xs text-signal-red">{error}</p>}
      {deliverError && <p className="mt-2 text-xs text-signal-red">{deliverError}</p>}

      {status === "PENDING" && (
        <div className="mt-5 flex gap-2 border-t border-border-sand pt-4">
          <button
            type="button"
            disabled={isPending}
            onClick={() => handleUpdate("APPROVED")}
            className="flex-1 rounded-full bg-amber-glow px-4 py-2.5 text-xs font-semibold text-ink-umber transition-colors duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] hover:bg-amber-deep focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sage-deep disabled:opacity-60"
          >
            Aprobă
          </button>
          <button
            type="button"
            disabled={isPending}
            onClick={() => handleUpdate("REJECTED")}
            className="flex-1 rounded-full bg-border-sand px-4 py-2.5 text-xs font-semibold text-ink-umber transition-colors duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] hover:bg-warm-cream focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sage-deep disabled:opacity-60"
          >
            Respinge
          </button>
        </div>
      )}

      {status === "FULFILLED" && (
        <div className="mt-5 border-t border-border-sand pt-4">
          <button
            type="button"
            disabled={isDelivering}
            onClick={handleDeliver}
            className="w-full rounded-full bg-sage-trust px-4 py-2.5 text-xs font-semibold text-warm-cream transition-colors duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] hover:bg-sage-deep focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sage-deep disabled:opacity-60"
          >
            {isDelivering ? "Se predă…" : "Predă"}
          </button>
        </div>
      )}
    </li>
  );
}
