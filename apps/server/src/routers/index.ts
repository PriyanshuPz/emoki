import { db } from "@/db";
import { protectedProcedure, publicProcedure, router } from "../lib/trpc";
import z from "zod";
import { chit, vault, VaultState } from "@/db/schema";
import { generateId } from "@/lib/utils";
import { and, eq, count } from "drizzle-orm";
import { TRPCError } from "@trpc/server";

export const appRouter = router({
  healthCheck: publicProcedure.query(({ ctx }) => {
    if (ctx.session) {
      return `OK - Authenticated as ${ctx.session.user.email}`;
    }
    return "OK - Not authenticated";
  }),
  privateData: protectedProcedure.query(({ ctx }) => {
    return {
      message: "This is private",
      user: ctx.session.user,
    };
  }),

  fetchVaults: protectedProcedure.query(async ({ ctx }) => {
    const vaults = await db.query.vault.findMany({
      where: (vault, { eq }) =>
        and(
          eq(vault.userId, ctx.session.user.id),
          eq(vault.state, VaultState.Active)
        ),
    });

    return [
      ...vaults.map((vault) => ({
        id: vault.id,
        name: vault.name,
        description: vault.description,
      })),
    ];
  }),

  // Get all vaults with chit counts
  getVaultsWithCounts: protectedProcedure.query(async ({ ctx }) => {
    const vaultsWithCounts = await db
      .select({
        id: vault.id,
        name: vault.name,
        description: vault.description,
        isDefault: vault.isDefault,
        isPublic: vault.isPublic,
        createdAt: vault.createdAt,
        chitCount: count(chit.id),
      })
      .from(vault)
      .leftJoin(
        chit,
        and(eq(chit.vaultId, vault.id), eq(chit.state, VaultState.Active))
      )
      .where(
        and(
          eq(vault.userId, ctx.session.user.id),
          eq(vault.state, VaultState.Active)
        )
      )
      .groupBy(vault.id)
      .orderBy(vault.createdAt);

    return vaultsWithCounts;
  }),

  // Get vault with its chits
  getVaultWithChits: protectedProcedure
    .input(z.object({ vaultId: z.string() }))
    .query(async ({ input, ctx }) => {
      const vaultData = await db.query.vault.findFirst({
        where: (vault, { eq, and }) =>
          and(
            eq(vault.id, input.vaultId),
            eq(vault.userId, ctx.session.user.id),
            eq(vault.state, VaultState.Active)
          ),
        with: {
          chits: {
            where: (chit, { eq }) => eq(chit.state, VaultState.Active),
            orderBy: (chit, { asc }) => [asc(chit.createdAt)],
          },
        },
      });

      if (!vaultData) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Vault not found",
        });
      }

      return {
        vault: {
          id: vaultData.id,
          name: vaultData.name,
          description: vaultData.description,
          isDefault: vaultData.isDefault,
          isPublic: vaultData.isPublic,
          createdAt: vaultData.createdAt,
        },
        chits: vaultData.chits.map((c) => ({
          id: c.id,
          content: c.content,
          createdAt: c.createdAt,
          updatedAt: c.updatedAt,
        })),
      };
    }),

  // Create a new vault
  createVault: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1, "Vault name is required").max(100),
        description: z.string().max(500).optional(),
        isPublic: z.boolean().default(false),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const vaultId = generateId("vault");
      await db.insert(vault).values({
        id: vaultId,
        userId: ctx.session.user.id,
        name: input.name,
        description: input.description,
        isPublic: input.isPublic,
        isDefault: false,
      });

      return { success: true, vaultId };
    }),

  // Update vault
  updateVault: protectedProcedure
    .input(
      z.object({
        vaultId: z.string(),
        name: z.string().min(1, "Vault name is required").max(100),
        description: z.string().max(500).optional(),
        isPublic: z.boolean(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      await db
        .update(vault)
        .set({
          name: input.name,
          description: input.description,
          isPublic: input.isPublic,
          updatedAt: new Date(),
        })
        .where(
          and(
            eq(vault.id, input.vaultId),
            eq(vault.userId, ctx.session.user.id),
            eq(vault.state, VaultState.Active)
          )
        );

      return { success: true };
    }),

  // Delete vault (soft delete by setting state to deleted)
  deleteVault: protectedProcedure
    .input(z.object({ vaultId: z.string() }))
    .mutation(async ({ input, ctx }) => {
      // Check if it's the default vault
      const vaultToDelete = await db.query.vault.findFirst({
        where: (vault, { eq, and }) =>
          and(
            eq(vault.id, input.vaultId),
            eq(vault.userId, ctx.session.user.id),
            eq(vault.state, VaultState.Active)
          ),
        columns: { isDefault: true },
      });

      if (!vaultToDelete) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Vault not found",
        });
      }

      if (vaultToDelete.isDefault) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Cannot delete the default vault",
        });
      }

      // Soft delete the vault and its chits
      await db
        .update(vault)
        .set({ state: VaultState.Deleted, updatedAt: new Date() })
        .where(eq(vault.id, input.vaultId));

      await db
        .update(chit)
        .set({ state: VaultState.Deleted, updatedAt: new Date() })
        .where(eq(chit.vaultId, input.vaultId));

      return { success: true };
    }),

  // Delete a chit
  deleteChit: protectedProcedure
    .input(z.object({ chitId: z.string() }))
    .mutation(async ({ input, ctx }) => {
      await db
        .update(chit)
        .set({ state: VaultState.Deleted, updatedAt: new Date() })
        .where(
          and(
            eq(chit.id, input.chitId),
            eq(chit.userId, ctx.session.user.id),
            eq(chit.state, VaultState.Active)
          )
        );

      return { success: true };
    }),

  // Transfer chit to another vault
  transferChit: protectedProcedure
    .input(
      z.object({
        chitId: z.string(),
        targetVaultId: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      // Verify the target vault belongs to the user
      const targetVault = await db.query.vault.findFirst({
        where: (vault, { eq, and }) =>
          and(
            eq(vault.id, input.targetVaultId),
            eq(vault.userId, ctx.session.user.id),
            eq(vault.state, VaultState.Active)
          ),
        columns: { id: true },
      });

      if (!targetVault) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Target vault not found",
        });
      }

      // Transfer the chit
      await db
        .update(chit)
        .set({ vaultId: input.targetVaultId, updatedAt: new Date() })
        .where(
          and(
            eq(chit.id, input.chitId),
            eq(chit.userId, ctx.session.user.id),
            eq(chit.state, VaultState.Active)
          )
        );

      return { success: true };
    }),

  saveChit: protectedProcedure
    .input(
      z.object({
        content: z.string(),
        vaultId: z.string().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { content, vaultId } = input;
      try {
        let vaultIdToUse = vaultId;
        if (!vaultIdToUse) {
          // If no vaultId is provided, use the first vault of the user
          const vaults = await db.query.vault.findMany({
            where: (vault, { eq }) =>
              and(
                eq(vault.userId, ctx.session.user.id),
                eq(vault.isDefault, true)
              ),
          });
          if (vaults.length > 0) {
            vaultIdToUse = vaults[0].id;
          } else {
            throw new Error("No vaults found for the user");
          }
        }
        if (!content || content.trim() === "") {
          throw new Error("Content cannot be empty");
        }

        const newChit = await db.insert(chit).values({
          id: generateId("chit"),
          content,
          vaultId: vaultIdToUse,
          userId: ctx.session.user.id,
        });

        return {
          message: "Chit saved successfully",
        };
      } catch (error) {
        console.error("Error saving chit:", error);
        throw new Error("Failed to save chit");
      }
    }),
});
export type AppRouter = typeof appRouter;
