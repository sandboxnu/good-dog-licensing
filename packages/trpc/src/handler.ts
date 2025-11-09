import "server-only";

import * as Sentry from "@sentry/node";
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";

import { createTRPCContext } from "./internal/context";
import { appRouter } from "./internal/router";

export default (req: Request) =>
  fetchRequestHandler({
    endpoint: "/api/trpc",
    req,
    router: appRouter,
    createContext: createTRPCContext,
    onError: ({ error, path }) => {
      Sentry.captureException(error, {
        tags: {
          code: error.code,
          path,
        },
        extra: {
          message: error.message,
          cause: error.cause?.toString(),
        },
      });
    },
  });
