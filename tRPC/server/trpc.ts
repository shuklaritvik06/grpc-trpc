import * as trpcExpress from "@trpc/server/adapters/express";
import { initTRPC, inferAsyncReturnType, TRPCError } from "@trpc/server";
const createContext = () => {
  return {
    role: true
  };
};
type Context = inferAsyncReturnType<typeof createContext>;
export const t = initTRPC.context<Context>().create();
const isAdminMiddleware = t.middleware(({ ctx, next }) => {
  if (!ctx.role) {
    throw new TRPCError({
      code: "UNAUTHORIZED"
    });
  }
  return next({
    ctx: {
      user: {
        id: 1
      }
    }
  });
});
export const adminProcedure = t.procedure.use(isAdminMiddleware);
export default createContext;
