import { z } from "zod";

export const zPreProcessEmptyString = <I extends z.ZodTypeAny>(schema: I) =>
  z.preprocess((arg) => {
    if (typeof arg === "string" && arg === "") {
      return undefined;
    } else {
      return arg;
    }
  }, schema);

// Re-export all the schemas from sub-files
export * from "./auth";
export * from "./submit";
export * from "./profile";
