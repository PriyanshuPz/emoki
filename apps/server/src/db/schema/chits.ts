import { boolean, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { users } from "./user";

export enum VaultState {
  Active = "active",
  Archived = "archived",
  Flagged = "flagged",
  Deleted = "deleted",
  Suspended = "suspended",
}

export const vaults = pgTable("vaults", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull(),
  name: text("name").notNull(),
  description: text("description"),

  isPublic: boolean("is_public").notNull().default(false),
  isDefault: boolean("is_default").notNull().default(false),

  state: text("state").$type<VaultState>().notNull().default(VaultState.Active),

  createdAt: timestamp("created_at").notNull().default(new Date()),
  updatedAt: timestamp("updated_at").notNull().default(new Date()),
});

export const chits = pgTable("chits", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  content: text("content").notNull(),

  vaultId: text("vault_id")
    .notNull()
    .references(() => vaults.id, { onDelete: "cascade" }),

  state: text("state").$type<VaultState>().notNull().default(VaultState.Active),

  createdAt: timestamp("created_at").notNull().default(new Date()),
  updatedAt: timestamp("updated_at").notNull().default(new Date()),
});

export const vaultRelations = relations(vaults, ({ many, one }) => ({
  chits: many(chits),
  user: one(users, {
    fields: [vaults.userId],
    references: [users.id],
  }),
}));

export const chitRelations = relations(chits, ({ one }) => ({
  vault: one(vaults, {
    fields: [chits.vaultId],
    references: [vaults.id],
  }),
}));
