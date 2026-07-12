import { redirect } from "next/navigation";
import { statSync } from "fs";
import path from "path";
import { getSession } from "@/lib/auth";
import { getCamperAccount, getCamperPointLogs, getCamperShopOrders, getCamperFines } from "./data";
import { logoutAction } from "./actions";
import { CancelOrderButton } from "./CancelOrderButton";
import { AddEmailForm } from "./AddEmailForm";
import { formatPrice } from "@/app/magazin/format";

function photoUrl(relativePath: string) {
  try {
    const mtime = statSync(
      path.join(process.cwd(), "public", relativePath),
    ).mtimeMs;
    return `${relativePath}?v=${mtime}`;
  } catch {
    return relativePath;
  }
}

export const metadata = {
  title: "Contul meu — Betelino",
};

const STATUS_LABELS: Record<string, string> = {
  PENDING: "În așteptare",
  APPROVED: "Aprobată",
  FULFILLED: "Cumpărată",
  DELIVERED: "Predată",
  REJECTED: "Respinsă",
};

const TEAM_GUIDES: Record<
  string,
  { name: string; phone: string; photo: string }
> = {
  Mystery: {
    name: "Vatamanu Robert",
    phone: "0743 494 508",
    photo: "/calauze/mystery.jpg",
  },
  Adventure: {
    name: "Stefan Alexandra",
    phone: "0739 266 250",
    photo: "/calauze/adventure.jpg",
  },
  Nature: {
    name: "Iacob Naomi",
    phone: "0757 117 916",
    photo: "/calauze/nature.jpg",
  },
  Discovery: {
    name: "Filip Dabija",
    phone: "0761 182 186",
    photo: "/calauze/discovery.jpg",
  },
};

export default async function ContPage() {
  const session = await getSession();
  if (!session) {
    redirect("/cont/login");
  }

  const account = await getCamperAccount(session.userId);
  if (!account) {
    redirect("/cont/login");
  }

  const pointLogs = await getCamperPointLogs(session.userId);
  const shopOrders = await getCamperShopOrders(session.userId);
  const camperFines = await getCamperFines(session.userId);
  const unpaidFines = camperFines.filter((fine) => !fine.paidAt);
  const unpaidFinesCount = unpaidFines.length;
  const unpaidFinesTotal = unpaidFines.reduce((sum, fine) => sum + fine.amount, 0);
  const guide = TEAM_GUIDES[account.teamName];
  const hasPrices = shopOrders.some((order) =>
    order.items.some((item) => item.unitCost > 0),
  );
  const shopOrdersTotal = shopOrders.reduce((sum, order) => sum + order.total, 0);

  const rows = [
    { label: "Nume complet", value: account.fullName },
    ...(account.username
      ? [{ label: "Utilizator", value: account.username }]
      : []),
    ...(account.email ? [{ label: "Email", value: account.email }] : []),
    { label: "Echipă", value: account.teamName },
    { label: "Puncte echipă", value: account.teamPoints, numeric: true },
    { label: "Puncte individuale", value: account.individualPoints, numeric: true },
  ];

  return (
    <div className="mx-auto max-w-2xl px-6 py-16 md:px-10 md:py-24">
      <div className="animate-fade-in flex items-start justify-between gap-6">
        <div>
          <p className="text-[0.8125rem] font-semibold uppercase tracking-[0.04em] text-sage-deep">
            Contul meu
          </p>
          <h1 className="font-display mt-4 text-[clamp(1.5rem,3vw,2.25rem)] font-medium leading-[1.15] text-ink-umber">
            Salut, {account.fullName.split(" ")[0]}
          </h1>
        </div>
        <form action={logoutAction}>
          <button
            type="submit"
            className="rounded-full border border-border-sand bg-warm-cream px-5 py-2.5 text-sm font-semibold text-ink-umber-soft transition-[border-color,color,transform] duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] hover:border-ink-umber-soft hover:text-ink-umber active:scale-[0.98]"
          >
            Ieși din cont
          </button>
        </form>
      </div>

      <p className="animate-fade-in stagger-1 mt-4 max-w-[65ch] leading-relaxed text-ink-umber-soft">
        Aici vezi echipa ta și punctele adunate până acum în tabără.
      </p>

      <dl className="mt-12 divide-y divide-border-sand rounded-[14px] bg-soft-linen px-8">
        {rows.map((row, index) => (
          <div
            key={row.label}
            className="animate-fade-in flex items-center justify-between gap-6 py-5"
            style={{ animationDelay: `${0.12 + index * 0.06}s` }}
          >
            <dt className="text-sm font-medium text-ink-umber-soft">
              {row.label}
            </dt>
            <dd
              className={`text-lg font-semibold text-ink-umber ${
                row.numeric
                  ? "animate-value-pop tabular-nums"
                  : ""
              }`}
              style={
                row.numeric
                  ? { animationDelay: `${0.12 + index * 0.06 + 0.15}s` }
                  : undefined
              }
            >
              {row.value}
            </dd>
          </div>
        ))}
      </dl>

      {guide && (
        <div className="animate-fade-in stagger-2 mt-8 flex items-center justify-between gap-4 rounded-[14px] bg-soft-linen px-8 py-6">
          <div>
            <p className="text-[0.8125rem] font-semibold uppercase tracking-[0.04em] text-sage-deep">
              Călăuza ta
            </p>
            <p className="mt-1 text-base font-semibold text-ink-umber">
              {guide.name}
            </p>
            <p className="text-sm text-ink-umber-soft">{guide.phone}</p>
          </div>
          <div
            className="h-20 w-20 shrink-0 rounded-full bg-cover bg-center bg-border-sand"
            style={{ backgroundImage: `url(${photoUrl(guide.photo)})` }}
            aria-hidden
          />
        </div>
      )}

      {shopOrders.length > 0 && (
        <div className="mt-12">
          <div className="flex items-baseline justify-between gap-4">
            <h2 className="animate-fade-in font-display text-lg font-medium text-ink-umber">
              Comenzi magazin
            </h2>
            {hasPrices && (
              <p className="animate-fade-in text-sm font-semibold text-ink-umber-soft">
                Total: <span className="tabular-nums text-ink-umber">{formatPrice(shopOrdersTotal)}</span>
              </p>
            )}
          </div>
          {!hasPrices && (
            <p className="animate-fade-in mt-2 max-w-[65ch] text-sm leading-relaxed text-ink-umber-soft">
              Prețurile în magazin nu sunt încă stabilite — suma de plată va apărea aici imediat ce vor fi adăugate.
            </p>
          )}
          <div className="mt-6 space-y-4">
            {shopOrders.map((order, index) => (
              <div
                key={order.id}
                className="animate-fade-in rounded-[14px] bg-soft-linen px-8 py-6"
                style={{ animationDelay: `${Math.min(index, 6) * 0.04}s` }}
              >
                <div className="flex items-center justify-between gap-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.04em] text-sage-deep">
                    {order.createdAt.toLocaleString("ro-RO", {
                      day: "2-digit",
                      month: "2-digit",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
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
                  <p className="mt-3 text-sm italic text-ink-umber-soft">
                    „{order.note}”
                  </p>
                )}
                {hasPrices && (
                  <div className="mt-3 flex items-center justify-between border-t border-border-sand pt-3">
                    <p className="text-sm font-semibold text-ink-umber-soft">De plată</p>
                    <p className="tabular-nums text-base font-semibold text-ink-umber">
                      {formatPrice(order.total)}
                    </p>
                  </div>
                )}
                {order.status === "PENDING" && (
                  <CancelOrderButton requestId={order.id} />
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {camperFines.length > 0 && (
        <div className="mt-12">
          <div className="flex items-baseline justify-between gap-4">
            <h2 className="animate-fade-in font-display text-lg font-medium text-ink-umber">
              Amenzi
            </h2>
            <p className="animate-fade-in text-sm font-semibold text-ink-umber-soft">
              {camperFines.length} {camperFines.length === 1 ? "amendă" : "amenzi"}
              {unpaidFinesCount > 0 && (
                <span className="text-signal-red"> · {unpaidFinesCount} neplătite</span>
              )}
            </p>
          </div>
          {unpaidFinesTotal > 0 && (
            <p className="animate-fade-in mt-2 text-sm text-ink-umber-soft">
              De plată: <span className="font-semibold text-signal-red">{formatPrice(unpaidFinesTotal)}</span>
            </p>
          )}
          <div className="mt-6 divide-y divide-border-sand rounded-[14px] bg-soft-linen px-8">
            {camperFines.map((fine, index) => (
              <div
                key={fine.id}
                className="animate-fade-in flex items-center justify-between gap-6 py-5"
                style={{ animationDelay: `${Math.min(index, 6) * 0.04}s` }}
              >
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-ink-umber">{fine.reason}</p>
                  <p className="text-xs text-ink-umber-soft">
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
        </div>
      )}

      {!account.email && (
        <div className="animate-fade-in stagger-2 mt-8 rounded-[14px] bg-soft-linen px-8 py-6">
          <h2 className="font-display text-lg font-medium text-ink-umber">
            Contul tău nu are un email
          </h2>
          <p className="mt-2 max-w-[65ch] text-sm leading-relaxed text-ink-umber-soft">
            Adaugă o adresă de email ca să poți reseta parola dacă o uiți.
          </p>
          <div className="mt-5">
            <AddEmailForm />
          </div>
        </div>
      )}

      {pointLogs.length > 0 && (
        <div className="mt-12">
          <h2 className="animate-fade-in font-display text-lg font-medium text-ink-umber">
            Istoric puncte individuale
          </h2>
          <div className="mt-6 divide-y divide-border-sand rounded-[14px] bg-soft-linen px-8">
            {pointLogs.map((log, index) => (
              <div
                key={log.id}
                className="animate-fade-in flex items-center justify-between gap-6 py-5"
                style={{ animationDelay: `${Math.min(index, 6) * 0.04}s` }}
              >
                <div>
                  {log.reason && (
                    <p className="text-sm font-semibold text-ink-umber">{log.reason}</p>
                  )}
                  <p className="text-xs text-ink-umber-soft">
                    {log.createdAt.toLocaleString("ro-RO", {
                      day: "2-digit",
                      month: "2-digit",
                      hour: "2-digit",
                      minute: "2-digit",
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
        </div>
      )}
    </div>
  );
}
