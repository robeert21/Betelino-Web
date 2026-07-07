import { eq, sql } from "drizzle-orm";
import { getDb } from "@/db";
import { teams, users } from "@/db/schema";

export type LeaderboardTeam = {
  id: string;
  name: string;
  points: number;
  memberCount: number;
};

export async function getLeaderboardTeams(): Promise<LeaderboardTeam[]> {
  const db = await getDb();
  const rows = await db
    .select({
      id: teams.id,
      name: teams.name,
      points: teams.currentPoints,
      memberCount: sql<number>`count(${users.id})`,
    })
    .from(teams)
    .leftJoin(users, eq(users.teamId, teams.id))
    .groupBy(teams.id)
    .orderBy(sql`${teams.currentPoints} desc`, teams.name);

  return rows.map((row) => ({
    id: row.id,
    name: row.name,
    points: row.points,
    memberCount: Number(row.memberCount),
  }));
}
