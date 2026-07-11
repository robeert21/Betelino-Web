"use client";

import { useEffect, useRef, useState } from "react";
import { cartLimitFor, useCart } from "./CartContext";
import { formatPrice } from "./format";
import type { ShopItem } from "./data";

const CONFIRM_DURATION = 1100;
const FOCUS_RING =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sage-deep";

export function ShopItemCard({ item }: { item: ShopItem }) {
  const { addToCart, getQuantity, getItemTotalQuantity } = useCart();
  const hasFlavors = !!item.flavors && item.flavors.length > 0;
  const [selectedFlavor, setSelectedFlavor] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [justAdded, setJustAdded] = useState(false);
  const inCartTotal = getItemTotalQuantity(item.id);
  const cartLimit = cartLimitFor(item);
  const room = Math.max(0, cartLimit - inCartTotal);
  const limitReached = room === 0;
  const dailyLimitReached = item.remainingToday !== null && item.remainingToday <= 0;
  const confirmTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setQuantity((q) => Math.min(q, Math.max(1, room)));
  }, [room]);

  useEffect(() => {
    return () => {
      if (confirmTimeout.current) clearTimeout(confirmTimeout.current);
    };
  }, []);

  const canAdd = !limitReached && (!hasFlavors || selectedFlavor !== null);

  function handleAdd() {
    if (!canAdd) return;
    addToCart(item, quantity, selectedFlavor);
    setQuantity(1);
    setJustAdded(true);
    if (confirmTimeout.current) clearTimeout(confirmTimeout.current);
    confirmTimeout.current = setTimeout(() => setJustAdded(false), CONFIRM_DURATION);
  }

  return (
    <div className="flex h-full flex-col gap-4 rounded-[16px] bg-soft-linen p-7 transition-transform duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-0.5">
      <div className="flex flex-col">
        <div className="flex items-baseline justify-between gap-3">
          <h2 className="text-xl font-semibold text-ink-umber">{item.title}</h2>
          <span className="shrink-0 text-sm font-semibold text-sage-deep">
            {formatPrice(item.cost)}
          </span>
        </div>

        {dailyLimitReached && inCartTotal === 0 && (
          <p className="pt-2 text-sm font-semibold text-signal-red">
            Ai atins limita zilnică pentru acest produs.
          </p>
        )}

        <div
          className="grid overflow-hidden transition-[grid-template-rows] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]"
          style={{ gridTemplateRows: inCartTotal > 0 ? "1fr" : "0fr" }}
        >
          <div className="min-h-0 overflow-hidden">
            <p
              className="pt-2 text-sm font-semibold text-sage-deep transition-opacity duration-200 ease-[cubic-bezier(0.16,1,0.3,1)]"
              style={{ opacity: inCartTotal > 0 ? 1 : 0 }}
            >
              {inCartTotal}/{cartLimit} în coș
              {limitReached && " · limită atinsă"}
            </p>
          </div>
        </div>
      </div>

      {hasFlavors && (
        <div className="flex flex-wrap gap-2" role="radiogroup" aria-label={`Aromă pentru ${item.title}`}>
          {item.flavors!.map((flavor) => {
            const active = selectedFlavor === flavor;
            const flavorCount = getQuantity(item.id, flavor);
            return (
              <button
                key={flavor}
                type="button"
                role="radio"
                aria-checked={active}
                onClick={() => setSelectedFlavor(flavor)}
                className={`relative rounded-full border px-3.5 py-2 text-sm font-medium transition-[background-color,color,border-color,transform] duration-150 ease-[cubic-bezier(0.16,1,0.3,1)] active:scale-95 ${FOCUS_RING} ${
                  active
                    ? "border-transparent bg-sage-deep text-warm-cream"
                    : "border-border-sand bg-warm-cream text-ink-umber hover:border-sage-deep/50"
                }`}
              >
                {flavor}
                {flavorCount > 0 && (
                  <span
                    className={`ml-1.5 tabular-nums ${active ? "text-warm-cream/75" : "text-sage-deep"}`}
                  >
                    · {flavorCount}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}

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
            disabled={limitReached || quantity >= room}
            onClick={() => setQuantity((q) => Math.min(room, q + 1))}
            aria-label={`Crește cantitatea pentru ${item.title}`}
            className={`px-3.5 py-2.5 text-base font-semibold text-ink-umber transition-transform duration-150 ease-[cubic-bezier(0.16,1,0.3,1)] active:scale-90 disabled:opacity-40 ${FOCUS_RING}`}
          >
            +
          </button>
        </div>

        <button
          type="button"
          onClick={handleAdd}
          disabled={!canAdd}
          aria-live="polite"
          className={`flex-1 rounded-full border px-5 py-3.5 text-base font-semibold transition-[background-color,color,border-color,transform] duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] active:scale-[0.98] disabled:cursor-not-allowed disabled:border-transparent disabled:bg-border-sand disabled:text-ink-umber-soft disabled:active:scale-100 ${FOCUS_RING} ${
            justAdded
              ? "border-sage-trust bg-warm-cream text-sage-deep"
              : "border-transparent bg-amber-glow text-ink-umber hover:bg-amber-deep"
          }`}
        >
          {justAdded
            ? "Adăugat ✓"
            : dailyLimitReached
              ? "Limită zilnică atinsă"
              : limitReached
                ? `Limită atinsă (${cartLimit})`
                : hasFlavors && !selectedFlavor
                  ? "Alege o aromă"
                  : "Adaugă în coș"}
        </button>
      </div>
    </div>
  );
}
