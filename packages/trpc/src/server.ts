import "server-only";

import { createHydrationHelpers } from "@trpc/react-query/rsc";

import type { AppRouter } from "./internal/router";
import { createCallerFactory, createTRPCContext } from "./internal/init";
import { QueryClientFactory } from "./internal/query-client-factory";
import { appRouter } from "./internal/router";

/**
 * This caller is not intended to be used directly.
 * Use `exclusively` for testing purposes with the `$trpcCaller` export.
 */
const caller = createCallerFactory(appRouter)(createTRPCContext);

export const { trpc, HydrateClient } = createHydrationHelpers<AppRouter>(
  caller,
  QueryClientFactory.stable,
);

export { caller as $trpcCaller };
