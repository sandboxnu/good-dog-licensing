import "server-only";

import { fetchRequestHandler } from "@trpc/server/adapters/fetch";

import { createTRPCContext } from "./internal/context";
import { appRouter } from "./internal/router";

export default (req: Request) =>
  fetchRequestHandler({
    endpoint: "/api/trpc",
    req,
    router: appRouter,
    createContext: createTRPCContext,
  });
