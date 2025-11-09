import z from "zod";

export const zRequiredString = z
  .string({ error: "This is required" })
  .min(1, { error: "This is required" });

export const zRequiredEmail = z.email({ error: "Please enter a valid email" });
