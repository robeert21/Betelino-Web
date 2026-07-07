import { getDb } from "@/db";
import { shopItems } from "@/db/schema";

export type ShopCategory = "gustari" | "bursa-bufet" | "suveniruri";

export const SHOP_CATEGORY_LABELS: Record<ShopCategory, string> = {
  gustari: "Gustări",
  "bursa-bufet": "Bursă la bufet",
  suveniruri: "Suveniruri",
};

export type ShopItem = {
  id: string;
  title: string;
  category: ShopCategory;
};

function isShopCategory(value: string): value is ShopCategory {
  return value in SHOP_CATEGORY_LABELS;
}

export async function getShopItems(): Promise<ShopItem[]> {
  const db = await getDb();
  const rows = await db.select().from(shopItems);

  return rows.map((row) => ({
    id: row.id,
    title: row.name,
    category: isShopCategory(row.category) ? row.category : "gustari",
  }));
}
