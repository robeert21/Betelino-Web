// One-off backfill for the `username` column added for username-based login.
// Existing accounts (created before this feature) have no username yet.
// Usage:
//   node scripts/backfill-usernames.mjs            (local D1)
//   node scripts/backfill-usernames.mjs --remote    (production D1)
import { execFileSync } from "node:child_process";

const remote = process.argv.includes("--remote");
const envFlag = remote ? "--remote" : "--local";

function d1Exec(sql) {
  const output = execFileSync(
    "npx",
    ["wrangler", "d1", "execute", "betelino-db", envFlag, "--json", "--command", sql],
    { encoding: "utf8" },
  );
  return JSON.parse(output)[0].results;
}

function slugifyNamePart(part) {
  return part
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z]/g, "");
}

function generateBaseUsername(fullName) {
  const parts = fullName.trim().split(/\s+/).map(slugifyNamePart).filter(Boolean);
  if (parts.length === 0) return "utilizator";
  if (parts.length === 1) return parts[0];
  return `${parts[0]}.${parts[parts.length - 1]}`;
}

const rows = d1Exec("SELECT id, name FROM users WHERE username IS NULL");
if (rows.length === 0) {
  console.log("No users need a username backfill.");
  process.exit(0);
}

const taken = new Set(
  d1Exec("SELECT username FROM users WHERE username IS NOT NULL").map(
    (r) => r.username,
  ),
);

for (const row of rows) {
  const base = generateBaseUsername(row.name);
  let candidate = base;
  let suffix = 2;
  while (taken.has(candidate)) {
    candidate = `${base}${suffix}`;
    suffix += 1;
  }
  taken.add(candidate);

  const escapedId = row.id.replace(/'/g, "''");
  const escapedUsername = candidate.replace(/'/g, "''");
  d1Exec(
    `UPDATE users SET username = '${escapedUsername}' WHERE id = '${escapedId}'`,
  );
  console.log(`${row.name} -> ${candidate}`);
}
