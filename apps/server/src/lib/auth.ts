import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "../db";
import { username } from "better-auth/plugins";
import * as schema from "../db/schema";
import { generateId } from "./utils";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: schema,
  }),
  databaseHooks: {
    user: {
      create: {
        after: async (user, context) => {
          await setupNewAccount(user.id);
        },
      },
    },
  },
  trustedOrigins: [process.env.CORS_ORIGIN || ""],
  socialProviders: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID || "",
      clientSecret: process.env.GITHUB_CLIENT_SECRET || "",
      mapProfileToUser(profile) {
        return {
          id: generateId("user"),
          name: profile.name || profile.login,
          email: profile.email,
          image: profile.avatar_url,
          username: profile.login,
          displayUsername: profile.login,
          emailVerified: true,
          bio: profile.bio || "",
        };
      },
    },
  },
  secret: process.env.BETTER_AUTH_SECRET,
  baseURL: process.env.BETTER_AUTH_URL,
  plugins: [
    username({
      usernameValidator: (username) => {
        if (username === "admin") {
          return false;
        }
        return true;
      },
    }),
  ],
});

async function setupNewAccount(userId: string) {
  try {
    const vault = await db.query.vault.findFirst({
      where: (vaults, { eq, and }) =>
        and(eq(vaults.userId, userId), eq(vaults.isDefault, true)),
    });

    if (!vault) {
      await db.insert(schema.vault).values({
        id: generateId("vault"),
        name: "Personal Vault",
        userId: userId,
        isDefault: true,
      });
    }
  } catch (error) {
    console.error("Error setting up new account:", error);
  }
}
