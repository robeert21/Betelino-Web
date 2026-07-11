"use client";

import { useMemo, useState } from "react";
import { SHOP_CATEGORY_LABELS, SHOP_CATEGORY_ORDER } from "@/lib/shop-categories";
import type { ShopItem } from "./data";
import { ShopItemCard } from "./ShopItemCard";

const FOCUS_RING =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sage-deep";

function normalize(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase();
}

export function ShopBrowser({ items }: { items: ShopItem[] }) {
  const [search, setSearch] = useState("");

  const filteredItems = useMemo(() => {
    const query = normalize(search.trim());
    if (!query) return items;
    return items.filter((item) => normalize(item.title).includes(query));
  }, [items, search]);

  return (
    <div>
      <div className="relative mx-auto max-w-5xl">
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          className="pointer-events-none absolute left-5 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-ink-umber-soft"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <circle cx="11" cy="11" r="7" />
          <path d="m20 20-3.5-3.5" strokeLinecap="round" />
        </svg>
        <input
          type="search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Caută un produs…"
          aria-label="Caută un produs în magazin"
          className={`w-full rounded-full border border-border-sand bg-warm-cream py-3.5 pl-12 pr-5 text-base text-ink-umber placeholder:text-ink-umber-soft/70 transition-colors duration-150 ease-[cubic-bezier(0.16,1,0.3,1)] ${FOCUS_RING}`}
        />
      </div>

      <div className="mx-auto mt-10 max-w-5xl divide-y divide-border-sand">
        {filteredItems.length === 0 && (
          <p className="py-10 text-center text-sm text-ink-umber-soft">
            Niciun produs găsit pentru „{search.trim()}”.
          </p>
        )}

        {SHOP_CATEGORY_ORDER.map((category, sectionIndex) => {
          const categoryItems = filteredItems.filter((item) => item.category === category);
          if (categoryItems.length === 0) return null;

          return (
            <section key={category} className="py-10 first:pt-0">
              <div className="flex items-baseline gap-4">
                <span className="tabular-nums text-sm font-semibold text-sage-deep">
                  {String(sectionIndex + 1).padStart(2, "0")}
                </span>
                <h2 className="font-display text-xl font-medium text-ink-umber">
                  {SHOP_CATEGORY_LABELS[category]}
                </h2>
              </div>

              <div className="mt-7 grid gap-7 sm:grid-cols-2">
                {categoryItems.map((item) => (
                  <ShopItemCard key={item.id} item={item} />
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
