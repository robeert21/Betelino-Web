import { GAME_RULES } from "./data";

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
        Câteva reguli de bază pentru jocurile din tabără. Instructorii pot
        adăuga precizări suplimentare înainte de fiecare joc.
      </p>

      <div className="mt-14 divide-y divide-border-sand">
        {GAME_RULES.map((rule, index) => (
          <section
            key={rule.slug}
            className="animate-fade-in py-10 first:pt-0"
            style={{ animationDelay: `${0.1 + index * 0.08}s` }}
          >
            <h2 className="text-xl font-semibold text-ink-umber">
              {rule.title}
            </h2>
            <p className="mt-2 max-w-[65ch] leading-relaxed text-ink-umber-soft">
              {rule.summary}
            </p>
            <ol className="mt-5 max-w-[65ch] space-y-3">
              {rule.instructions.map((step, index) => (
                <li key={index} className="flex gap-4 leading-relaxed">
                  <span className="tabular-nums text-sm font-semibold text-sage-deep">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="text-ink-umber">{step}</span>
                </li>
              ))}
            </ol>
          </section>
        ))}
      </div>
    </div>
  );
}
