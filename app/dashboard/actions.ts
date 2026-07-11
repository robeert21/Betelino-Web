"use server";

import { revalidatePath } from "next/cache";
import { and, eq, inArray, or, sql, count } from "drizzle-orm";
import { z } from "zod";
import { getDb } from "@/db";
import { teams, users, shopRequests, pointLogs } from "@/db/schema";
import { getCurrentUser, isLeaderRole, isAdminRole } from "@/lib/auth";

const ASSIGNABLE_ROLES = ["CAMPER", "STAFF", "ADMIN", "CALAUZA"] as const;

async function teamHasOtherCalauza(teamId: string, excludingUserId: string): Promise<boolean> {
  const db = await getDb();
  const [existing] = await db
    .select({ id: users.id })
    .from(users)
    .where(and(eq(users.teamId, teamId), eq(users.role, "CALAUZA")))
    .limit(1);
  return !!existing && existing.id !== excludingUserId;
}

export type AddPointsState = {
  error?: string;
  success?: boolean;
};

const addPointsSchema = z.object({
  teamId: z.string().min(1, "Selectează o echipă."),
  userId: z
    .string()
    .trim()
    .optional()
    .transform((value) => (value ? value : undefined)),
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
    userId: formData.get("userId") || undefined,
    amount: formData.get("amount"),
    reason: formData.get("reason") || undefined,
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Date invalide." };
  }

  const { teamId, userId, amount, reason } = parsed.data;
  const db = await getDb();

  const [team] = await db.select({ id: teams.id }).from(teams).where(eq(teams.id, teamId)).limit(1);
  if (!team) {
    return { error: "Echipa nu a fost găsită." };
  }

  if (userId) {
    const [member] = await db
      .select({ id: users.id, teamId: users.teamId })
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);
    if (!member) {
      return { error: "Membrul nu a fost găsit." };
    }
    if (member.teamId !== teamId) {
      return { error: "Membrul selectat nu face parte din această echipă." };
    }

    await db.batch([
      db.insert(pointLogs).values({ teamId, userId, amount, reason, createdById: user.id }),
      db
        .update(teams)
        .set({ currentPoints: sql`${teams.currentPoints} + ${amount}` })
        .where(eq(teams.id, teamId)),
      db
        .update(users)
        .set({ points: sql`${users.points} + ${amount}` })
        .where(eq(users.id, userId)),
    ]);
  } else {
    await db.batch([
      db.insert(pointLogs).values({ teamId, amount, reason, createdById: user.id }),
      db
        .update(teams)
        .set({ currentPoints: sql`${teams.currentPoints} + ${amount}` })
        .where(eq(teams.id, teamId)),
    ]);
  }

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

export async function markShopRequestDeliveredAction(
  requestId: string,
): Promise<{ error?: string }> {
  const currentUser = await getCurrentUser();
  if (!currentUser || !isLeaderRole(currentUser.role)) {
    return { error: "Nu ai acces la această acțiune." };
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
  if (request.status !== "FULFILLED") {
    return { error: "Cererea trebuie cumpărată înainte de a fi predată." };
  }

  await db.update(shopRequests).set({ status: "DELIVERED" }).where(eq(shopRequests.id, requestId));

  revalidatePath("/dashboard/solicitari");
  return {};
}

export async function markShopRequestsFulfilledAction(
  requestIds: string[],
): Promise<{ error?: string }> {
  const currentUser = await getCurrentUser();
  if (!currentUser || !isLeaderRole(currentUser.role)) {
    return { error: "Nu ai acces la această acțiune." };
  }

  if (requestIds.length === 0) {
    return {};
  }

  const db = await getDb();
  await db
    .update(shopRequests)
    .set({ status: "FULFILLED" })
    .where(and(inArray(shopRequests.id, requestIds), eq(shopRequests.status, "APPROVED")));

  revalidatePath("/dashboard/solicitari");
  return {};
}

export async function syncLeaderboardAction(): Promise<{ error?: string }> {
  const currentUser = await getCurrentUser();
  if (!currentUser || !isAdminRole(currentUser.role)) {
    return { error: "Doar administratorii pot actualiza clasamentul." };
  }

  const db = await getDb();
  await db
    .update(teams)
    .set({
      leaderboardPoints: sql`${teams.currentPoints}`,
      leaderboardSyncedAt: new Date(),
    });

  revalidatePath("/dashboard");
  revalidatePath("/clasament");
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

    const [member] = await db.select({ role: users.role }).from(users).where(eq(users.id, userId)).limit(1);
    if (member?.role === "CALAUZA" && (await teamHasOtherCalauza(teamId, userId))) {
      return { error: "Echipa are deja o călăuză." };
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

  if (role === "CALAUZA") {
    const [member] = await db.select({ teamId: users.teamId }).from(users).where(eq(users.id, userId)).limit(1);
    if (member?.teamId && (await teamHasOtherCalauza(member.teamId, userId))) {
      return { error: "Echipa are deja o călăuză." };
    }
  }

  await db.update(users).set({ role }).where(eq(users.id, userId));

  revalidatePath("/dashboard");
  return {};
}

const CABIN_COUNT = 14;

export async function assignCabinAction(
  userId: string,
  cabin: number | null,
): Promise<{ error?: string }> {
  const currentUser = await getCurrentUser();
  if (!currentUser || !isAdminRole(currentUser.role)) {
    return { error: "Doar administratorii pot asigna cabane." };
  }

  if (cabin !== null && (!Number.isInteger(cabin) || cabin < 1 || cabin > CABIN_COUNT)) {
    return { error: "Cabană invalidă." };
  }

  const db = await getDb();
  await db.update(users).set({ cabin }).where(eq(users.id, userId));

  revalidatePath("/dashboard");
  return {};
}

export async function deleteMemberAction(userId: string): Promise<{ error?: string }> {
  const currentUser = await getCurrentUser();
  if (!currentUser || !isAdminRole(currentUser.role)) {
    return { error: "Doar administratorii pot șterge conturi." };
  }

  if (userId === currentUser.id) {
    return { error: "Nu îți poți șterge propriul cont." };
  }

  const db = await getDb();

  const [member] = await db.select({ id: users.id }).from(users).where(eq(users.id, userId)).limit(1);
  if (!member) {
    return { error: "Membrul nu a fost găsit." };
  }

  const [{ value: logCount }] = await db
    .select({ value: count() })
    .from(pointLogs)
    .where(or(eq(pointLogs.createdById, userId), eq(pointLogs.userId, userId)));
  if (logCount > 0) {
    return {
      error: "Acest cont a înregistrat sau a primit puncte și nu poate fi șters (istoricul trebuie păstrat).",
    };
  }

  await db.delete(users).where(eq(users.id, userId));

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/membri");
  return {};
}
