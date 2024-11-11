import { TRPCClientErrorLike } from "@trpc/client";
import { z } from "zod";

import { AppRouter } from "./internal/router";

export type TRPCErrorLike = TRPCClientErrorLike<AppRouter>;

export const zPreProcessEmptyString = <I extends z.ZodTypeAny>(schema: I) =>
  z.preprocess((arg) => {
    if (typeof arg === "string" && arg === "") {
      return undefined;
    } else {
      return arg;
    }
  }, schema);
