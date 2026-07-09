"use server";

import { and, eq } from "drizzle-orm";
import { getDb } from "@/db";
import { dailyQuestionAnswers } from "@/db/schema";
import { getCurrentUser } from "@/lib/auth";
import { DAILY_QUESTIONS, dayIndexFromDateKey } from "./daily-question-data";

export async function submitDailyAnswer(
  dateKey: string,
  selected: number | null,
): Promise<{ success: boolean; error?: string }> {
  const user = await getCurrentUser();
  if (!user) {
    return { success: false, error: "Trebuie să fii autentificat." };
  }

  if (selected !== null) {
    const question = DAILY_QUESTIONS[dayIndexFromDateKey(dateKey) % DAILY_QUESTIONS.length];
    if (selected < 0 || selected >= question.options.length) {
      return { success: false, error: "Răspuns invalid." };
    }
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

  await db.insert(dailyQuestionAnswers).values({ userId: user.id, dateKey, selected });
  return { success: true };
}
