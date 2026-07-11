import { and, eq, gte, ne } from "drizzle-orm";
import { getDb } from "@/db";
import { shopItems, shopRequestItems, shopRequests } from "@/db/schema";
import { isShopCategory, type ShopCategory } from "@/lib/shop-categories";

export {
  type ShopCategory,
  SHOP_CATEGORY_LABELS,
  SHOP_CATEGORY_ORDER,
} from "@/lib/shop-categories";

export type ShopItem = {
  id: string;
  title: string;
  category: ShopCategory;
  flavors: string[] | null;
  // Price in bani (1 leu = 100 bani), for display only.
  cost: number;
  dailyLimit: number | null;
  // How many of this item the camper can still order today, given
  // dailyLimit and what they already ordered (any non-rejected request
  // counts, immediately, so pending requests reserve their share too).
  // Null when the item has no daily limit. Always equals dailyLimit
  // (nothing consumed yet) when called without a userId.
  remainingToday: number | null;
};

function parseFlavors(raw: string | null): string[] | null {
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : null;
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
