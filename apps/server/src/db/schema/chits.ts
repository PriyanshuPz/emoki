import { boolean, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { user } from "./user";
import { relations } from "drizzle-orm";

export enum VaultState {
  Active = "active",
  Archived = "archived",
  Flagged = "flagged",
  Deleted = "deleted",
  Suspended = "suspended",
}

export const vault = pgTable("vault", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),

  name: text("name").notNull(),
  description: text("description"),

  isPublic: boolean("is_public").notNull().default(false),
  isDefault: boolean("is_default").notNull().default(false),

  state: text("state").$type<VaultState>().notNull().default(VaultState.Active),

  createdAt: timestamp("created_at").notNull().default(new Date()),
  updatedAt: timestamp("updated_at").notNull().default(new Date()),
});

export const chit = pgTable("chit", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  content: text("content").notNull(),

  vaultId: text("vault_id")
    .notNull()
    .references(() => vault.id, { onDelete: "cascade" }),

  state: text("state").$type<VaultState>().notNull().default(VaultState.Active),

  createdAt: timestamp("created_at").notNull().default(new Date()),
  updatedAt: timestamp("updated_at").notNull().default(new Date()),
});

export const vaultRelations = relations(vault, ({ many }) => ({
  chits: many(chit),
}));

export const chitRelations = relations(chit, ({ one }) => ({
  vault: one(vault, {
    fields: [chit.vaultId],
    references: [vault.id],
  }),
}));
