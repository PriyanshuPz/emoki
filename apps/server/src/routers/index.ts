import { db } from "../db";
import { protectedProcedure, publicProcedure, router } from "../lib/trpc";
import z from "zod";
import { chits, vaults, VaultState } from "../db/schema";
import { generateId } from "../lib/utils";
import { and, eq, count } from "drizzle-orm";
import { TRPCError } from "@trpc/server";

export const appRouter = router({
  healthCheck: publicProcedure.query(({ ctx }) => {
    if (ctx.session) {
      return `OK - Authenticated as ${ctx.session.user.email}`;
    }
    return "OK - Not authenticated";
  }),

  fetchVaults: protectedProcedure.query(async ({ ctx }) => {
    const vaults = await db.query.vaults.findMany({
      where: (vaults, { eq }) =>
        and(
          eq(vaults.userId, ctx.session.user.id),
          eq(vaults.state, VaultState.Active)
        ),
    });

    return [
      ...vaults.map((vaults) => ({
        id: vaults.id,
        name: vaults.name,
        description: vaults.description,
      })),
    ];
  }),

  // Get all vaultss with chits counts
  getVaultsWithCounts: protectedProcedure.query(async ({ ctx }) => {
    const vaultssWithCounts = await db
      .select({
        id: vaults.id,
        name: vaults.name,
        description: vaults.description,
        isDefault: vaults.isDefault,
        isPublic: vaults.isPublic,
        createdAt: vaults.createdAt,
        chitCount: count(chits.id),
      })
      .from(vaults)
      .leftJoin(
        chits,
        and(eq(chits.vaultId, vaults.id), eq(chits.state, VaultState.Active))
      )
      .where(
        and(
          eq(vaults.userId, ctx.session.user.id),
          eq(vaults.state, VaultState.Active)
        )
      )
      .groupBy(vaults.id)
      .orderBy(vaults.createdAt);

    return vaultssWithCounts;
  }),

  // Get vaults with its chitss
  getVaultWithChits: protectedProcedure
    .input(z.object({ vaultId: z.string() }))
    .query(async ({ input, ctx }) => {
      const vaultsData = await db.query.vaults.findFirst({
        where: (vaults, { eq, and }) =>
          and(
            eq(vaults.id, input.vaultId),
            eq(vaults.userId, ctx.session.user.id),
            eq(vaults.state, VaultState.Active)
          ),
        with: {
          chits: {
            where: (chits, { eq }) => eq(chits.state, VaultState.Active),
            orderBy: (chits, { asc }) => [asc(chits.createdAt)],
          },
        },
      });

      if (!vaultsData) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "vaults not found",
        });
      }

      return {
        vault: {
          id: vaultsData.id,
          name: vaultsData.name,
          description: vaultsData.description,
          isDefault: vaultsData.isDefault,
          isPublic: vaultsData.isPublic,
          createdAt: vaultsData.createdAt,
        },
        chits: vaultsData.chits.map((c) => ({
          id: c.id,
          content: c.content,
          createdAt: c.createdAt,
          updatedAt: c.updatedAt,
        })),
      };
    }),

  // Create a new vaults
  createVault: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1, "vaults name is required").max(100),
        description: z.string().max(500).optional(),
        isPublic: z.boolean().default(false),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const vaultId = generateId("vaults");
      await db.insert(vaults).values({
        id: vaultId,
        userId: ctx.session.user.id,
        name: input.name,
        description: input.description,
        isPublic: input.isPublic,
        isDefault: false,
      });

      return { success: true, vaultId };
    }),

  // Update vaults
  updateVault: protectedProcedure
    .input(
      z.object({
        vaultId: z.string(),
        name: z.string().min(1, "vaults name is required").max(100),
        description: z.string().max(500).optional(),
        isPublic: z.boolean(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      await db
        .update(vaults)
        .set({
          name: input.name,
          description: input.description,
          isPublic: input.isPublic,
          updatedAt: new Date(),
        })
        .where(
          and(
            eq(vaults.id, input.vaultId),
            eq(vaults.userId, ctx.session.user.id),
            eq(vaults.state, VaultState.Active)
          )
        );

      return { success: true };
    }),

  // Delete vaults (soft delete by setting state to deleted)
  deleteVault: protectedProcedure
    .input(z.object({ vaultId: z.string() }))
    .mutation(async ({ input, ctx }) => {
      // Check if it's the default vaults
      const vaultsToDelete = await db.query.vaults.findFirst({
        where: (vaults, { eq, and }) =>
          and(
            eq(vaults.id, input.vaultId),
            eq(vaults.userId, ctx.session.user.id),
            eq(vaults.state, VaultState.Active)
          ),
        columns: { isDefault: true },
      });

      if (!vaultsToDelete) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "vaults not found",
        });
      }

      if (vaultsToDelete.isDefault) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Cannot delete the default vaults",
        });
      }

      // Soft delete the vaults and its chitss
      await db
        .update(vaults)
        .set({ state: VaultState.Deleted, updatedAt: new Date() })
        .where(eq(vaults.id, input.vaultId));

      await db
        .update(chits)
        .set({ state: VaultState.Deleted, updatedAt: new Date() })
        .where(eq(chits.vaultId, input.vaultId));

      return { success: true };
    }),

  // Delete a chits
  deleteChit: protectedProcedure
    .input(z.object({ chitId: z.string() }))
    .mutation(async ({ input, ctx }) => {
      await db
        .update(chits)
        .set({ state: VaultState.Deleted, updatedAt: new Date() })
        .where(
          and(
            eq(chits.id, input.chitId),
            eq(chits.userId, ctx.session.user.id),
            eq(chits.state, VaultState.Active)
          )
        );

      return { success: true };
    }),

  // Transfer chits to another vaults
  transferChit: protectedProcedure
    .input(
      z.object({
        chitId: z.string(),
        targetVaultId: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      // Verify the target vaults belongs to the user
      const targetvaults = await db.query.vaults.findFirst({
        where: (vaults, { eq, and }) =>
          and(
            eq(vaults.id, input.targetVaultId),
            eq(vaults.userId, ctx.session.user.id),
            eq(vaults.state, VaultState.Active)
          ),
        columns: { id: true },
      });

      if (!targetvaults) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Target vaults not found",
        });
      }

      // Transfer the chits
      await db
        .update(chits)
        .set({ vaultId: input.targetVaultId, updatedAt: new Date() })
        .where(
          and(
            eq(chits.id, input.chitId),
            eq(chits.userId, ctx.session.user.id),
            eq(chits.state, VaultState.Active)
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
          // If no vaultId is provided, use the first vaults of the user
          const vaultss = await db.query.vaults.findMany({
            where: (vaults, { eq }) =>
              and(
                eq(vaults.userId, ctx.session.user.id),
                eq(vaults.isDefault, true)
              ),
          });
          if (vaultss.length > 0) {
            vaultIdToUse = vaultss[0].id;
          } else {
            throw new Error("No vaultss found for the user");
          }
        }
        if (!content || content.trim() === "") {
          throw new Error("Content cannot be empty");
        }

        const newchits = await db.insert(chits).values({
          id: generateId("chits"),
          content,
          vaultId: vaultIdToUse,
          userId: ctx.session.user.id,
        });

        return {
          message: "chits saved successfully",
        };
      } catch (error) {
        console.error("Error saving chits:", error);
        throw new Error("Failed to save chits");
      }
    }),
});
export type AppRouter = typeof appRouter;
