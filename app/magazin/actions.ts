"use server";

import { revalidatePath } from "next/cache";
import { getDb } from "@/db";
import { shopRequests, shopRequestItems } from "@/db/schema";
import { getCurrentUser } from "@/lib/auth";
import { getShopItems } from "./data";
import { MAX_QUANTITY_PER_ITEM } from "./constants";

export type CartLineInput = {
  itemId: string;
  quantity: number;
  flavor: string | null;
};

export async function submitShopCart(
  cartLines: CartLineInput[],
  note?: string,
): Promise<{ success: boolean; error?: string }> {
  const user = await getCurrentUser();
  if (!user) {
    return { success: false, error: "Trebuie să fii autentificat." };
  }

  const trimmedNote = note?.trim() || null;
  const validLines = cartLines.filter((line) => line.quantity > 0);
  if (validLines.length === 0 && !trimmedNote) {
    return { success: false, error: "Coșul este gol." };
  }

  const items = await getShopItems();
  const itemsById = new Map(items.map((item) => [item.id, item]));

  for (const line of validLines) {
    const item = itemsById.get(line.itemId);
    if (!item) {
      return { success: false, error: "Un obiect din coș nu a fost găsit." };
    }
    if (item.flavors && item.flavors.length > 0) {
      if (!line.flavor || !item.flavors.includes(line.flavor)) {
        return { success: false, error: `Alege o aromă pentru ${item.title}.` };
      }
    }
  }

  const quantityByItemId = new Map<string, number>();
  for (const line of validLines) {
    quantityByItemId.set(line.itemId, (quantityByItemId.get(line.itemId) ?? 0) + line.quantity);
  }
  for (const [itemId, quantity] of quantityByItemId) {
    if (quantity > MAX_QUANTITY_PER_ITEM) {
      const item = itemsById.get(itemId)!;
      return {
        success: false,
        error: `Poți cere maximum ${MAX_QUANTITY_PER_ITEM} bucăți din "${item.title}".`,
      };
    }
  }

  const db = await getDb();
  const [request] = await db
    .insert(shopRequests)
    .values({ userId: user.id, note: trimmedNote })
    .returning({ id: shopRequests.id });

  if (validLines.length > 0) {
    await db.insert(shopRequestItems).values(
      validLines.map((line) => {
        const item = itemsById.get(line.itemId)!;
        return {
          shopRequestId: request.id,
          itemId: item.id,
          itemTitle: item.title,
          itemFlavor: line.flavor,
          quantity: line.quantity,
        };
      }),
    );
  }

  revalidatePath("/dashboard/solicitari");
  return { success: true };
}
