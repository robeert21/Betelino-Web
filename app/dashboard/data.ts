import { desc, eq, sql } from "drizzle-orm";
import { getDb } from "@/db";
import {
  teams,
  users,
  shopRequests,
  shopRequestItems,
  pointLogs,
} from "@/db/schema";

export type TeamWithPoints = {
  id: string;
  name: string;
  totalPoints: number;
  memberCount: number;
};

export async function getTeamsWithPoints(): Promise<TeamWithPoints[]> {
  const db = await getDb();
  const rows = await db
    .select({
      id: teams.id,
      name: teams.name,
      totalPoints: teams.currentPoints,
      memberCount: sql<number>`count(${users.id})`,
    })
    .from(teams)
    .leftJoin(users, eq(users.teamId, teams.id))
    .groupBy(teams.id)
    .orderBy(teams.name);

  return rows.map((row) => ({
    id: row.id,
    name: row.name,
    totalPoints: row.totalPoints,
    memberCount: Number(row.memberCount),
  }));
}

export async function getLeaderboardLastSyncedAt(): Promise<Date | null> {
  const db = await getDb();
  const [row] = await db
    .select({ syncedAt: teams.leaderboardSyncedAt })
    .from(teams)
    .orderBy(desc(teams.leaderboardSyncedAt))
    .limit(1);

  return row?.syncedAt ?? null;
}

export type MemberEntry = {
  id: string;
  name: string;
  email: string;
  role: string;
  points: number;
  teamId: string | null;
};

export async function getAllMembers(): Promise<MemberEntry[]> {
  const db = await getDb();
  const rows = await db.select().from(users).orderBy(users.name);

  return rows.map((user) => ({
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    points: user.points,
    teamId: user.teamId,
  }));
}

export type ShopRequestLine = {
  id: string;
  itemTitle: string;
  quantity: number;
};

export type ShopRequestEntry = {
  id: string;
  userName: string;
  userEmail: string;
  items: ShopRequestLine[];
  status: string;
  createdAt: Date;
};

export async function getShopRequests(limit = 100): Promise<ShopRequestEntry[]> {
  const db = await getDb();
  const requests = await db
    .select({
      id: shopRequests.id,
      status: shopRequests.status,
      createdAt: shopRequests.createdAt,
      userName: users.name,
      userEmail: users.email,
    })
    .from(shopRequests)
    .innerJoin(users, eq(shopRequests.userId, users.id))
    .orderBy(desc(shopRequests.createdAt))
    .limit(limit);

  if (requests.length === 0) return [];

  const items = await db.select().from(shopRequestItems);
  const itemsByRequestId = new Map<string, ShopRequestLine[]>();
  for (const item of items) {
    const list = itemsByRequestId.get(item.shopRequestId) ?? [];
    list.push({ id: item.id, itemTitle: item.itemTitle, quantity: item.quantity });
    itemsByRequestId.set(item.shopRequestId, list);
  }

  return requests.map((request) => ({
    id: request.id,
    userName: request.userName,
    userEmail: request.userEmail,
    items: itemsByRequestId.get(request.id) ?? [],
    status: request.status,
    createdAt: request.createdAt,
  }));
}

export type PointLogEntry = {
  id: string;
  teamName: string;
  amount: number;
  reason: string | null;
  createdByName: string;
  createdAt: Date;
};

export async function getRecentPointLogs(limit = 30): Promise<PointLogEntry[]> {
  const db = await getDb();
  const createdByUsers = users;

  const rows = await db
    .select({
      id: pointLogs.id,
      amount: pointLogs.amount,
      reason: pointLogs.reason,
      createdAt: pointLogs.createdAt,
      teamName: teams.name,
      createdByName: createdByUsers.name,
    })
    .from(pointLogs)
    .innerJoin(teams, eq(pointLogs.teamId, teams.id))
    .innerJoin(createdByUsers, eq(pointLogs.createdById, createdByUsers.id))
    .orderBy(desc(pointLogs.createdAt))
    .limit(limit);

  return rows;
}
