import { z } from "zod";

import { zRequiredEmail, zRequiredString } from "./base";
import { MusicAffiliation } from "@good-dog/db";
import { zPasswordValidation } from "./auth";

export const zAffiliationValidation = z.enum(MusicAffiliation);

export const zProfileValues = z.object({
  firstName: zRequiredString,
  lastName: zRequiredString,
  ipi: z.string().optional().nullable(),
  affiliation: zAffiliationValidation.optional().nullable(),
});

export const zSetEmailValues = z.object({
  email: zRequiredEmail,
  emailCode: zRequiredString,
});

export const zSetPasswordValues = z
  .object({
    password: zPasswordValidation,
    confirmPassword: zRequiredString,
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });
