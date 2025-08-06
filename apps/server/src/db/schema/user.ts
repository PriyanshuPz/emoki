import { relations } from "drizzle-orm";
import {
  pgTable,
  text,
  timestamp,
  boolean,
  integer,
} from "drizzle-orm/pg-core";
import { vault } from "./chits";

enum AccountStatus {
  Active = "active",
  Inactive = "inactive",
  Suspended = "suspended",
}

export const user = pgTable("user", {
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

enum FriendShipStatus {
  Pending = "pending",
  Accepted = "accepted",
  Declined = "declined",
}

export const friendship = pgTable("friendship", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  friendId: text("friend_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  status: text("status")
    .$type<FriendShipStatus>()
    .notNull()
    .default(FriendShipStatus.Pending),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
});

export const userRelations = relations(user, ({ many }) => ({
  friendships: many(friendship),
  vaults: many(vault),
}));

export const friendshipRelations = relations(friendship, ({ one }) => ({
  user: one(user),
  friend: one(user),
}));
