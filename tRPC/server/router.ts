import { adminProcedure, t } from "./trpc";
import { z } from "zod";
import { observable } from "@trpc/server/observable";
import { EventEmitter } from "stream";

const events = new EventEmitter();

const userRouter = t.router({
  getUser: t.procedure.query((req) => {
    return [{ id: 1, name: "RAKESH" }];
  })
});

export const appRouter = t.router({
  greet: t.procedure.input(z.string()).query((req) => {
    console.log(req.ctx);
    return req.input;
  }),
  addData: t.procedure
    .input(
      z.object({
        name: z.string(),
        email: z.string().email()
      })
    )
    .mutation((req) => {
      console.log(req.input);
      events.emit("add", req.input.email);
    }),
  secretData: adminProcedure.query(({ ctx }) => {
    console.log(ctx.user);
  }),
  users: userRouter,
  onaddData: t.procedure.subscription(() => {
    return observable<object>((emit) => {
      events.on("add", emit.next);
      return () => {
        events.off("add", emit.next);
      };
    });
  })
});
