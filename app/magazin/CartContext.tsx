"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import { flavorCost, type ShopItem } from "./shop-item";
import { MAX_QUANTITY_PER_ITEM } from "./constants";

type CartLine = {
  item: ShopItem;
  flavor: string | null;
  quantity: number;
};

function lineKey(itemId: string, flavor: string | null): string {
  return flavor ? `${itemId}::${flavor}` : itemId;
}

// Per-item cap for a single cart: the flat per-request ceiling, further
// narrowed by whatever's left of the item's daily limit (if any).
export function cartLimitFor(item: ShopItem): number {
  return item.remainingToday == null
    ? MAX_QUANTITY_PER_ITEM
    : Math.min(MAX_QUANTITY_PER_ITEM, item.remainingToday);
}

function itemTotalExcluding(
  lines: Record<string, CartLine>,
  itemId: string,
  excludeKey: string,
): number {
  return Object.entries(lines).reduce(
    (sum, [key, line]) => (key !== excludeKey && line.item.id === itemId ? sum + line.quantity : sum),
    0,
  );
}

type CartContextValue = {
  lines: CartLine[];
  totalItems: number;
  totalCost: number;
  note: string;
  setNote: (note: string) => void;
  getQuantity: (itemId: string, flavor?: string | null) => number;
  getItemTotalQuantity: (itemId: string) => number;
  addToCart: (item: ShopItem, quantity: number, flavor?: string | null) => void;
  removeFromCart: (itemId: string, flavor?: string | null) => void;
  setQuantity: (itemId: string, quantity: number, flavor?: string | null) => void;
  clearCart: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [linesByKey, setLinesByKey] = useState<Record<string, CartLine>>({});
  const [note, setNote] = useState("");

  const addToCart = useCallback(
    (item: ShopItem, quantity: number, flavor: string | null = null) => {
      if (quantity <= 0) return;
      const key = lineKey(item.id, flavor);
      setLinesByKey((current) => {
        const existingQuantity = current[key]?.quantity ?? 0;
        const otherFlavorsTotal = itemTotalExcluding(current, item.id, key);
        const room = Math.max(0, cartLimitFor(item) - otherFlavorsTotal - existingQuantity);
        const nextQuantity = existingQuantity + Math.min(quantity, room);
        if (nextQuantity === existingQuantity) return current;
        return { ...current, [key]: { item, flavor, quantity: nextQuantity } };
      });
    },
    [],
  );

  const removeFromCart = useCallback((itemId: string, flavor: string | null = null) => {
    const key = lineKey(itemId, flavor);
    setLinesByKey((current) => {
      const next = { ...current };
      delete next[key];
      return next;
    });
  }, []);

  const setQuantity = useCallback(
    (itemId: string, quantity: number, flavor: string | null = null) => {
      const key = lineKey(itemId, flavor);
      setLinesByKey((current) => {
        const existing = current[key];
        if (!existing) return current;
        if (quantity <= 0) {
          const next = { ...current };
          delete next[key];
          return next;
        }
        const otherFlavorsTotal = itemTotalExcluding(current, itemId, key);
        const cappedQuantity = Math.min(quantity, cartLimitFor(existing.item) - otherFlavorsTotal);
        if (cappedQuantity === existing.quantity) return current;
        return { ...current, [key]: { ...existing, quantity: cappedQuantity } };
      });
    },
    [],
  );

  const clearCart = useCallback(() => {
    setLinesByKey({});
    setNote("");
  }, []);

  const lines = useMemo(() => Object.values(linesByKey), [linesByKey]);
  const totalItems = useMemo(
    () => lines.reduce((sum, line) => sum + line.quantity, 0),
    [lines],
  );
  const totalCost = useMemo(
    () => lines.reduce((sum, line) => sum + flavorCost(line.item, line.flavor) * line.quantity, 0),
    [lines],
  );
  const getQuantity = useCallback(
    (itemId: string, flavor: string | null = null) =>
      linesByKey[lineKey(itemId, flavor)]?.quantity ?? 0,
    [linesByKey],
  );

  const getItemTotalQuantity = useCallback(
    (itemId: string) =>
      lines
        .filter((line) => line.item.id === itemId)
        .reduce((sum, line) => sum + line.quantity, 0),
    [lines],
  );

  const value = useMemo(
    () => ({
      lines,
      totalItems,
      totalCost,
      note,
      setNote,
      getQuantity,
      getItemTotalQuantity,
      addToCart,
      removeFromCart,
      setQuantity,
      clearCart,
    }),
    [
      lines,
      totalItems,
      totalCost,
      note,
      getQuantity,
      getItemTotalQuantity,
      addToCart,
      removeFromCart,
      setQuantity,
      clearCart,
    ],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart trebuie folosit în interiorul unui CartProvider.");
  }
  return context;
}
