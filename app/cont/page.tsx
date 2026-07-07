import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { getCamperAccount } from "./data";
import { logoutAction } from "./actions";

export const metadata = {
  title: "Contul meu — Betelino",
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

  const rows = [
    { label: "Nume complet", value: account.fullName },
    ...(account.username
      ? [{ label: "Utilizator", value: account.username }]
      : []),
    { label: "Echipă", value: account.teamName },
    {
      label: "Puncte individuale",
      value: account.individualPoints,
      numeric: true,
    },
    { label: "Puncte echipă", value: account.teamPoints, numeric: true },
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

      <dl className="animate-fade-in stagger-2 mt-12 divide-y divide-border-sand rounded-[14px] bg-soft-linen px-8">
        {rows.map((row) => (
          <div
            key={row.label}
            className="flex items-center justify-between gap-6 py-5"
          >
            <dt className="text-sm font-medium text-ink-umber-soft">
              {row.label}
            </dt>
            <dd
              className={`text-lg font-semibold text-ink-umber ${
                row.numeric ? "tabular-nums" : ""
              }`}
            >
              {row.value}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
