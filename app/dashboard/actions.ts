"use server";

import { revalidatePath } from "next/cache";
import { eq, sql } from "drizzle-orm";
import { z } from "zod";
import { getDb } from "@/db";
import { teams, users, shopRequests, pointLogs } from "@/db/schema";
import { getCurrentUser, isLeaderRole, isAdminRole } from "@/lib/auth";

const ASSIGNABLE_ROLES = ["CAMPER", "STAFF", "ADMIN"] as const;

export type AddPointsState = {
  error?: string;
  success?: boolean;
};

const addPointsSchema = z.object({
  teamId: z.string().min(1, "Selectează o echipă."),
  amount: z.coerce
    .number()
    .int("Numărul de puncte trebuie să fie întreg.")
    .refine((value) => value !== 0, "Introdu o valoare diferită de zero."),
  reason: z.string().trim().max(280).optional(),
});

export async function addTeamPointsAction(
  _prevState: AddPointsState,
  formData: FormData,
): Promise<AddPointsState> {
  const user = await getCurrentUser();
  if (!user || !isLeaderRole(user.role)) {
    return { error: "Nu ai acces la această acțiune." };
  }

  const parsed = addPointsSchema.safeParse({
    teamId: formData.get("teamId"),
    amount: formData.get("amount"),
    reason: formData.get("reason") || undefined,
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Date invalide." };
  }

  const { teamId, amount, reason } = parsed.data;
  const db = await getDb();

  const [team] = await db.select({ id: teams.id }).from(teams).where(eq(teams.id, teamId)).limit(1);
  if (!team) {
    return { error: "Echipa nu a fost găsită." };
  }

  await db.batch([
    db.insert(pointLogs).values({ teamId, amount, reason, createdById: user.id }),
    db
      .update(teams)
      .set({ currentPoints: sql`${teams.currentPoints} + ${amount}` })
      .where(eq(teams.id, teamId)),
  ]);

  revalidatePath("/dashboard");
  return { success: true };
}

const SHOP_REQUEST_STATUSES = ["APPROVED", "REJECTED"] as const;

export async function updateShopRequestStatusAction(
  requestId: string,
  status: (typeof SHOP_REQUEST_STATUSES)[number],
): Promise<{ error?: string }> {
  const currentUser = await getCurrentUser();
  if (!currentUser || !isLeaderRole(currentUser.role)) {
    return { error: "Nu ai acces la această acțiune." };
  }

  if (!SHOP_REQUEST_STATUSES.includes(status)) {
    return { error: "Status invalid." };
  }

  const db = await getDb();
  const [request] = await db
    .select()
    .from(shopRequests)
    .where(eq(shopRequests.id, requestId))
    .limit(1);
  if (!request) {
    return { error: "Cererea nu a fost găsită." };
  }
  if (request.status !== "PENDING") {
    return { error: "Cererea a fost deja procesată." };
  }

  await db.update(shopRequests).set({ status }).where(eq(shopRequests.id, requestId));

  revalidatePath("/dashboard/solicitari");
  return {};
}

export async function assignTeamAction(
  userId: string,
  teamId: string | null,
): Promise<{ error?: string }> {
  const currentUser = await getCurrentUser();
  if (!currentUser || !isAdminRole(currentUser.role)) {
    return { error: "Doar administratorii pot asigna echipe." };
  }

  const db = await getDb();

  if (teamId) {
    const [team] = await db.select({ id: teams.id }).from(teams).where(eq(teams.id, teamId)).limit(1);
    if (!team) {
      return { error: "Echipa nu a fost găsită." };
    }
  }

  await db.update(users).set({ teamId }).where(eq(users.id, userId));

  revalidatePath("/dashboard");
  return {};
}

export async function assignRoleAction(
  userId: string,
  role: string,
): Promise<{ error?: string }> {
  const currentUser = await getCurrentUser();
  if (!currentUser || !isAdminRole(currentUser.role)) {
    return { error: "Doar administratorii pot schimba rolurile." };
  }

  if (!(ASSIGNABLE_ROLES as readonly string[]).includes(role)) {
    return { error: "Rol invalid." };
  }

  if (userId === currentUser.id) {
    return { error: "Nu îți poți schimba propriul rol." };
  }

  const db = await getDb();
  await db.update(users).set({ role }).where(eq(users.id, userId));

  revalidatePath("/dashboard");
  return {};
}
