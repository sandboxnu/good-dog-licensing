import type { TRPCClientErrorLike } from "@trpc/client";
import type { inferProcedureOutput } from "@trpc/server";
import type { z } from "zod";

import type { zSessionUserOutput } from "./dto";
import type { AppRouter } from "./internal/router";

export type TRPCErrorLike = TRPCClientErrorLike<AppRouter>;
export type GetProcedureOutput<T extends keyof AppRouter> =
  inferProcedureOutput<AppRouter[T]>;

// Derived from the `user` procedure's output schema so this can never drift
// from what's actually sent to the client.
export type UserWithSession = z.infer<typeof zSessionUserOutput>;
