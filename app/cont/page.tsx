import { redirect } from "next/navigation";
import { statSync } from "fs";
import path from "path";
import { getSession } from "@/lib/auth";
import { getCamperAccount, getCamperPointLogs } from "./data";
import { logoutAction } from "./actions";
import { AddEmailForm } from "./AddEmailForm";

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
  const guide = TEAM_GUIDES[account.teamName];

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
