"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import type { ShopItem } from "./data";

type CartLine = {
  item: ShopItem;
  quantity: number;
};

type CartContextValue = {
  lines: CartLine[];
  totalItems: number;
  getQuantity: (itemId: string) => number;
  addToCart: (item: ShopItem, quantity: number) => void;
  removeFromCart: (itemId: string) => void;
  setQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [linesById, setLinesById] = useState<Record<string, CartLine>>({});

  const addToCart = useCallback((item: ShopItem, quantity: number) => {
    if (quantity <= 0) return;
    setLinesById((current) => {
      const existingQuantity = current[item.id]?.quantity ?? 0;
      const nextQuantity = existingQuantity + quantity;
      return { ...current, [item.id]: { item, quantity: nextQuantity } };
    });
  }, []);

  const removeFromCart = useCallback((itemId: string) => {
    setLinesById((current) => {
      const next = { ...current };
      delete next[itemId];
      return next;
    });
  }, []);

  const setQuantity = useCallback((itemId: string, quantity: number) => {
    setLinesById((current) => {
      const existing = current[itemId];
      if (!existing) return current;
      if (quantity <= 0) {
        const next = { ...current };
        delete next[itemId];
        return next;
      }
      return { ...current, [itemId]: { ...existing, quantity } };
    });
  }, []);

  const clearCart = useCallback(() => setLinesById({}), []);

  const lines = useMemo(() => Object.values(linesById), [linesById]);
  const totalItems = useMemo(
    () => lines.reduce((sum, line) => sum + line.quantity, 0),
    [lines],
  );
  const getQuantity = useCallback(
    (itemId: string) => linesById[itemId]?.quantity ?? 0,
    [linesById],
  );

  const value = useMemo(
    () => ({
      lines,
      totalItems,
      getQuantity,
      addToCart,
      removeFromCart,
      setQuantity,
      clearCart,
    }),
    [lines, totalItems, getQuantity, addToCart, removeFromCart, setQuantity, clearCart],
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
