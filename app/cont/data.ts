import { eq } from "drizzle-orm";
import { getDb } from "@/db";
import { users, teams } from "@/db/schema";

export type CamperAccount = {
  fullName: string;
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
    teamName: row.teamName ?? "Neasignat încă",
    individualPoints: row.points,
    teamPoints: row.teamPoints ?? 0,
  };
}
