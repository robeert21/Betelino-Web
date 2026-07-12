import { redirect } from "next/navigation";
import { statSync } from "fs";
import path from "path";
import { getSession } from "@/lib/auth";
import { getCamperAccount, getCamperPointLogs, getCamperShopOrders, getCamperFines } from "./data";
import { logoutAction } from "./actions";
import { AddEmailForm } from "./AddEmailForm";
import { AccountTabs } from "./AccountTabs";

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
  const guide = TEAM_GUIDES[account.teamName];

  const detailRows = [
    { label: "Nume complet", value: account.fullName },
    ...(account.username
      ? [{ label: "Utilizator", value: account.username }]
      : []),
    ...(account.email ? [{ label: "Email", value: account.email }] : []),
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

      <div className="animate-fade-in stagger-1 mt-8 flex items-center gap-2.5">
        <span className="rounded-full bg-sage-trust px-4 py-1.5 text-sm font-semibold text-warm-cream">
          {account.teamName}
        </span>
      </div>

      <div className="animate-fade-in stagger-1 mt-6 grid grid-cols-2 gap-2.5">
        <div className="rounded-[14px] bg-soft-linen px-6 py-6">
          <p className="text-[0.8125rem] font-medium text-ink-umber-soft">Puncte individuale</p>
          <p className="animate-value-pop mt-1 tabular-nums text-3xl font-semibold text-ink-umber">
            {account.individualPoints}
          </p>
        </div>
        <div className="rounded-[14px] bg-soft-linen px-6 py-6">
          <p className="text-[0.8125rem] font-medium text-ink-umber-soft">Puncte echipă</p>
          <p className="animate-value-pop mt-1 tabular-nums text-3xl font-semibold text-ink-umber">
            {account.teamPoints}
          </p>
        </div>
      </div>

      <dl className="animate-fade-in stagger-2 mt-2.5 divide-y divide-border-sand rounded-[14px] bg-soft-linen px-6">
        {detailRows.map((row) => (
          <div key={row.label} className="flex items-center justify-between gap-6 py-4">
            <dt className="text-sm text-ink-umber-soft">{row.label}</dt>
            <dd className="text-sm font-semibold text-ink-umber">{row.value}</dd>
          </div>
        ))}
      </dl>

      {!account.email && (
        <div className="animate-fade-in stagger-2 mt-2.5 rounded-[14px] bg-soft-linen px-6 py-6">
          <p className="text-sm font-semibold text-ink-umber">Contul tău nu are un email</p>
          <p className="mt-1.5 max-w-[65ch] text-sm leading-relaxed text-ink-umber-soft">
            Adaugă o adresă ca să poți reseta parola dacă o uiți.
          </p>
          <div className="mt-4">
            <AddEmailForm />
          </div>
        </div>
      )}

      <AccountTabs
        guide={
          guide ? { name: guide.name, phone: guide.phone, photoUrl: photoUrl(guide.photo) } : null
        }
        pointLogs={pointLogs}
        shopOrders={shopOrders}
        camperFines={camperFines}
      />
    </div>
  );
}
