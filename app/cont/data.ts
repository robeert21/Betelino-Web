import { desc, eq } from "drizzle-orm";
import { getDb } from "@/db";
import { users, teams, pointLogs } from "@/db/schema";

export type CamperAccount = {
  fullName: string;
  username: string | null;
  teamName: string;
  individualPoints: number;
  teamPoints: number;
};

export async function getCamperAccount(
  userId: string,
): Promise<CamperAccount | null> {
  const db = await getDb();
  const [row] = await db
    .select({
      name: users.name,
      username: users.username,
      points: users.points,
      teamName: teams.name,
      teamPoints: teams.currentPoints,
    })
    .from(users)
    .leftJoin(teams, eq(users.teamId, teams.id))
    .where(eq(users.id, userId))
    .limit(1);

  if (!row) return null;

  return {
    fullName: row.name,
    username: row.username,
    teamName: row.teamName ?? "Neatribuită încă",
    individualPoints: row.points,
    teamPoints: row.teamPoints ?? 0,
  };
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
