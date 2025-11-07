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
    onError: ({ path, error }) => {
      console.error(
        `❌ tRPC failed on ${path ?? "<no-path>"}:`,
        error.message,
      );
      // Log the full error in development
      
        console.error("Full error:", error);
    },
  });