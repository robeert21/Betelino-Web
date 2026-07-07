"use client";

import { useState } from "react";
import { useCart } from "./CartContext";
import type { ShopItem } from "./data";

export function ShopItemCard({ item }: { item: ShopItem }) {
  const { addToCart, getQuantity } = useCart();
  const [quantity, setQuantity] = useState(1);
  const outOfStock = item.availableStock === 0;
  const inCart = getQuantity(item.id);
  const remaining = item.availableStock - inCart;

  function handleAdd() {
    addToCart(item, quantity);
    setQuantity(1);
  }

  return (
    <div className="flex h-full flex-col gap-4 rounded-[14px] bg-soft-linen p-6 transition-transform duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-0.5">
      <div className="flex items-start justify-between gap-3">
        <h2 className="text-lg font-semibold text-ink-umber">{item.title}</h2>
        <span
          className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${
            outOfStock ? "text-signal-red" : "text-sage-deep"
          }`}
        >
          {outOfStock ? "Stoc epuizat" : `${item.availableStock} în stoc`}
        </span>
      </div>

      {inCart > 0 && (
        <p className="text-xs font-semibold text-sage-deep">
          {inCart} în coș
        </p>
      )}

      <div className="mt-auto flex items-center gap-3">
        <div className="flex items-center rounded-full border border-border-sand">
          <button
            type="button"
            disabled={outOfStock || quantity <= 1}
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            className="px-3 py-2 text-sm font-semibold text-ink-umber disabled:opacity-40"
          >
            −
          </button>
          <span className="min-w-[1.5rem] text-center text-sm tabular-nums text-ink-umber">
            {quantity}
          </span>
          <button
            type="button"
            disabled={outOfStock || quantity >= remaining}
            onClick={() => setQuantity((q) => Math.min(remaining, q + 1))}
            className="px-3 py-2 text-sm font-semibold text-ink-umber disabled:opacity-40"
          >
            +
          </button>
        </div>

        <button
          type="button"
          disabled={outOfStock || remaining <= 0}
          onClick={handleAdd}
          className="flex-1 rounded-full bg-amber-glow px-5 py-3 text-sm font-semibold text-ink-umber transition-[background-color,transform] duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] hover:bg-amber-deep active:scale-[0.98] disabled:cursor-not-allowed disabled:bg-border-sand disabled:text-ink-umber-soft disabled:active:scale-100"
        >
          {outOfStock ? "Indisponibil" : remaining <= 0 ? "Tot în coș" : "Adaugă în coș"}
        </button>
      </div>
    </div>
  );
}
