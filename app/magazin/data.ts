import { and, eq, gte, ne } from "drizzle-orm";
import { getDb } from "@/db";
import { shopItems, shopRequestItems, shopRequests } from "@/db/schema";
import { isShopCategory } from "@/lib/shop-categories";
import type { ShopItem, ShopItemFlavor } from "./shop-item";

export {
  type ShopCategory,
  SHOP_CATEGORY_LABELS,
  SHOP_CATEGORY_ORDER,
} from "@/lib/shop-categories";

export { type ShopItem, type ShopItemFlavor, flavorCost } from "./shop-item";

function parseFlavors(raw: string | null): ShopItemFlavor[] | null {
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) return null;
    return parsed.every(
      (entry) =>
        entry &&
        typeof entry === "object" &&
        typeof entry.name === "string" &&
        typeof entry.cost === "number",
    )
      ? parsed
      : null;
  } catch {
    return null;
  }
}

function startOfTodayUTC(): Date {
  const start = new Date();
  start.setUTCHours(0, 0, 0, 0);
  return start;
}

export async function getShopItems(userId?: string): Promise<ShopItem[]> {
  const db = await getDb();
  const rows = await db.select().from(shopItems);

  const orderedTodayByItemId = new Map<string, number>();
  if (userId) {
    const todayRows = await db
      .select({
        itemId: shopRequestItems.itemId,
        quantity: shopRequestItems.quantity,
      })
      .from(shopRequestItems)
      .innerJoin(shopRequests, eq(shopRequestItems.shopRequestId, shopRequests.id))
      .where(
        and(
          eq(shopRequests.userId, userId),
          ne(shopRequests.status, "REJECTED"),
          gte(shopRequests.createdAt, startOfTodayUTC()),
        ),
      );
    for (const row of todayRows) {
      orderedTodayByItemId.set(
        row.itemId,
        (orderedTodayByItemId.get(row.itemId) ?? 0) + row.quantity,
      );
    }
  }

  return rows.map((row) => {
    const dailyLimit = row.dailyLimit;
    const orderedToday = orderedTodayByItemId.get(row.id) ?? 0;
    return {
      id: row.id,
      title: row.name,
      category: isShopCategory(row.category) ? row.category : "chipsuri-snacks",
      flavors: parseFlavors(row.flavors),
      cost: row.cost,
      dailyLimit,
      remainingToday: dailyLimit == null ? null : Math.max(0, dailyLimit - orderedToday),
    };
  });
}
