"use client";

import { useState } from "react";
import type { GameCategory } from "./data";

export function GameTabs({ categories }: { categories: GameCategory[] }) {
  const [activeSlug, setActiveSlug] = useState(categories[0].slug);
  const active = categories.find((category) => category.slug === activeSlug) ?? categories[0];

  return (
    <div className="mt-10 grid gap-10 md:grid-cols-[260px_1fr] md:gap-14 lg:grid-cols-[300px_1fr] lg:gap-20">
      <div
        role="tablist"
        aria-label="Categorii de jocuri"
        className="flex flex-wrap gap-2.5 md:sticky md:top-24 md:flex-col md:items-start md:self-start md:gap-2"
      >
        {categories.map((category) => {
          const isActive = category.slug === activeSlug;
          return (
            <button
              key={category.slug}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => setActiveSlug(category.slug)}
              className={`min-h-[48px] rounded-full px-6 py-2.5 text-sm font-semibold uppercase tracking-[0.04em] transition-colors duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] md:w-full md:text-left ${
                isActive
                  ? "bg-forest-night text-warm-cream"
                  : "bg-soft-linen text-ink-umber-soft hover:text-ink-umber"
              }`}
            >
              {category.label}
            </button>
          );
        })}
      </div>

      <div key={active.slug} className="animate-fade-in min-w-0">
        <p className="max-w-[75ch] text-lg leading-relaxed text-ink-umber-soft">
          {active.description}
        </p>

        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          {active.games.map((game, index) => (
            <section
              key={game.slug}
              className="animate-fade-in rounded-[16px] bg-soft-linen p-7 md:p-8"
              style={{ animationDelay: `${0.05 + Math.min(index, 4) * 0.08}s` }}
            >
              <h2 className="text-2xl font-semibold text-ink-umber">
                {game.title}
              </h2>
              <p className="mt-2.5 leading-relaxed text-ink-umber-soft">
                {game.summary}
              </p>
              <ol className="mt-6 space-y-4">
                {game.instructions.map((step, stepIndex) => (
                  <li key={stepIndex} className="flex gap-4 text-base leading-relaxed">
                    <span className="tabular-nums text-base font-semibold text-sage-deep">
                      {String(stepIndex + 1).padStart(2, "0")}
                    </span>
                    <span className="text-ink-umber">{step}</span>
                  </li>
                ))}
              </ol>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
