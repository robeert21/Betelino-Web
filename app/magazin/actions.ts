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
): Promise<{ success: boolean; error?: string; warning?: string }> {
  const user = await getCurrentUser();
  if (!user) {
    return { success: false, error: "Trebuie să fii autentificat." };
  }

  const trimmedNote = note?.trim() || null;
  let validLines = cartLines.filter((line) => line.quantity > 0);
  if (validLines.length === 0 && !trimmedNote) {
    return { success: false, error: "Coșul este gol." };
  }

  // Fetched with the camper's id so item.remainingToday reflects what
  // they've already ordered today (authoritative — never trust the
  // client's view of the daily limit).
  const items = await getShopItems(user.id);
  const itemsById = new Map(items.map((item) => [item.id, item]));

  for (const line of validLines) {
    const item = itemsById.get(line.itemId);
    if (!item) {
      return { success: false, error: "Un obiect din coș nu a fost găsit." };
    }
    if (item.flavors && item.flavors.length > 0) {
      if (!line.flavor || !item.flavors.some((f) => f.name === line.flavor)) {
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

  // Cap (or fully drop) lines for items where the daily limit has been
  // reached, so the rest of the cart still goes through — only the
  // maxed-out products get excluded, not the whole request.
  const droppedItemTitles: string[] = [];
  const cappedItemTitles: string[] = [];
  const remainingByItemId = new Map(
    items.filter((item) => item.remainingToday !== null).map((item) => [item.id, item.remainingToday!]),
  );
  if (remainingByItemId.size > 0) {
    validLines = validLines.flatMap((line) => {
      const remaining = remainingByItemId.get(line.itemId);
      if (remaining === undefined) return [line];
      const item = itemsById.get(line.itemId)!;
      if (remaining <= 0) {
        if (!droppedItemTitles.includes(item.title)) droppedItemTitles.push(item.title);
        return [];
      }
      if (line.quantity > remaining) {
        if (!cappedItemTitles.includes(item.title)) cappedItemTitles.push(item.title);
        remainingByItemId.set(line.itemId, 0);
        return [{ ...line, quantity: remaining }];
      }
      remainingByItemId.set(line.itemId, remaining - line.quantity);
      return [line];
    });
  }

  if (validLines.length === 0 && !trimmedNote) {
    return {
      success: false,
      error: "Ai atins limita zilnică pentru toate produsele din coș.",
    };
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

  const warningParts: string[] = [];
  if (droppedItemTitles.length > 0) {
    warningParts.push(
      `Ai atins limita zilnică pentru: ${droppedItemTitles.join(", ")} — ${
        droppedItemTitles.length === 1 ? "nu a fost inclus" : "nu au fost incluse"
      } în cerere.`,
    );
  }
  if (cappedItemTitles.length > 0) {
    warningParts.push(
      `Cantitatea a fost redusă la limita zilnică pentru: ${cappedItemTitles.join(", ")}.`,
    );
  }

  return { success: true, warning: warningParts.length > 0 ? warningParts.join(" ") : undefined };
}
