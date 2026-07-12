"use server";

import { and, eq, sql } from "drizzle-orm";
import { getDb } from "@/db";
import { dailyQuestionAnswers, teams, users, pointLogs } from "@/db/schema";
import { getCurrentUser } from "@/lib/auth";
import { DAILY_QUESTIONS, questionIndexFor } from "./daily-question-data";

const CORRECT_ANSWER_POINTS = 1;

export async function submitDailyAnswer(
  dateKey: string,
  selected: number | null,
): Promise<{ success: boolean; error?: string }> {
  const user = await getCurrentUser();
  if (!user) {
    return { success: false, error: "Trebuie să fii autentificat." };
  }

  const question = DAILY_QUESTIONS[questionIndexFor(dateKey, user.id)];
  if (selected !== null && (selected < 0 || selected >= question.options.length)) {
    return { success: false, error: "Răspuns invalid." };
  }

  const db = await getDb();
  const [existing] = await db
    .select({ id: dailyQuestionAnswers.id })
    .from(dailyQuestionAnswers)
    .where(and(eq(dailyQuestionAnswers.userId, user.id), eq(dailyQuestionAnswers.dateKey, dateKey)))
    .limit(1);

  if (existing) {
    return { success: true };
  }

  const isCorrect = selected !== null && selected === question.correctIndex;

  if (isCorrect && user.teamId) {
    await db.batch([
      db.insert(dailyQuestionAnswers).values({ userId: user.id, dateKey, selected }),
      db.insert(pointLogs).values({
        teamId: user.teamId,
        userId: user.id,
        amount: CORRECT_ANSWER_POINTS,
        reason: "Răspuns corect la întrebarea zilei",
        createdById: user.id,
      }),
      db
        .update(teams)
        .set({ currentPoints: sql`${teams.currentPoints} + ${CORRECT_ANSWER_POINTS}` })
        .where(eq(teams.id, user.teamId)),
      db
        .update(users)
        .set({ points: sql`${users.points} + ${CORRECT_ANSWER_POINTS}` })
        .where(eq(users.id, user.id)),
    ]);
  } else {
    await db.insert(dailyQuestionAnswers).values({ userId: user.id, dateKey, selected });
  }

  return { success: true };
}
