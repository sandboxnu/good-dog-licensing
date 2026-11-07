import "server-only";

import type { RouterCaller } from "@trpc/server/unstable-core-do-not-import";
import { createHydrationHelpers } from "@trpc/react-query/rsc";

import type { AppRouter } from "./internal/router";
import { createTRPCContext } from "./internal/context";
import { createCallerFactory } from "./internal/init";
import { QueryClientFactory } from "./internal/query-client-factory";
import { appRouter } from "./internal/router";

/**
 * This caller is not intended to be used directly.
 * Use `exclusively` for testing purposes with the `$trpcCaller` export.
 */
const callerFactory = createCallerFactory(appRouter);
const caller = callerFactory(createTRPCContext);

export const getServerQueryClient = () => QueryClientFactory.stable();

export const { trpc, HydrateClient } = createHydrationHelpers<AppRouter>(
  caller,
  getServerQueryClient,
);

/**
 * @unstable
 * This caller used for testing purposes allows the user to pass in a partial context.
 */
export const $createTrpcCaller =
  callerFactory as typeof callerFactory extends RouterCaller<
    {
      ctx: infer TCtx;
      meta: infer TMeta;
      errorShape: infer TErrorShape;
      transformer: infer TTransformer;
    },
    infer TRecord
  >
    ? RouterCaller<
        {
          ctx: Partial<TCtx>;
          meta: TMeta;
          errorShape: TErrorShape;
          transformer: TTransformer;
        },
        TRecord
      >
    : never;
