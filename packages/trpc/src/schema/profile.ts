import { z } from "zod";

import { MusicAffiliation } from "@good-dog/db";

import { zPasswordValidation } from "./auth";
import { zRequiredEmail, zRequiredString } from "./base";

export const zAffiliationValidation = z.enum(MusicAffiliation);

export const zProfileValues = z
  .object({
    firstName: zRequiredString,
    lastName: zRequiredString,
    ipi: z.string().optional().nullable(),
    affiliation: zAffiliationValidation.optional().nullable(),
    otherAffiliationName: z.string().optional().nullable(),
  })
  .superRefine((data, ctx) => {
    if (data.affiliation === "OTHER" && !data.otherAffiliationName) {
      ctx.addIssue({
        code: "custom",
        message: "Please specify the name of your affiliation",
        path: ["otherAffiliationName"],
      });
    }
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
