import type { TRPCClientErrorLike } from "@trpc/client";
import type { inferProcedureOutput } from "@trpc/server";

import type { AppRouter } from "./internal/router";
import type { PublicUserFull } from "./dtos";

export type TRPCErrorLike = TRPCClientErrorLike<AppRouter>;
export type GetProcedureOutput<T extends keyof AppRouter> =
  inferProcedureOutput<AppRouter[T]>;

export type UserWithSession = PublicUserFull & {
  session: {
    expiresAt: Date;
    refreshRequired: boolean;
  };
};
