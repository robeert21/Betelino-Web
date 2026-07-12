import { STATIONS, INDIVIDUAL_POINTS, PENALTIES, LEADER_RULES } from "./data";
import type { BonusEntry } from "./data";

export const metadata = {
  title: "Regulament de punctaj — Dashboard lideri — Betelino",
};

function BonusRow({ entry, tone = "sage" }: { entry: BonusEntry; tone?: "sage" | "red" }) {
  return (
    <li className="flex items-baseline justify-between gap-6 py-2">
      <span className="text-ink-umber">{entry.label}</span>
      <span
        className={`shrink-0 font-medium tabular-nums ${
          tone === "red" ? "text-signal-red" : "text-sage-deep"
        }`}
      >
        {entry.points}
      </span>
    </li>
  );
}

export default function PointsRulebookPage() {
  return (
    <div>
      <h1 className="animate-fade-in font-display text-[clamp(1.5rem,3vw,2.25rem)] font-medium leading-[1.15] text-ink-umber">
        Regulament de punctaj
      </h1>
      <p className="animate-fade-in stagger-1 mt-5 max-w-[65ch] leading-relaxed text-ink-umber-soft">
        Punctajul zilnic al echipelor Discovery, Adventure, Mystery și Nature
        se acordă pe cele patru stații de mai jos, plus punctele individuale
        acordate în afara stațiilor. Folosește acest regulament ca reper
        atunci când notezi punctele în Dashboard.
      </p>

      <div className="mt-14">
        <h2 className="text-[0.8125rem] font-semibold uppercase tracking-[0.04em] text-sage-deep">
          Stații — puncte pe echipă
        </h2>
        <p className="mt-2 max-w-[65ch] leading-relaxed text-ink-umber-soft">
          Punctajul de la stații se acordă întregii echipe, nu per copil.
        </p>

        <div className="mt-7 grid gap-6 lg:grid-cols-2">
          {STATIONS.map((station, index) => (
            <section
              key={station.title}
              className="animate-fade-in rounded-[16px] bg-soft-linen p-7 md:p-8"
              style={{ animationDelay: `${0.05 + Math.min(index, 4) * 0.08}s` }}
            >
              <h3 className="text-xl font-semibold text-ink-umber">{station.title}</h3>

              <ul className="mt-5 divide-y divide-border-sand">
                {station.tiers.map((tier) => (
                  <li key={tier.description} className="flex items-baseline justify-between gap-6 py-2.5">
                    <span className="text-ink-umber">{tier.description}</span>
                    <span className="shrink-0 font-medium tabular-nums text-ink-umber">
                      {tier.points}
                    </span>
                  </li>
                ))}
                {station.teamBonus ? (
                  <li className="flex items-baseline justify-between gap-6 py-2.5">
                    <span className="text-ink-umber-soft">
                      Bonus: {station.teamBonus.label}
                    </span>
                    <span className="shrink-0 font-medium tabular-nums text-amber-deep">
                      {station.teamBonus.points}
                    </span>
                  </li>
                ) : null}
              </ul>

              <p className="mt-4 text-sm leading-relaxed text-ink-umber-soft">
                Cum se stabilește: {station.howTo}
              </p>

              {station.individualBonuses.length > 0 ? (
                <div className="mt-5 border-t border-border-sand pt-4">
                  <p className="text-[0.8125rem] font-semibold uppercase tracking-[0.04em] text-ink-umber-soft">
                    Puncte individuale posibile (opțional)
                  </p>
                  <ul className="mt-2.5 space-y-2">
                    {station.individualBonuses.map((bonus) => (
                      <li key={bonus.label} className="flex items-baseline justify-between gap-6 text-sm">
                        <span className="text-ink-umber">{bonus.label}</span>
                        <span className="shrink-0 font-medium tabular-nums text-amber-deep">
                          {bonus.points}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </section>
          ))}
        </div>
      </div>

      <div className="mt-14 grid gap-6 md:grid-cols-2">
        <section className="rounded-[16px] bg-soft-linen p-7 md:p-8">
          <h2 className="text-xl font-semibold text-ink-umber">
            Puncte individuale — în afara stațiilor
          </h2>
          <p className="mt-2.5 leading-relaxed text-ink-umber-soft">
            Opțional, pe copil, în situații speciale.
          </p>
          <ul className="mt-5 divide-y divide-border-sand">
            {INDIVIDUAL_POINTS.map((entry) => (
              <BonusRow key={entry.label} entry={entry} />
            ))}
          </ul>
        </section>

        <section className="rounded-[16px] bg-soft-linen p-7 md:p-8">
          <h2 className="text-xl font-semibold text-ink-umber">Penalizări</h2>
          <p className="mt-2.5 leading-relaxed text-ink-umber-soft">
            Scad din totalul echipei atunci când e cazul.
          </p>
          <ul className="mt-5 divide-y divide-border-sand">
            {PENALTIES.map((entry) => (
              <BonusRow key={entry.label} entry={entry} tone="red" />
            ))}
          </ul>
        </section>
      </div>

      <div className="mt-14">
        <h2 className="text-xl font-semibold text-ink-umber">Reguli pentru lideri</h2>
        <ul className="mt-5 space-y-3">
          {LEADER_RULES.map((rule) => (
            <li key={rule} className="flex gap-3 text-base leading-relaxed">
              <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-sage-deep" />
              <span className="text-ink-umber">{rule}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
