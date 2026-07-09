import { desc, eq, sql } from "drizzle-orm";
import { alias } from "drizzle-orm/sqlite-core";
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

export type CamperMember = {
  id: string;
  name: string;
  points: number;
  teamId: string | null;
};

// Campers only, for the "assign points to a specific child" select in
// AddPointsForm — filtered client-side by the team currently selected.
export async function getCamperMembers(): Promise<CamperMember[]> {
  const db = await getDb();
  const rows = await db
    .select({ id: users.id, name: users.name, points: users.points, teamId: users.teamId })
    .from(users)
    .where(eq(users.role, "CAMPER"))
    .orderBy(users.name);

  return rows;
}

export type TeamMemberBreakdown = {
  id: string;
  name: string;
  members: { id: string; name: string; points: number }[];
};

// Per-team roster of campers ranked by their individual point contribution,
// for the "Puncte individuale" section of the dashboard.
export async function getTeamMemberBreakdown(): Promise<TeamMemberBreakdown[]> {
  const db = await getDb();
  const teamRows = await db.select({ id: teams.id, name: teams.name }).from(teams).orderBy(teams.name);
  const memberRows = await getCamperMembers();

  const byTeam = new Map<string, { id: string; name: string; points: number }[]>();
  for (const member of memberRows) {
    if (!member.teamId) continue;
    const list = byTeam.get(member.teamId) ?? [];
    list.push({ id: member.id, name: member.name, points: member.points });
    byTeam.set(member.teamId, list);
  }

  return teamRows.map((team) => ({
    id: team.id,
    name: team.name,
    members: (byTeam.get(team.id) ?? []).sort((a, b) => b.points - a.points),
  }));
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
  itemFlavor: string | null;
  quantity: number;
};

export type ShopRequestEntry = {
  id: string;
  userName: string;
  userEmail: string;
  items: ShopRequestLine[];
  note: string | null;
  status: string;
  createdAt: Date;
};

export async function getShopRequests(limit = 100): Promise<ShopRequestEntry[]> {
  const db = await getDb();
  const requests = await db
    .select({
      id: shopRequests.id,
      status: shopRequests.status,
      note: shopRequests.note,
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
    list.push({
      id: item.id,
      itemTitle: item.itemTitle,
      itemFlavor: item.itemFlavor,
      quantity: item.quantity,
    });
    itemsByRequestId.set(item.shopRequestId, list);
  }

  return requests.map((request) => ({
    id: request.id,
    userName: request.userName,
    userEmail: request.userEmail,
    items: itemsByRequestId.get(request.id) ?? [],
    note: request.note,
    status: request.status,
    createdAt: request.createdAt,
  }));
}

export type PointLogEntry = {
  id: string;
  teamName: string;
  memberName: string | null;
  amount: number;
  reason: string | null;
  createdByName: string;
  createdAt: Date;
};

export async function getRecentPointLogs(limit = 30): Promise<PointLogEntry[]> {
  const db = await getDb();
  const createdByUsers = alias(users, "created_by_users");
  const memberUsers = alias(users, "member_users");

  const rows = await db
    .select({
      id: pointLogs.id,
      amount: pointLogs.amount,
      reason: pointLogs.reason,
      createdAt: pointLogs.createdAt,
      teamName: teams.name,
      createdByName: createdByUsers.name,
      memberName: memberUsers.name,
    })
    .from(pointLogs)
    .innerJoin(teams, eq(pointLogs.teamId, teams.id))
    .innerJoin(createdByUsers, eq(pointLogs.createdById, createdByUsers.id))
    .leftJoin(memberUsers, eq(pointLogs.userId, memberUsers.id))
    .orderBy(desc(pointLogs.createdAt))
    .limit(limit);

  return rows.map((row) => ({ ...row, memberName: row.memberName ?? null }));
}
