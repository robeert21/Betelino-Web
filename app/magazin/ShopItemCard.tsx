"use client";

import { useEffect, useRef, useState } from "react";
import { useCart } from "./CartContext";
import type { ShopItem } from "./data";

const CONFIRM_DURATION = 1100;
const FOCUS_RING =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sage-deep";

export function ShopItemCard({ item }: { item: ShopItem }) {
  const { addToCart, getQuantity } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [justAdded, setJustAdded] = useState(false);
  const inCart = getQuantity(item.id);
  const confirmTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (confirmTimeout.current) clearTimeout(confirmTimeout.current);
    };
  }, []);

  function handleAdd() {
    addToCart(item, quantity);
    setQuantity(1);
    setJustAdded(true);
    if (confirmTimeout.current) clearTimeout(confirmTimeout.current);
    confirmTimeout.current = setTimeout(() => setJustAdded(false), CONFIRM_DURATION);
  }

  return (
    <div className="flex h-full flex-col gap-4 rounded-[16px] bg-soft-linen p-7 transition-transform duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-0.5">
      <div className="flex flex-col">
        <h2 className="text-xl font-semibold text-ink-umber">{item.title}</h2>

        <div
          className="grid overflow-hidden transition-[grid-template-rows] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]"
          style={{ gridTemplateRows: inCart > 0 ? "1fr" : "0fr" }}
        >
          <div className="min-h-0 overflow-hidden">
            <p
              className="pt-2 text-sm font-semibold text-sage-deep transition-opacity duration-200 ease-[cubic-bezier(0.16,1,0.3,1)]"
              style={{ opacity: inCart > 0 ? 1 : 0 }}
            >
              {inCart} în coș
            </p>
          </div>
        </div>
      </div>

      <div className="mt-auto flex items-center gap-3">
        <div className="flex items-center rounded-full border border-border-sand">
          <button
            type="button"
            disabled={quantity <= 1}
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            aria-label={`Scade cantitatea pentru ${item.title}`}
            className={`px-3.5 py-2.5 text-base font-semibold text-ink-umber transition-transform duration-150 ease-[cubic-bezier(0.16,1,0.3,1)] active:scale-90 disabled:opacity-40 ${FOCUS_RING}`}
          >
            −
          </button>
          <span className="min-w-[1.75rem] text-center text-base tabular-nums text-ink-umber">
            {quantity}
          </span>
          <button
            type="button"
            onClick={() => setQuantity((q) => q + 1)}
            aria-label={`Crește cantitatea pentru ${item.title}`}
            className={`px-3.5 py-2.5 text-base font-semibold text-ink-umber transition-transform duration-150 ease-[cubic-bezier(0.16,1,0.3,1)] active:scale-90 ${FOCUS_RING}`}
          >
            +
          </button>
        </div>

        <button
          type="button"
          onClick={handleAdd}
          aria-live="polite"
          className={`flex-1 rounded-full border px-5 py-3.5 text-base font-semibold transition-[background-color,color,border-color,transform] duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] active:scale-[0.98] disabled:cursor-not-allowed disabled:border-transparent disabled:bg-border-sand disabled:text-ink-umber-soft disabled:active:scale-100 ${FOCUS_RING} ${
            justAdded
              ? "border-sage-trust bg-warm-cream text-sage-deep"
              : "border-transparent bg-amber-glow text-ink-umber hover:bg-amber-deep"
          }`}
        >
          {justAdded ? "Adăugat ✓" : "Adaugă în coș"}
        </button>
      </div>
    </div>
  );
}
