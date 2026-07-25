import "server-only";
import { asc, desc, eq, inArray, isNull } from "drizzle-orm";
import { getDb } from "@/db";
import { feedback, users } from "@/db/schema";
import { LEADER_ROLES } from "@/lib/auth";

export type LeaderOption = {
  id: string;
  name: string;
};

export async function getLeaderOptions(): Promise<LeaderOption[]> {
  const db = await getDb();
  const rows = await db
    .select({ id: users.id, name: users.name })
    .from(users)
    .where(inArray(users.role, [...LEADER_ROLES]))
    .orderBy(asc(users.name));

  return rows;
}

export type FeedbackNote = {
  id: string;
  message: string;
  authorName: string | null;
  targetLeaderId: string | null;
  targetLeaderName: string | null;
  createdAt: Date;
};

export async function getFeedbackInbox(): Promise<FeedbackNote[]> {
  const db = await getDb();
  const target = users;
  const rows = await db
    .select({
      id: feedback.id,
      message: feedback.message,
      authorName: feedback.authorName,
      targetLeaderId: feedback.targetLeaderId,
      targetLeaderName: target.name,
      createdAt: feedback.createdAt,
    })
    .from(feedback)
    .leftJoin(target, eq(feedback.targetLeaderId, target.id))
    .where(isNull(feedback.hiddenAt))
    .orderBy(desc(feedback.createdAt));

  return rows;
}
