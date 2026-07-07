import { LoginForm } from "./LoginForm";

export const metadata = {
  title: "Autentificare — Betelino",
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ reset?: string }>;
}) {
  const params = await searchParams;

  return (
    <div className="animate-fade-in mx-auto max-w-md px-6 py-16 md:py-24">
      <p className="text-[0.8125rem] font-semibold uppercase tracking-[0.04em] text-sage-deep">
        Contul meu
      </p>
      <h1 className="font-display mt-4 text-[clamp(1.5rem,3vw,2.25rem)] font-medium leading-[1.15] text-ink-umber">
        Autentificare
      </h1>
      <p className="mt-4 leading-relaxed text-ink-umber-soft">
        Intră în cont cu emailul sau numele de utilizator și parola ta de la
        Betelino.
      </p>

      <LoginForm resetSucceeded={params.reset === "succes"} />
    </div>
  );
}
