import { RequestResetForm } from "./RequestResetForm";

export const metadata = {
  title: "Resetează parola — Betelino",
};

export default function ReseteazaParolaPage() {
  return (
    <div className="animate-fade-in mx-auto max-w-md px-6 py-16 md:py-24">
      <p className="text-[0.8125rem] font-semibold uppercase tracking-[0.04em] text-sage-deep">
        Contul meu
      </p>
      <h1 className="font-display mt-4 text-[clamp(1.5rem,3vw,2.25rem)] font-medium leading-[1.15] text-ink-umber">
        Ai uitat parola?
      </h1>
      <p className="mt-4 leading-relaxed text-ink-umber-soft">
        Introdu emailul contului tău și îți trimitem un link de resetare.
      </p>

      <RequestResetForm />
    </div>
  );
}
