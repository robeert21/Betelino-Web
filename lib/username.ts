import "server-only";
import { eq } from "drizzle-orm";
import type { getDb } from "@/db";
import { users } from "@/db/schema";

function slugifyNamePart(part: string): string {
  return part
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z]/g, "");
}

// Derives "name.lastname" (e.g. "robert.vatamanu") from a full-name string,
// using the first and last whitespace-separated tokens.
export function generateBaseUsername(fullName: string): string {
  const parts = fullName
    .trim()
    .split(/\s+/)
    .map(slugifyNamePart)
    .filter(Boolean);

  if (parts.length === 0) return "utilizator";
  if (parts.length === 1) return parts[0];
  return `${parts[0]}.${parts[parts.length - 1]}`;
}

export async function generateUniqueUsername(
  db: Awaited<ReturnType<typeof getDb>>,
  fullName: string,
): Promise<string> {
  const base = generateBaseUsername(fullName);
  let candidate = base;
  let suffix = 2;

  while (true) {
    const [existing] = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.username, candidate))
      .limit(1);
    if (!existing) return candidate;
    candidate = `${base}${suffix}`;
    suffix += 1;
  }
}
