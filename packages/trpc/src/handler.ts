import "server-only";

import * as Sentry from "@sentry/node";
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";

import { createTRPCContext } from "./internal/context";
import { appRouter } from "./internal/router";

// Ensure to call this before importing any other modules!
Sentry.init({
  dsn: "https://a1b5634f3f8341ef01326f6575875bde@o4510361217990656.ingest.us.sentry.io/4510371462774784",
  // Send user info (e.g. automatic IP address collection on events) to Sentry.
  dataCollection: { userInfo: true },
});

export default (req: Request) =>
  fetchRequestHandler({
    endpoint: "/api/trpc",
    req,
    router: appRouter,
    createContext: createTRPCContext,
  });
