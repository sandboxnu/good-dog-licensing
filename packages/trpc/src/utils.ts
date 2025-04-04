import { z } from "zod";

export const zPreProcessEmptyString = <I extends z.ZodTypeAny>(schema: I) =>
  z.preprocess((arg) => {
    if (typeof arg === "string" && arg === "") {
      return undefined;
    } else {
      return arg;
    }
  }, schema);
