import type { TRPCClientErrorLike } from "@trpc/client";
import type { inferProcedureOutput } from "@trpc/server";

import type { MusicAffiliation, Role } from "@good-dog/db";

import type { AppRouter } from "./internal/router";

export type TRPCErrorLike = TRPCClientErrorLike<AppRouter>;
export type GetProcedureOutput<T extends keyof AppRouter> =
  inferProcedureOutput<AppRouter[T]>;

export interface UserWithSession {
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  role: Role;
  session: {
    expiresAt: Date;
    refreshRequired: boolean;
  };
  createdAt: Date;
  affiliation: MusicAffiliation | null;
  ipi: string | null;
}
