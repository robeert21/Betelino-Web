"use client";

import { useState } from "react";
import { useCart } from "./CartContext";
import type { ShopItem } from "./data";

export function ShopItemCard({ item }: { item: ShopItem }) {
  const { addToCart, getQuantity } = useCart();
  const [quantity, setQuantity] = useState(1);
  const inCart = getQuantity(item.id);

  function handleAdd() {
    addToCart(item, quantity);
    setQuantity(1);
  }

  return (
    <div className="flex h-full flex-col gap-4 rounded-[16px] bg-soft-linen p-7 transition-transform duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-0.5">
      <h2 className="text-xl font-semibold text-ink-umber">{item.title}</h2>

      {inCart > 0 && (
        <p className="text-sm font-semibold text-sage-deep">
          {inCart} în coș
        </p>
      )}

      <div className="mt-auto flex items-center gap-3">
        <div className="flex items-center rounded-full border border-border-sand">
          <button
            type="button"
            disabled={quantity <= 1}
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            className="px-3.5 py-2.5 text-base font-semibold text-ink-umber disabled:opacity-40"
          >
            −
          </button>
          <span className="min-w-[1.75rem] text-center text-base tabular-nums text-ink-umber">
            {quantity}
          </span>
          <button
            type="button"
            onClick={() => setQuantity((q) => q + 1)}
            className="px-3.5 py-2.5 text-base font-semibold text-ink-umber disabled:opacity-40"
          >
            +
          </button>
        </div>

        <button
          type="button"
          onClick={handleAdd}
          className="flex-1 rounded-full bg-amber-glow px-5 py-3.5 text-base font-semibold text-ink-umber transition-[background-color,transform] duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] hover:bg-amber-deep active:scale-[0.98] disabled:cursor-not-allowed disabled:bg-border-sand disabled:text-ink-umber-soft disabled:active:scale-100"
        >
          Adaugă în coș
        </button>
      </div>
    </div>
  );
}
