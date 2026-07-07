import { GAME_CATEGORIES } from "./data";
import { GameTabs } from "./GameTabs";

export const metadata = {
  title: "Regulamente — Betelino",
};

export default function RegulamentePage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16 md:px-10 md:py-24">
      <p className="animate-fade-in text-[0.8125rem] font-semibold uppercase tracking-[0.04em] text-sage-deep">
        Regulamente
      </p>
      <h1 className="animate-fade-in stagger-1 font-display mt-4 text-[clamp(1.5rem,3vw,2.25rem)] font-medium leading-[1.15] text-ink-umber">
        Regulile jocurilor
      </h1>
      <p className="animate-fade-in stagger-2 mt-4 max-w-[65ch] leading-relaxed text-ink-umber-soft">
        Alege o categorie de mai jos ca să vezi regulile jocurilor din tabără.
        Instructorii pot adăuga precizări suplimentare înainte de fiecare joc.
      </p>

      <GameTabs categories={GAME_CATEGORIES} />
    </div>
  );
}
