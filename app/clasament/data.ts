import { and, desc, eq, ne, sql } from "drizzle-orm";
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
      points: teams.leaderboardPoints,
      memberCount: sql<number>`count(${users.id})`,
    })
    .from(teams)
    .leftJoin(users, and(eq(users.teamId, teams.id), ne(users.role, "CALAUZA")))
    .groupBy(teams.id)
    .orderBy(sql`${teams.leaderboardPoints} desc`, teams.name);

  return rows.map((row) => ({
    id: row.id,
    name: row.name,
    points: row.points,
    memberCount: Number(row.memberCount),
  }));
}

export type TopCamper = {
  id: string;
  name: string;
  points: number;
  teamName: string | null;
};

// Top individual contributors across all teams, ranked by their own
// point total (regardless of which team they're on).
export async function getTopCampers(limit = 3): Promise<TopCamper[]> {
  const db = await getDb();
  const rows = await db
    .select({
      id: users.id,
      name: users.name,
      points: users.points,
      teamName: teams.name,
    })
    .from(users)
    .leftJoin(teams, eq(users.teamId, teams.id))
    .where(eq(users.role, "CAMPER"))
    .orderBy(desc(users.points), users.name)
    .limit(limit);

  return rows;
}
