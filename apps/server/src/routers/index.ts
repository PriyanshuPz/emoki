import { protectedProcedure, publicProcedure, router } from "../lib/trpc";

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
});
export type AppRouter = typeof appRouter;
