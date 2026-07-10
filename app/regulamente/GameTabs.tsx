"use client";

import { useState } from "react";
import type { GameRule, RuleSection } from "./data";

type TopSection = "regulament" | "jocuri";

const TOP_SECTIONS: { slug: TopSection; label: string }[] = [
  { slug: "regulament", label: "Regulamentul Taberei" },
  { slug: "jocuri", label: "Jocuri" },
];

function RuleSections({ sections, wide = false }: { sections: RuleSection[]; wide?: boolean }) {
  return (
    <div className={`grid gap-6 ${wide ? "lg:grid-cols-2" : ""}`}>
      {sections.map((section, index) => (
        <section
          key={section.title}
          className="animate-fade-in rounded-[16px] bg-soft-linen p-7 md:p-8"
          style={{ animationDelay: `${0.05 + Math.min(index, 4) * 0.08}s` }}
        >
          <h3 className="text-xl font-semibold text-ink-umber">{section.title}</h3>
          {section.intro ? (
            <p className="mt-2.5 leading-relaxed text-ink-umber-soft">{section.intro}</p>
          ) : null}
          <ul className="mt-5 space-y-3">
            {section.items.map((item, itemIndex) => (
              <li key={itemIndex} className="flex gap-3 text-base leading-relaxed">
                <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-sage-deep" />
                <span className="text-ink-umber">{item}</span>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}

function GameCard({ game }: { game: GameRule }) {
  return (
    <div className="animate-fade-in min-w-0">
      <h2 className="text-2xl font-semibold text-ink-umber">{game.title}</h2>
      <p className="mt-2.5 max-w-[75ch] text-lg leading-relaxed text-ink-umber-soft">
        {game.summary}
      </p>
      <div className="mt-8">
        <RuleSections sections={game.sections} wide />
      </div>
    </div>
  );
}

export function GameTabs({
  campRules,
  games,
}: {
  campRules: RuleSection[];
  games: GameRule[];
}) {
  const [activeTop, setActiveTop] = useState<TopSection>("regulament");

  return (
    <div>
      <div
        role="tablist"
        aria-label="Secțiuni"
        className="flex flex-wrap gap-2.5"
      >
        {TOP_SECTIONS.map((section) => {
          const isActive = section.slug === activeTop;
          return (
            <button
              key={section.slug}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => setActiveTop(section.slug)}
              className={`min-h-[48px] rounded-full px-6 py-2.5 text-sm font-semibold uppercase tracking-[0.04em] transition-colors duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                isActive
                  ? "bg-forest-night text-warm-cream"
                  : "bg-soft-linen text-ink-umber-soft hover:text-ink-umber"
              }`}
            >
              {section.label}
            </button>
          );
        })}
      </div>

      <div key={activeTop} className="animate-fade-in mt-10">
        {activeTop === "regulament" ? (
          <RuleSections sections={campRules} />
        ) : (
          <div className="grid gap-14">
            {games.map((game) => (
              <GameCard key={game.slug} game={game} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
