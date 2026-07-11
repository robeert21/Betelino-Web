import { sqliteTable, text, integer, uniqueIndex } from "drizzle-orm/sqlite-core";

export const teams = sqliteTable("teams", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text("name").notNull().unique(),
  currentPoints: integer("current_points").notNull().default(0),
  // Snapshot of currentPoints shown on the public leaderboard. Only updated
  // when an admin explicitly syncs it, so leaders can freely adjust
  // currentPoints during the day without changing the public ranking.
  leaderboardPoints: integer("leaderboard_points").notNull().default(0),
  leaderboardSyncedAt: integer("leaderboard_synced_at", { mode: "timestamp_ms" }),
});

export const users = sqliteTable("users", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text("name").notNull(),
  email: text("email").unique(),
  username: text("username").unique(),
  passwordHash: text("password_hash").notNull(),
  role: text("role").notNull().default("CAMPER"),
  points: integer("points").notNull().default(0),
  teamId: text("team_id").references(() => teams.id),
  cabin: integer("cabin"),
});

// category is validated as one of SHOP_CATEGORIES (see app/magazin/data.ts)
// in application code. flavors is a JSON-encoded { name, cost }[] of variant
// options (e.g. flavors, sizes) a camper must choose between before
// ordering, each with its own price in bani; null when the item has no
// variants, in which case top-level cost applies.
export const shopItems = sqliteTable("shop_items", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text("name").notNull(),
  description: text("description"),
  cost: integer("cost").notNull().default(0),
  imageUrl: text("image_url"),
  category: text("category").notNull().default("gustari"),
  flavors: text("flavors"),
  // Max total quantity a single camper can order per calendar day (UTC),
  // summed across all their non-rejected requests. Null means unlimited.
  dailyLimit: integer("daily_limit"),
});

// Status is validated as "PENDING" | "APPROVED" | "REJECTED" | "FULFILLED" | "DELIVERED" in application code.
export const shopRequests = sqliteTable("shop_requests", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  status: text("status").notNull().default("PENDING"),
  // Free-text note for requests that don't fit the catalog (other shop items,
  // pharmacy, etc.), typed by the camper alongside their cart.
  note: text("note"),
  createdAt: integer("created_at", { mode: "timestamp_ms" })
    .notNull()
    .$defaultFn(() => new Date()),
});

// itemId/itemTitle are snapshotted at request time since the shop catalog
// row can change (price, name) after the request was submitted. itemFlavor
// is the variant the camper picked (null if the item has no flavors).
export const shopRequestItems = sqliteTable("shop_request_items", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  shopRequestId: text("shop_request_id")
    .notNull()
    .references(() => shopRequests.id, { onDelete: "cascade" }),
  itemId: text("item_id").notNull(),
  itemTitle: text("item_title").notNull(),
  itemFlavor: text("item_flavor"),
  quantity: integer("quantity").notNull(),
});

// Audit trail for every points adjustment a leader makes to a team.
export const pointLogs = sqliteTable("point_logs", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  teamId: text("team_id")
    .notNull()
    .references(() => teams.id, { onDelete: "cascade" }),
  // Null when the leader awarded points to the whole team. Set when the
  // leader picked a specific camper, in which case users.points is also
  // incremented so the camper's individual contribution is tracked.
  userId: text("user_id").references(() => users.id, { onDelete: "set null" }),
  amount: integer("amount").notNull(),
  reason: text("reason"),
  createdById: text("created_by_id")
    .notNull()
    .references(() => users.id),
  createdAt: integer("created_at", { mode: "timestamp_ms" })
    .notNull()
    .$defaultFn(() => new Date()),
});

export const passwordResetTokens = sqliteTable("password_reset_tokens", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  token: text("token").notNull().unique(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expiresAt: integer("expires_at", { mode: "timestamp_ms" }).notNull(),
  usedAt: integer("used_at", { mode: "timestamp_ms" }),
  createdAt: integer("created_at", { mode: "timestamp_ms" })
    .notNull()
    .$defaultFn(() => new Date()),
});

// One row per user per calendar day (dateKey, e.g. "2026-07-09"). selected
// is the chosen option index, or null when the 15s timer ran out unanswered.
// A new dateKey each day naturally resets the game — no cleanup needed.
export const dailyQuestionAnswers = sqliteTable(
  "daily_question_answers",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    dateKey: text("date_key").notNull(),
    selected: integer("selected"),
    createdAt: integer("created_at", { mode: "timestamp_ms" })
      .notNull()
      .$defaultFn(() => new Date()),
  },
  (table) => [uniqueIndex("daily_question_answers_user_date_idx").on(table.userId, table.dateKey)],
);
