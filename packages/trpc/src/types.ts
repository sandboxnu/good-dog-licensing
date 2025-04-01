import type { TRPCClientErrorLike } from "@trpc/client";
import type { inferProcedureOutput } from "@trpc/server";

import type { AppRouter } from "./internal/router";

export type { UserWithSession } from "./internal/common-types";

export type TRPCErrorLike = TRPCClientErrorLike<AppRouter>;
export type GetProcedureOutput<T extends keyof AppRouter> =
  inferProcedureOutput<AppRouter[T]>;
