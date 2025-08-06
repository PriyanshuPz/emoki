import { relations } from "drizzle-orm";
import {
  text,
  timestamp,
  boolean,
  integer,
  pgTable,
} from "drizzle-orm/pg-core";
import { vaults } from "./chits";

enum AccountStatus {
  Active = "active",
  Inactive = "inactive",
  Suspended = "suspended",
}

export const users = pgTable("users", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").notNull(),
  image: text("image"),
  username: text("username").notNull().unique(),
  displayUsername: text("display_username").notNull(),

  bio: text("bio"),

  karma: integer("karma").notNull().default(0),

  xp: integer("xp").notNull().default(0),
  level: integer("level").notNull().default(1),

  accountStatus: text("account_status")
    .$type<AccountStatus>()
    .notNull()
    .default(AccountStatus.Active),

  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
});

export const userRelations = relations(users, ({ many }) => ({
  vaults: many(vaults),
}));
