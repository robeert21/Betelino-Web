"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { and, eq } from "drizzle-orm";
import { getDb } from "@/db";
import { users, passwordResetTokens, shopRequests } from "@/db/schema";
import {
  createSession,
  destroySession,
  getSession,
  hashPassword,
  verifyPassword,
} from "@/lib/auth";
import { sendPasswordResetEmail } from "@/lib/email";
import { generateUniqueUsername } from "@/lib/username";
import {
  addEmailSchema,
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
    firstName: formData.get("firstName"),
    lastName: formData.get("lastName"),
    email: formData.get("email"),
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
  });

  if (!parsed.success) {
    return { fieldErrors: parsed.error.flatten().fieldErrors };
  }

  const { firstName, lastName, email, password } = parsed.data;
  const name = `${firstName} ${lastName}`;
  const db = await getDb();

  const [existing] = await db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.email, email))
    .limit(1);
  if (existing) {
    return { error: "Există deja un cont cu acest email." };
  }

  const passwordHash = await hashPassword(password);

  // generateUniqueUsername checks availability with a SELECT before the
  // INSERT, so two concurrent registrations can both pass the check for
  // the same username. Retry on a UNIQUE constraint race instead of
  // letting it surface as a 500.
  const MAX_ATTEMPTS = 5;
  let user: { id: string } | undefined;
  for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
    const username = await generateUniqueUsername(db, name);
    try {
      [user] = await db
        .insert(users)
        .values({ name, email, username, passwordHash })
        .returning({ id: users.id });
      break;
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      if (!message.includes("UNIQUE constraint failed")) throw err;
      if (message.includes("users.email")) {
        return { error: "Există deja un cont cu acest email." };
      }
      if (attempt === MAX_ATTEMPTS - 1) throw err;
    }
  }
  if (!user) throw new Error("Nu s-a putut crea contul.");

  await createSession(user.id);
  redirect("/cont");
}

export async function addEmailAction(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const session = await getSession();
  if (!session) {
    redirect("/cont/login");
  }

  const parsed = addEmailSchema.safeParse({
    email: formData.get("email"),
  });

  if (!parsed.success) {
    return { fieldErrors: parsed.error.flatten().fieldErrors };
  }

  const { email } = parsed.data;
  const db = await getDb();

  const [currentUser] = await db
    .select({ email: users.email })
    .from(users)
    .where(eq(users.id, session.userId))
    .limit(1);
  if (currentUser?.email) {
    return { error: "Contul are deja un email asociat." };
  }

  const [existing] = await db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.email, email))
    .limit(1);
  if (existing) {
    return { error: "Există deja un cont cu acest email." };
  }

  await db.update(users).set({ email }).where(eq(users.id, session.userId));

  return { message: "Emailul a fost adăugat cu succes." };
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

  const resetPath = `/cont/reseteaza-parola/${token}`;
  const requestHeaders = await headers();
  const host = requestHeaders.get("host");
  const protocol = host?.startsWith("localhost") ? "http" : "https";
  const resetUrl = `${protocol}://${host}${resetPath}`;

  let configured = false;
  try {
    ({ configured } = await sendPasswordResetEmail(email, resetUrl));
  } catch (error) {
    // A configured provider failing to deliver (e.g. sender domain not
    // verified for this recipient) must not crash the page, but the reset
    // link must also never be shown on-screen here — anyone could type in
    // another person's email and hijack their account. Just log it.
    console.error("Trimiterea emailului de resetare a eșuat:", error);
  }

  // Only surface the reset link directly on the page when no email
  // provider is configured at all (e.g. local dev without RESEND_API_KEY),
  // so the flow stays testable without a real inbox.
  const devResetLink = configured ? undefined : resetPath;

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

// Lets a camper cancel their own order while it's still pending — once a
// leader has acted on it (approved/rejected/etc.) it's no longer cancelable
// here, and gets handled through the dashboard instead.
export async function cancelShopOrderAction(formData: FormData): Promise<void> {
  const session = await getSession();
  if (!session) {
    redirect("/cont/login");
  }

  const requestId = formData.get("requestId");
  if (typeof requestId !== "string" || !requestId) {
    return;
  }

  const db = await getDb();
  await db
    .delete(shopRequests)
    .where(
      and(
        eq(shopRequests.id, requestId),
        eq(shopRequests.userId, session.userId),
        eq(shopRequests.status, "PENDING"),
      ),
    );

  revalidatePath("/cont");
}
