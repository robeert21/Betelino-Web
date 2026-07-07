"use client";

import { useState, useTransition } from "react";
import { useCart } from "./CartContext";
import { submitShopCart } from "./actions";

export function CartPanel() {
  const { lines, totalItems, setQuantity, removeFromCart, clearCart } = useCart();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  if (totalItems === 0 && !sent) return null;

  function handleSubmit() {
    setError(null);
    startTransition(async () => {
      const result = await submitShopCart(
        lines.map((line) => ({ itemId: line.item.id, quantity: line.quantity })),
      );
      if (result.success) {
        clearCart();
        setSent(true);
      } else {
        setError(result.error ?? "A apărut o eroare.");
      }
    });
  }

  return (
    <div className="animate-fade-in sticky bottom-6 z-10 mt-12 rounded-[16px] border border-border-sand bg-warm-cream p-6 shadow-lg">
      {sent ? (
        <div className="flex items-center justify-between gap-4">
          <p className="text-sm font-semibold text-sage-deep">
            Cererea a fost trimisă către instructori.
          </p>
          <button
            type="button"
            onClick={() => setSent(false)}
            className="rounded-full bg-border-sand px-4 py-2 text-xs font-semibold text-ink-umber hover:bg-soft-linen"
          >
            Închide
          </button>
        </div>
      ) : (
        <>
          <h2 className="font-display text-base font-medium text-ink-umber">
            Coșul tău ({totalItems} {totalItems === 1 ? "obiect" : "obiecte"})
          </h2>

          <div className="mt-4 flex flex-col gap-3">
            {lines.map((line) => (
              <div key={line.item.id} className="flex items-center justify-between gap-4">
                <p className="text-sm text-ink-umber">{line.item.title}</p>
                <div className="flex items-center gap-3">
                  <div className="flex items-center rounded-full border border-border-sand">
                    <button
                      type="button"
                      onClick={() => setQuantity(line.item.id, line.quantity - 1)}
                      className="px-2.5 py-1.5 text-sm font-semibold text-ink-umber"
                    >
                      −
                    </button>
                    <span className="min-w-[1.5rem] text-center text-sm tabular-nums text-ink-umber">
                      {line.quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => setQuantity(line.item.id, line.quantity + 1)}
                      className="px-2.5 py-1.5 text-sm font-semibold text-ink-umber disabled:opacity-40"
                    >
                      +
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeFromCart(line.item.id)}
                    className="text-xs font-semibold text-signal-red"
                  >
                    Șterge
                  </button>
                </div>
              </div>
            ))}
          </div>

          {error && <p className="mt-3 text-xs text-signal-red">{error}</p>}

          <button
            type="button"
            disabled={isPending}
            onClick={handleSubmit}
            className="mt-5 w-full rounded-full bg-amber-glow px-6 py-3 text-sm font-semibold text-ink-umber transition-[background-color,transform] duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] hover:bg-amber-deep active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isPending ? "Se trimite…" : "Trimite cererea"}
          </button>
        </>
      )}
    </div>
  );
}
