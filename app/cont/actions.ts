"use server";

import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { getDb } from "@/db";
import { users, passwordResetTokens } from "@/db/schema";
import {
  createSession,
  destroySession,
  hashPassword,
  verifyPassword,
} from "@/lib/auth";
import { generateUniqueUsername } from "@/lib/username";
import {
  loginSchema,
  registerSchema,
  requestResetSchema,
  resetPasswordSchema,
} from "./schemas";

export type ActionState = {
  error?: string;
  fieldErrors?: Record<string, string[]>;
  message?: string;
  devResetLink?: string;
};

const RESET_TOKEN_DURATION_MS = 60 * 60 * 1000; // 1 hour

// Edge runtime has no Node `crypto` module, so use the Web Crypto API
// (available globally in both the Edge Runtime and browsers) instead.
function generateResetToken(): string {
  const bytes = new Uint8Array(32);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("");
}

export async function registerAction(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const parsed = registerSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
  });

  if (!parsed.success) {
    return { fieldErrors: parsed.error.flatten().fieldErrors };
  }

  const { name, email, password } = parsed.data;
  const db = await getDb();

  const [existing] = await db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.email, email))
    .limit(1);
  if (existing) {
    return { error: "Există deja un cont cu acest email." };
  }

  const username = await generateUniqueUsername(db, name);
  const passwordHash = await hashPassword(password);
  const [user] = await db
    .insert(users)
    .values({ name, email, username, passwordHash })
    .returning({ id: users.id });

  await createSession(user.id);
  redirect("/cont");
}

export async function loginAction(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const parsed = loginSchema.safeParse({
    identifier: formData.get("identifier"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return { fieldErrors: parsed.error.flatten().fieldErrors };
  }

  const { identifier, password } = parsed.data;
  const db = await getDb();
  const lookupColumn = identifier.includes("@") ? users.email : users.username;
  const [user] = await db
    .select()
    .from(users)
    .where(eq(lookupColumn, identifier))
    .limit(1);
  if (!user) {
    return { error: "Date de autentificare incorecte." };
  }

  const validPassword = await verifyPassword(password, user.passwordHash);
  if (!validPassword) {
    return { error: "Date de autentificare incorecte." };
  }

  await createSession(user.id);
  redirect("/cont");
}

export async function logoutAction(): Promise<void> {
  await destroySession();
  redirect("/cont/login");
}

export async function requestPasswordResetAction(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const parsed = requestResetSchema.safeParse({
    email: formData.get("email"),
  });

  if (!parsed.success) {
    return { fieldErrors: parsed.error.flatten().fieldErrors };
  }

  const { email } = parsed.data;
  const db = await getDb();
  const [user] = await db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.email, email))
    .limit(1);

  // Always return the same generic message, whether or not the account
  // exists, so the form can't be used to enumerate registered emails.
  const genericMessage =
    "Dacă există un cont cu acest email, vei primi un link de resetare.";

  if (!user) {
    return { message: genericMessage };
  }

  const token = generateResetToken();
  await db.insert(passwordResetTokens).values({
    token,
    userId: user.id,
    expiresAt: new Date(Date.now() + RESET_TOKEN_DURATION_MS),
  });

  // No email provider is configured yet for Betelino. Until one is wired up
  // (e.g. Resend), surface the reset link directly so the flow is testable.
  const devResetLink = `/cont/reseteaza-parola/${token}`;

  return { message: genericMessage, devResetLink };
}

export async function resetPasswordAction(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const parsed = resetPasswordSchema.safeParse({
    token: formData.get("token"),
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
  });

  if (!parsed.success) {
    return { fieldErrors: parsed.error.flatten().fieldErrors };
  }

  const { token, password } = parsed.data;
  const db = await getDb();
  const [resetToken] = await db
    .select()
    .from(passwordResetTokens)
    .where(eq(passwordResetTokens.token, token))
    .limit(1);

  if (
    !resetToken ||
    resetToken.usedAt ||
    resetToken.expiresAt.getTime() < Date.now()
  ) {
    return { error: "Linkul de resetare este invalid sau a expirat." };
  }

  const passwordHash = await hashPassword(password);

  await db.batch([
    db
      .update(users)
      .set({ passwordHash })
      .where(eq(users.id, resetToken.userId)),
    db
      .update(passwordResetTokens)
      .set({ usedAt: new Date() })
      .where(eq(passwordResetTokens.token, token)),
  ]);

  redirect("/cont/login?reset=succes");
}
