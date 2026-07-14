"use client";

import { useState } from "react";
import type {
  CabinRosterEntry,
  CamperFineEntry,
  CamperShopOrder,
  IndividualPointLogEntry,
} from "./data";
import { CancelOrderButton } from "./CancelOrderButton";
import { formatPrice } from "@/app/magazin/format";

type Guide = { name: string; phone: string; photoUrl: string } | null;
type CabinRoster = { cabin: number; members: CabinRosterEntry[] } | null;

type TabSlug = "prezentare" | "magazin" | "amenzi" | "copii";

const STATUS_LABELS: Record<string, string> = {
  PENDING: "În așteptare",
  APPROVED: "Aprobată",
  FULFILLED: "Cumpărată",
  DELIVERED: "Predată",
  REJECTED: "Respinsă",
};

function formatDate(date: Date) {
  return date.toLocaleString("ro-RO", {
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Europe/Bucharest",
  });
}

function EmptyState({ children }: { children: React.ReactNode }) {
  return (
    <p className="animate-fade-in mt-6 max-w-[65ch] rounded-[14px] bg-soft-linen px-6 py-8 text-center text-sm leading-relaxed text-ink-umber-soft">
      {children}
    </p>
  );
}

export function AccountTabs({
  guide,
  pointLogs,
  shopOrders,
  camperFines,
  cabinRoster,
  cabinLeaderName,
}: {
  guide: Guide;
  pointLogs: IndividualPointLogEntry[];
  shopOrders: CamperShopOrder[];
  camperFines: CamperFineEntry[];
  cabinRoster: CabinRoster;
  cabinLeaderName: string | null;
}) {
  const [activeTab, setActiveTab] = useState<TabSlug>("prezentare");

  const hasPrices = shopOrders.some((order) =>
    order.items.some((item) => item.unitCost > 0),
  );
  const shopOrdersTotal = shopOrders.reduce((sum, order) => sum + order.total, 0);
  const unpaidFines = camperFines.filter((fine) => !fine.paidAt);
  const unpaidFinesCount = unpaidFines.length;
  const unpaidFinesTotal = unpaidFines.reduce((sum, fine) => sum + fine.amount, 0);

  const tabs: { slug: TabSlug; label: string; hint?: string; alert?: boolean }[] = [
    { slug: "prezentare", label: "Prezentare" },
    {
      slug: "magazin",
      label: "Magazin",
      hint: shopOrders.length > 0 ? String(shopOrders.length) : undefined,
    },
    {
      slug: "amenzi",
      label: "Amenzi",
      hint: camperFines.length > 0 ? String(camperFines.length) : undefined,
      alert: unpaidFinesCount > 0,
    },
    ...(cabinRoster
      ? [
          {
            slug: "copii" as TabSlug,
            label: "Copii",
            hint: String(cabinRoster.members.length),
          },
        ]
      : []),
  ];

  return (
    <div className="mt-12">
      <div
        role="tablist"
        aria-label="Secțiuni cont"
        className={`grid gap-2 ${cabinRoster ? "grid-cols-4" : "grid-cols-3"}`}
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
                    isActive
                      ? "text-warm-cream/80"
                      : tab.alert
                        ? "font-bold text-signal-red"
                        : "text-ink-umber-soft"
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
        {activeTab === "prezentare" && (
          <div>
            {cabinLeaderName && (
              <div className={`rounded-[14px] bg-soft-linen px-8 py-6 ${guide ? "mb-2.5" : ""}`}>
                <p className="text-[0.8125rem] font-semibold uppercase tracking-[0.04em] text-sage-deep">
                  Liderul cabanei tale
                </p>
                <p className="mt-1 text-base font-semibold text-ink-umber">{cabinLeaderName}</p>
              </div>
            )}
            {guide && (
              <div className="flex items-center justify-between gap-4 rounded-[14px] bg-soft-linen px-8 py-6">
                <div>
                  <p className="text-[0.8125rem] font-semibold uppercase tracking-[0.04em] text-sage-deep">
                    Călăuza ta
                  </p>
                  <p className="mt-1 text-base font-semibold text-ink-umber">{guide.name}</p>
                  <p className="text-sm text-ink-umber-soft">{guide.phone}</p>
                </div>
                <div
                  className="h-20 w-20 shrink-0 rounded-full bg-cover bg-center bg-border-sand"
                  style={{ backgroundImage: `url(${guide.photoUrl})` }}
                  aria-hidden
                />
              </div>
            )}

            {pointLogs.length > 0 ? (
              <div className={guide ? "mt-10" : ""}>
                <h2 className="text-lg font-medium text-ink-umber">Istoric puncte individuale</h2>
                <div className="mt-6 divide-y divide-border-sand rounded-[14px] bg-soft-linen px-8">
                  {pointLogs.map((log) => (
                    <div key={log.id} className="flex items-center justify-between gap-6 py-5">
                      <div>
                        {log.reason && (
                          <p className="text-sm font-semibold text-ink-umber">{log.reason}</p>
                        )}
                        <p className="text-xs text-ink-umber-soft">{formatDate(log.createdAt)}</p>
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
            ) : (
              !guide && (
                <EmptyState>
                  Nu ai încă niciun punct individual înregistrat. Punctele apar aici imediat ce un
                  lider ți le acordă.
                </EmptyState>
              )
            )}
          </div>
        )}

        {activeTab === "magazin" && (
          <div>
            {shopOrders.length > 0 ? (
              <>
                {hasPrices && (
                  <div className="flex items-baseline justify-between gap-4">
                    <p className="text-sm font-semibold text-ink-umber-soft">
                      Total comenzi active
                    </p>
                    <p className="tabular-nums text-base font-semibold text-ink-umber">
                      {formatPrice(shopOrdersTotal)}
                    </p>
                  </div>
                )}
                {!hasPrices && (
                  <p className="max-w-[65ch] text-sm leading-relaxed text-ink-umber-soft">
                    Prețurile în magazin nu sunt încă stabilite — suma de plată va apărea aici
                    imediat ce vor fi adăugate.
                  </p>
                )}
                <div className="mt-6 space-y-4">
                  {shopOrders.map((order) => (
                    <div key={order.id} className="rounded-[14px] bg-soft-linen px-8 py-6">
                      <div className="flex items-center justify-between gap-4">
                        <p className="text-xs font-semibold uppercase tracking-[0.04em] text-sage-deep">
                          {formatDate(order.createdAt)}
                        </p>
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${
                            order.status === "REJECTED"
                              ? "bg-signal-red/10 text-signal-red"
                              : order.status === "DELIVERED"
                                ? "bg-sage-deep/10 text-sage-deep"
                                : "bg-border-sand/60 text-ink-umber-soft"
                          }`}
                        >
                          {STATUS_LABELS[order.status] ?? order.status}
                        </span>
                      </div>
                      <div className="mt-4 divide-y divide-border-sand">
                        {order.items.map((item) => (
                          <div
                            key={item.id}
                            className="flex items-center justify-between gap-6 py-2.5 text-sm"
                          >
                            <p className="text-ink-umber">
                              {item.itemTitle}
                              {item.itemFlavor ? ` (${item.itemFlavor})` : ""}
                              <span className="text-ink-umber-soft"> × {item.quantity}</span>
                            </p>
                            {hasPrices && (
                              <p className="tabular-nums font-semibold text-ink-umber">
                                {formatPrice(item.lineTotal)}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                      {order.note && (
                        <p className="mt-3 text-sm italic text-ink-umber-soft">„{order.note}”</p>
                      )}
                      {hasPrices && (
                        <div className="mt-3 flex items-center justify-between border-t border-border-sand pt-3">
                          <p className="text-sm font-semibold text-ink-umber-soft">De plată</p>
                          <p className="tabular-nums text-base font-semibold text-ink-umber">
                            {formatPrice(order.total)}
                          </p>
                        </div>
                      )}
                      {order.status === "PENDING" && <CancelOrderButton requestId={order.id} />}
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <EmptyState>
                Nu ai nicio comandă activă în magazin. Solicită un obiect din pagina Magazin ca să
                apară aici.
              </EmptyState>
            )}
          </div>
        )}

        {activeTab === "amenzi" && (
          <div>
            {camperFines.length > 0 ? (
              <>
                {unpaidFinesTotal > 0 && (
                  <p className="text-sm text-ink-umber-soft">
                    De plată:{" "}
                    <span className="font-semibold text-signal-red">
                      {formatPrice(unpaidFinesTotal)}
                    </span>
                  </p>
                )}
                <div
                  className={`divide-y divide-border-sand rounded-[14px] bg-soft-linen px-6 sm:px-8 ${
                    unpaidFinesTotal > 0 ? "mt-6" : ""
                  }`}
                >
                  {camperFines.map((fine) => (
                    <div
                      key={fine.id}
                      className="flex flex-col gap-2 py-5 sm:flex-row sm:items-center sm:justify-between sm:gap-6"
                    >
                      <div className="min-w-0">
                        <p className="break-words text-sm font-semibold text-ink-umber">
                          {fine.reason}
                        </p>
                        <p className="text-xs text-ink-umber-soft">{formatDate(fine.createdAt)}</p>
                      </div>
                      <div className="flex shrink-0 items-center gap-3">
                        <span className="tabular-nums text-sm font-semibold text-ink-umber">
                          {formatPrice(fine.amount)}
                        </span>
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${
                            fine.paidAt
                              ? "bg-sage-deep/10 text-sage-deep"
                              : "bg-signal-red/10 text-signal-red"
                          }`}
                        >
                          {fine.paidAt ? "Plătită" : "Neplătită"}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <EmptyState>Nicio amendă înregistrată. Așa te vrem!</EmptyState>
            )}
          </div>
        )}

        {activeTab === "copii" && cabinRoster && (
          <div>
            <p className="text-sm font-semibold text-ink-umber-soft">
              Cabana {cabinRoster.cabin}
            </p>
            {cabinRoster.members.length > 0 ? (
              <ul className="mt-6 divide-y divide-border-sand rounded-[14px] bg-soft-linen px-8">
                {cabinRoster.members.map((member) => (
                  <li key={member.id} className="py-4 text-sm font-semibold text-ink-umber">
                    {member.name}
                  </li>
                ))}
              </ul>
            ) : (
              <EmptyState>Niciun copil nu este încă atribuit acestei cabane.</EmptyState>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
