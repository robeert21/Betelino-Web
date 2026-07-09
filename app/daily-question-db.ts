import "server-only";
import { and, eq } from "drizzle-orm";
import { getDb } from "@/db";
import { dailyQuestionAnswers } from "@/db/schema";

export async function getUserAnswerForDate(
  userId: string,
  dateKey: string,
): Promise<{ selected: number | null } | null> {
  const db = await getDb();
  const [row] = await db
    .select({ selected: dailyQuestionAnswers.selected })
    .from(dailyQuestionAnswers)
    .where(and(eq(dailyQuestionAnswers.userId, userId), eq(dailyQuestionAnswers.dateKey, dateKey)))
    .limit(1);

  return row ?? null;
}
