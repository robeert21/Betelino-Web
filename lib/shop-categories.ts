export type ShopCategory =
  | "chipsuri-snacks"
  | "dulciuri-gumate"
  | "ciocolata-batoane"
  | "biscuiti-napolitane"
  | "porumb-dulce"
  | "bauturi"
  | "guma-menta"
  | "igiena";

export const SHOP_CATEGORY_LABELS: Record<ShopCategory, string> = {
  "chipsuri-snacks": "Chipsuri & Snacks sărate",
  "dulciuri-gumate": "Dulciuri gumate",
  "ciocolata-batoane": "Ciocolată & Batoane",
  "biscuiti-napolitane": "Biscuiți & Napolitane",
  "porumb-dulce": "Porumb dulce",
  bauturi: "Băuturi",
  "guma-menta": "Gumă & Mentă",
  igiena: "Igienă",
};

export const SHOP_CATEGORY_ORDER: ShopCategory[] = [
  "chipsuri-snacks",
  "dulciuri-gumate",
  "ciocolata-batoane",
  "biscuiti-napolitane",
  "porumb-dulce",
  "bauturi",
  "guma-menta",
  "igiena",
];

export function isShopCategory(value: string): value is ShopCategory {
  return value in SHOP_CATEGORY_LABELS;
}
