"use client";

import { useState } from "react";
import type { GameCategory } from "./data";

export function GameTabs({ categories }: { categories: GameCategory[] }) {
  const [activeSlug, setActiveSlug] = useState(categories[0].slug);
  const active = categories.find((category) => category.slug === activeSlug) ?? categories[0];

  return (
    <div className="mt-10">
      <div
        role="tablist"
        aria-label="Categorii de jocuri"
        className="flex flex-wrap gap-2"
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
              className={`min-h-[44px] rounded-full px-5 py-2 text-[0.8125rem] font-semibold uppercase tracking-[0.04em] transition-colors duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                isActive
                  ? "bg-sage-trust text-warm-cream"
                  : "bg-soft-linen text-ink-umber-soft hover:text-ink-umber"
              }`}
            >
              {category.label}
            </button>
          );
        })}
      </div>

      <div key={active.slug} className="animate-fade-in mt-10">
        <p className="max-w-[65ch] leading-relaxed text-ink-umber-soft">
          {active.description}
        </p>

        <div className="mt-8 divide-y divide-border-sand">
          {active.games.map((game, index) => (
            <section
              key={game.slug}
              className="animate-fade-in py-10 first:pt-0"
              style={{ animationDelay: `${0.05 + index * 0.08}s` }}
            >
              <h2 className="text-xl font-semibold text-ink-umber">
                {game.title}
              </h2>
              <p className="mt-2 max-w-[65ch] leading-relaxed text-ink-umber-soft">
                {game.summary}
              </p>
              <ol className="mt-5 max-w-[65ch] space-y-3">
                {game.instructions.map((step, stepIndex) => (
                  <li key={stepIndex} className="flex gap-4 leading-relaxed">
                    <span className="tabular-nums text-sm font-semibold text-sage-deep">
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
