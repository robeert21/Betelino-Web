"use server";

import { revalidatePath } from "next/cache";
import { and, eq, inArray } from "drizzle-orm";
import { getDb } from "@/db";
import { feedback, users } from "@/db/schema";
import { getCurrentUser, isAdminRole, LEADER_ROLES } from "@/lib/auth";
import { feedbackSchema } from "./schemas";

export async function submitFeedback(input: {
  targetLeaderId?: string;
  authorName?: string;
  message: string;
}): Promise<{ success: boolean; error?: string }> {
  const user = await getCurrentUser();

  const parsed = feedbackSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message };
  }

  const db = await getDb();
  if (parsed.data.targetLeaderId) {
    const [leader] = await db
      .select({ id: users.id })
      .from(users)
      .where(and(eq(users.id, parsed.data.targetLeaderId), inArray(users.role, [...LEADER_ROLES])))
      .limit(1);
    if (!leader) {
      return { success: false, error: "Liderul selectat nu a fost găsit." };
    }
  }

  await db.insert(feedback).values({
    userId: user?.id ?? null,
    targetLeaderId: parsed.data.targetLeaderId,
    authorName: parsed.data.authorName,
    message: parsed.data.message,
  });

  revalidatePath("/dashboard/feedback");
  return { success: true };
}

export async function hideFeedback(id: string): Promise<{ success: boolean; error?: string }> {
  const user = await getCurrentUser();
  if (!user || !isAdminRole(user.role)) {
    return { success: false, error: "Nu ai voie să faci asta." };
  }

  const db = await getDb();
  await db
    .update(feedback)
    .set({ hiddenAt: new Date(), hiddenById: user.id })
    .where(eq(feedback.id, id));

  revalidatePath("/dashboard/feedback");
  return { success: true };
}
