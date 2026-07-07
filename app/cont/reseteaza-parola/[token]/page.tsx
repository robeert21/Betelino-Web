import { ResetPasswordForm } from "./ResetPasswordForm";

export const metadata = {
  title: "Parolă nouă — Betelino",
};

export default async function ReseteazaParolaTokenPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;

  return (
    <div className="animate-fade-in mx-auto max-w-md px-6 py-16 md:py-24">
      <p className="text-[0.8125rem] font-semibold uppercase tracking-[0.04em] text-sage-deep">
        Contul meu
      </p>
      <h1 className="font-display mt-4 text-[clamp(1.5rem,3vw,2.25rem)] font-medium leading-[1.15] text-ink-umber">
        Alege o parolă nouă
      </h1>
      <p className="mt-4 leading-relaxed text-ink-umber-soft">
        Linkul de resetare este valabil o oră de la trimitere.
      </p>

      <ResetPasswordForm token={token} />
    </div>
  );
}
