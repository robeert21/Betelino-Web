"use server";

import { revalidatePath } from "next/cache";
import { getDb } from "@/db";
import { shopRequests, shopRequestItems } from "@/db/schema";
import { getCurrentUser } from "@/lib/auth";
import { getShopItems } from "./data";

export type CartLineInput = {
  itemId: string;
  quantity: number;
};

export async function submitShopCart(
  cartLines: CartLineInput[],
): Promise<{ success: boolean; error?: string }> {
  const user = await getCurrentUser();
  if (!user) {
    return { success: false, error: "Trebuie să fii autentificat." };
  }

  const validLines = cartLines.filter((line) => line.quantity > 0);
  if (validLines.length === 0) {
    return { success: false, error: "Coșul este gol." };
  }

  const items = await getShopItems();
  const itemsById = new Map(items.map((item) => [item.id, item]));

  for (const line of validLines) {
    const item = itemsById.get(line.itemId);
    if (!item) {
      return { success: false, error: "Un obiect din coș nu a fost găsit." };
    }
  }

  const db = await getDb();
  const [request] = await db
    .insert(shopRequests)
    .values({ userId: user.id })
    .returning({ id: shopRequests.id });

  await db.insert(shopRequestItems).values(
    validLines.map((line) => {
      const item = itemsById.get(line.itemId)!;
      return {
        shopRequestId: request.id,
        itemId: item.id,
        itemTitle: item.title,
        quantity: line.quantity,
      };
    }),
  );

  revalidatePath("/dashboard/solicitari");
  return { success: true };
}
