import express from "express";
import cors from "cors";
import * as trpcExpress from "@trpc/server/adapters/express";
import createContext from "./trpc";
import { appRouter } from "./router";
import * as trpcWS from "@trpc/server/adapters/ws";
import ws from "ws";

const app = express();
app.use(cors());

app.use(
  "/trpc",
  trpcExpress.createExpressMiddleware({
    router: appRouter,
    createContext
  })
);

const server = app.listen(3000);

trpcWS.applyWSSHandler({
  wss: new ws.Server({ server }),
  router: appRouter,
  createContext
});

export type AppRouter = typeof appRouter;
