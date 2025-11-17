import { initTRPC } from "@trpc/server";
import SuperJSON from "superjson";
import { ZodError } from "zod";

import { env } from "@good-dog/env";
import * as Sentry from "@sentry/node";

import type { createTRPCContext } from "./context";

// Avoid exporting the entire t-object
// since it's not very descriptive.
// For instance, the use of a t variable
// is common in i18n libraries.
const t = initTRPC
  .context<Awaited<ReturnType<typeof createTRPCContext>>>()
  .create({
    /**
     * @see https://trpc.io/docs/server/data-transformers
     */
    transformer: SuperJSON,
    errorFormatter: ({ shape, error }) => ({
      ...shape,
      data: {
        ...shape.data,
        zodError:
          error.code === "BAD_REQUEST" && error.cause instanceof ZodError
            ? error.cause.flatten()
            : null,
        prismaError:
          env.VERCEL_ENV !== "production" &&
          error.code === "INTERNAL_SERVER_ERROR" &&
          error.cause &&
          "clientVersion" in error.cause
            ? error.cause
            : null,
      },
    }),
  });

// Base router and procedure helpers
export const createTRPCRouter = t.router;
export const createCallerFactory = t.createCallerFactory;

const sentryMiddleware = t.middleware(
  Sentry.trpcMiddleware({
    attachRpcInput: true,
  }),
);

// Procedure builders
export const baseProcedureBuilder = t.procedure.use(sentryMiddleware);
