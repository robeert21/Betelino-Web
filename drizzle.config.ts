import { defineConfig } from "drizzle-kit";

// Migrations are generated as plain SQL here, then applied with
// `wrangler d1 migrations apply` (see the commands below) — no live DB
// connection is needed at generate time, so no driver/credentials required.
export default defineConfig({
  schema: "./db/schema.ts",
  out: "./drizzle/migrations",
  dialect: "sqlite",
});
