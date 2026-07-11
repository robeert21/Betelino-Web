"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { cartLimitFor, useCart } from "./CartContext";
import { formatPrice } from "./format";
import { submitShopCart } from "./actions";

const PANEL_EXIT_DURATION = 220;
const LINE_EXIT_DURATION = 180;
const FOCUS_RING =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sage-deep";

export function CartPanel() {
  const {
    lines,
    totalItems,
    totalCost,
    note,
    setNote,
    setQuantity,
    removeFromCart,
    clearCart,
    getItemTotalQuantity,
  } = useCart();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [warning, setWarning] = useState<string | null>(null);
  const [sent, setSent] = useState(false);
  const [removingId, setRemovingId] = useState<string | null>(null);
  const shouldShow = totalItems > 0 || sent;
  const [mounted, setMounted] = useState(shouldShow);
  const [closing, setClosing] = useState(false);
  const panelExitTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lineExitTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (shouldShow) {
      if (panelExitTimeout.current) clearTimeout(panelExitTimeout.current);
      setClosing(false);
      setMounted(true);
      return;
    }
    if (mounted) {
      setClosing(true);
      panelExitTimeout.current = setTimeout(() => {
        setMounted(false);
        setClosing(false);
      }, PANEL_EXIT_DURATION);
    }
    return () => {
      if (panelExitTimeout.current) clearTimeout(panelExitTimeout.current);
    };
  }, [shouldShow, mounted]);

  useEffect(() => {
    return () => {
      if (lineExitTimeout.current) clearTimeout(lineExitTimeout.current);
    };
  }, []);

  if (!mounted) return null;

  function lineKey(itemId: string, flavor: string | null) {
    return flavor ? `${itemId}::${flavor}` : itemId;
  }

  function handleRemove(itemId: string, flavor: string | null) {
    setRemovingId(lineKey(itemId, flavor));
    if (lineExitTimeout.current) clearTimeout(lineExitTimeout.current);
    lineExitTimeout.current = setTimeout(() => {
      removeFromCart(itemId, flavor);
      setRemovingId(null);
    }, LINE_EXIT_DURATION);
  }

  function handleDecrement(itemId: string, quantity: number, flavor: string | null) {
    if (quantity <= 1) {
      handleRemove(itemId, flavor);
    } else {
      setQuantity(itemId, quantity - 1, flavor);
    }
  }

  function handleSubmit() {
    setError(null);
    setWarning(null);
    startTransition(async () => {
      const result = await submitShopCart(
        lines.map((line) => ({
          itemId: line.item.id,
          quantity: line.quantity,
          flavor: line.flavor,
        })),
        note,
      );
      if (result.success) {
        clearCart();
        setWarning(result.warning ?? null);
        setSent(true);
      } else {
        setError(result.error ?? "A apărut o eroare.");
      }
    });
  }

  return (
    <div
      className={`sticky bottom-6 z-10 mt-12 rounded-[16px] border border-border-sand bg-warm-cream p-6 shadow-lg transition-[opacity,transform] duration-[220ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${
        closing ? "translate-y-2 opacity-0" : "translate-y-0 opacity-100"
      }`}
    >
      <div key={sent ? "sent" : "cart"} className="animate-fade-in">
        {sent ? (
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-sage-deep">
                Cererea a fost trimisă către lideri.
              </p>
              {warning && (
                <p className="mt-1.5 text-xs text-signal-red">{warning}</p>
              )}
            </div>
            <button
              type="button"
              onClick={() => setSent(false)}
              className={`rounded-full bg-border-sand px-4 py-2 text-xs font-semibold text-ink-umber transition-colors duration-150 ease-[cubic-bezier(0.16,1,0.3,1)] hover:bg-soft-linen ${FOCUS_RING}`}
            >
              Închide
            </button>
          </div>
        ) : (
          <>
            <div className="flex items-baseline justify-between gap-4">
              <h2 className="font-display text-base font-medium text-ink-umber">
                Coșul tău ({totalItems} {totalItems === 1 ? "obiect" : "obiecte"})
              </h2>
              <p className="text-base font-semibold text-sage-deep">{formatPrice(totalCost)}</p>
            </div>

            <div className="mt-4 flex flex-col gap-3">
              {lines.map((line) => {
                const key = lineKey(line.item.id, line.flavor);
                const label = line.flavor
                  ? `${line.item.title} — ${line.flavor}`
                  : line.item.title;
                return (
                  <div
                    key={key}
                    className={`flex items-center justify-between gap-4 transition-[opacity,transform] duration-150 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                      removingId === key ? "-translate-x-2 opacity-0" : "translate-x-0 opacity-100"
                    }`}
                  >
                    <p className="text-sm text-ink-umber">
                      {line.item.title}
                      {line.flavor && (
                        <span className="text-ink-umber-soft"> — {line.flavor}</span>
                      )}
                      <span className="text-ink-umber-soft">
                        {" "}
                        · {formatPrice(line.item.cost * line.quantity)}
                      </span>
                    </p>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center rounded-full border border-border-sand">
                        <button
                          type="button"
                          disabled={isPending}
                          onClick={() => handleDecrement(line.item.id, line.quantity, line.flavor)}
                          aria-label={`Scade cantitatea pentru ${label}`}
                          className={`px-2.5 py-1.5 text-sm font-semibold text-ink-umber transition-transform duration-150 ease-[cubic-bezier(0.16,1,0.3,1)] active:scale-90 disabled:opacity-40 ${FOCUS_RING}`}
                        >
                          −
                        </button>
                        <span className="min-w-[1.5rem] text-center text-sm tabular-nums text-ink-umber">
                          {line.quantity}
                        </span>
                        <button
                          type="button"
                          disabled={
                            isPending ||
                            getItemTotalQuantity(line.item.id) >= cartLimitFor(line.item)
                          }
                          onClick={() => setQuantity(line.item.id, line.quantity + 1, line.flavor)}
                          aria-label={`Crește cantitatea pentru ${label}`}
                          className={`px-2.5 py-1.5 text-sm font-semibold text-ink-umber transition-transform duration-150 ease-[cubic-bezier(0.16,1,0.3,1)] active:scale-90 disabled:opacity-40 ${FOCUS_RING}`}
                        >
                          +
                        </button>
                      </div>
                      <button
                        type="button"
                        disabled={isPending}
                        onClick={() => handleRemove(line.item.id, line.flavor)}
                        aria-label={`Șterge ${label} din coș`}
                        className={`text-xs font-semibold text-signal-red transition-opacity duration-150 hover:opacity-70 disabled:opacity-40 ${FOCUS_RING}`}
                      >
                        Șterge
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-5">
              <label
                htmlFor="cart-special-note"
                className="text-sm font-medium text-ink-umber"
              >
                Produse speciale
              </label>
              <p className="mt-1 text-xs text-ink-umber-soft">
                Ai nevoie de altceva din magazin sau de la farmacie? Scrie aici.
              </p>
              <textarea
                id="cart-special-note"
                value={note}
                onChange={(event) => setNote(event.target.value)}
                disabled={isPending}
                rows={2}
                placeholder="ex: paracetamol, plasturi, alt produs din magazin..."
                className={`mt-2 w-full resize-none rounded-[12px] border border-border-sand bg-warm-cream px-4 py-3 text-sm text-ink-umber placeholder:text-ink-umber-soft/70 transition-colors duration-150 ease-[cubic-bezier(0.16,1,0.3,1)] disabled:opacity-60 ${FOCUS_RING}`}
              />
            </div>

            {error && (
              <p key={error} className="animate-fade-in mt-3 text-xs text-signal-red">
                {error}
              </p>
            )}

            <button
              type="button"
              disabled={isPending}
              onClick={handleSubmit}
              className={`mt-5 w-full rounded-full bg-amber-glow px-6 py-3.5 text-base font-semibold text-ink-umber transition-[background-color,transform] duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] hover:bg-amber-deep active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60 ${FOCUS_RING}`}
            >
              {isPending ? (
                <span className="inline-flex items-center justify-center gap-2">
                  <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-ink-umber/30 border-t-ink-umber" />
                  Se trimite…
                </span>
              ) : (
                "Trimite cererea"
              )}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
