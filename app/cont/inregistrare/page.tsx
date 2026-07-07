import { RegisterForm } from "./RegisterForm";

export const metadata = {
  title: "Creează cont — Betelino",
};

export default function InregistrarePage() {
  return (
    <div className="animate-fade-in mx-auto max-w-md px-6 py-16 md:py-24">
      <p className="text-[0.8125rem] font-semibold uppercase tracking-[0.04em] text-sage-deep">
        Contul meu
      </p>
      <h1 className="font-display mt-4 text-[clamp(1.5rem,3vw,2.25rem)] font-medium leading-[1.15] text-ink-umber">
        Creează-ți contul
      </h1>
      <p className="mt-4 leading-relaxed text-ink-umber-soft">
        Ai nevoie doar de nume, email și o parolă. Echipa ta va fi asignată de
        instructori la începutul taberei.
      </p>

      <RegisterForm />
    </div>
  );
}
