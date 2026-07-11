import type { ShopCategory } from "@/lib/shop-categories";

export type ShopItemFlavor = {
  name: string;
  // Price in bani (1 leu = 100 bani) for this specific variant — variants of
  // the same product can be priced differently (e.g. different bottle sizes).
  cost: number;
};

export type ShopItem = {
  id: string;
  title: string;
  category: ShopCategory;
  flavors: ShopItemFlavor[] | null;
  // Price in bani (1 leu = 100 bani). Display fallback when no flavor is
  // selected; use flavorCost() for the price of a specific selection.
  cost: number;
  dailyLimit: number | null;
  // How many of this item the camper can still order today, given
  // dailyLimit and what they already ordered (any non-rejected request
  // counts, immediately, so pending requests reserve their share too).
  // Null when the item has no daily limit. Always equals dailyLimit
  // (nothing consumed yet) when called without a userId.
  remainingToday: number | null;
};

// Resolves the price (in bani) of a specific flavor selection, falling back
// to the item's base cost when the item has no flavors or the flavor isn't
// found (e.g. catalog changed after an order was placed).
export function flavorCost(item: ShopItem, flavor: string | null): number {
  if (!flavor || !item.flavors) return item.cost;
  return item.flavors.find((f) => f.name === flavor)?.cost ?? item.cost;
}
