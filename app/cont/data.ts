import { and, desc, eq, inArray, ne } from "drizzle-orm";
import { getDb } from "@/db";
import { users, teams, pointLogs, shopRequests, shopRequestItems, shopItems, fines } from "@/db/schema";
import { resolveOrderedCost } from "@/app/magazin/shop-item";

export type CamperAccount = {
  fullName: string;
  username: string | null;
  email: string | null;
  teamName: string;
  individualPoints: number;
  teamPoints: number;
  role: string;
  cabin: number | null;
};

export async function getCamperAccount(
  userId: string,
): Promise<CamperAccount | null> {
  const db = await getDb();
  const [row] = await db
    .select({
      name: users.name,
      username: users.username,
      email: users.email,
      points: users.points,
      teamName: teams.name,
      teamPoints: teams.currentPoints,
      role: users.role,
      cabin: users.cabin,
    })
    .from(users)
    .leftJoin(teams, eq(users.teamId, teams.id))
    .where(eq(users.id, userId))
    .limit(1);

  if (!row) return null;

  return {
    fullName: row.name,
    username: row.username,
    email: row.email,
    teamName: row.teamName ?? "Neatribuită încă",
    individualPoints: row.points,
    teamPoints: row.teamPoints ?? 0,
    role: row.role,
    cabin: row.cabin,
  };
}

// The leader (STAFF/CALAUZA/ADMIN) assigned to a given cabin, for showing a
// camper who their cabin leader is on their own account page.
export async function getCabinLeaderName(cabin: number): Promise<string | null> {
  const db = await getDb();
  const [row] = await db
    .select({ name: users.name })
    .from(users)
    .where(and(eq(users.cabin, cabin), inArray(users.role, ["STAFF", "ADMIN", "CALAUZA"])))
    .limit(1);

  return row?.name ?? null;
}

export type CabinRosterEntry = {
  id: string;
  name: string;
};

// The kids (role CAMPER) sharing a leader's cabin, for the "Copii" section
// of a leader's own account page.
export async function getCabinRoster(cabin: number): Promise<CabinRosterEntry[]> {
  const db = await getDb();
  const rows = await db
    .select({ id: users.id, name: users.name })
    .from(users)
    .where(and(eq(users.cabin, cabin), eq(users.role, "CAMPER")))
    .orderBy(users.name);

  return rows;
}

export type IndividualPointLogEntry = {
  id: string;
  amount: number;
  reason: string | null;
  createdAt: Date;
};

// The camper's own history of individually-attributed point awards (points
// a leader gave specifically to them, not to the whole team).
export async function getCamperPointLogs(
  userId: string,
  limit = 20,
): Promise<IndividualPointLogEntry[]> {
  const db = await getDb();
  const rows = await db
    .select({
      id: pointLogs.id,
      amount: pointLogs.amount,
      reason: pointLogs.reason,
      createdAt: pointLogs.createdAt,
    })
    .from(pointLogs)
    .where(eq(pointLogs.userId, userId))
    .orderBy(desc(pointLogs.createdAt))
    .limit(limit);

  return rows;
}

export type CamperFineEntry = {
  id: string;
  reason: string;
  amount: number;
  createdAt: Date;
  paidAt: Date | null;
};

// The camper's own fines, most recent first — shown alongside paid status
// in their account so they know what they owe.
export async function getCamperFines(userId: string): Promise<CamperFineEntry[]> {
  const db = await getDb();
  const rows = await db
    .select({
      id: fines.id,
      reason: fines.reason,
      amount: fines.amount,
      createdAt: fines.createdAt,
      paidAt: fines.paidAt,
    })
    .from(fines)
    .where(eq(fines.userId, userId))
    .orderBy(desc(fines.createdAt));

  return rows;
}

export type CamperShopOrderLine = {
  id: string;
  itemTitle: string;
  itemFlavor: string | null;
  quantity: number;
  unitCost: number;
  lineTotal: number;
};

export type CamperShopOrder = {
  id: string;
  status: string;
  note: string | null;
  createdAt: Date;
  items: CamperShopOrderLine[];
  total: number;
};

// The camper's own active shop request history (excludes DELIVERED — once
// an order is handed over there's nothing left to track), with the current
// catalog price (shop_items.cost) applied per line — request items don't
// snapshot a price since the shop has none yet, so totals reflect prices as
// they stand today and will update once prices are added.
export async function getCamperShopOrders(
  userId: string,
): Promise<CamperShopOrder[]> {
  const db = await getDb();
  const requests = await db
    .select({
      id: shopRequests.id,
      status: shopRequests.status,
      note: shopRequests.note,
      createdAt: shopRequests.createdAt,
    })
    .from(shopRequests)
    .where(and(eq(shopRequests.userId, userId), ne(shopRequests.status, "DELIVERED")))
    .orderBy(desc(shopRequests.createdAt));

  if (requests.length === 0) return [];

  const items = await db
    .select({
      shopRequestId: shopRequestItems.shopRequestId,
      id: shopRequestItems.id,
      itemTitle: shopRequestItems.itemTitle,
      itemFlavor: shopRequestItems.itemFlavor,
      quantity: shopRequestItems.quantity,
      baseCost: shopItems.cost,
      flavorsRaw: shopItems.flavors,
    })
    .from(shopRequestItems)
    .leftJoin(shopItems, eq(shopRequestItems.itemId, shopItems.id))
    .where(
      inArray(
        shopRequestItems.shopRequestId,
        requests.map((request) => request.id),
      ),
    );

  const itemsByRequestId = new Map<string, CamperShopOrderLine[]>();
  for (const item of items) {
    const unitCost = resolveOrderedCost(item.baseCost ?? 0, item.flavorsRaw, item.itemFlavor);
    const list = itemsByRequestId.get(item.shopRequestId) ?? [];
    list.push({
      id: item.id,
      itemTitle: item.itemTitle,
      itemFlavor: item.itemFlavor,
      quantity: item.quantity,
      unitCost,
      lineTotal: unitCost * item.quantity,
    });
    itemsByRequestId.set(item.shopRequestId, list);
  }

  return requests.map((request) => {
    const requestItems = itemsByRequestId.get(request.id) ?? [];
    return {
      id: request.id,
      status: request.status,
      note: request.note,
      createdAt: request.createdAt,
      items: requestItems,
      total: requestItems.reduce((sum, item) => sum + item.lineTotal, 0),
    };
  });
}
