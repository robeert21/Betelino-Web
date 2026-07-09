import { getDb } from "@/db";
import { shopItems } from "@/db/schema";

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

export type ShopItem = {
  id: string;
  title: string;
  category: ShopCategory;
  flavors: string[] | null;
};

function isShopCategory(value: string): value is ShopCategory {
  return value in SHOP_CATEGORY_LABELS;
}

function parseFlavors(raw: string | null): string[] | null {
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : null;
  } catch {
    return null;
  }
}

export async function getShopItems(): Promise<ShopItem[]> {
  const db = await getDb();
  const rows = await db.select().from(shopItems);

  return rows.map((row) => ({
    id: row.id,
    title: row.name,
    category: isShopCategory(row.category) ? row.category : "chipsuri-snacks",
    flavors: parseFlavors(row.flavors),
  }));
}
