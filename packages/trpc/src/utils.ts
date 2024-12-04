import type { TRPCClientErrorLike } from "@trpc/client";
import type { inferProcedureOutput } from "@trpc/server";
import { z } from "zod";

import type { AppRouter } from "./internal/router";

export type TRPCErrorLike = TRPCClientErrorLike<AppRouter>;

export const zPreProcessEmptyString = <I extends z.ZodTypeAny>(schema: I) =>
  z.preprocess((arg) => {
    if (typeof arg === "string" && arg === "") {
      return undefined;
    } else {
      return arg;
    }
  }, schema);

export type GetProcedureOutput<T extends keyof AppRouter> =
  inferProcedureOutput<AppRouter[T]>;
