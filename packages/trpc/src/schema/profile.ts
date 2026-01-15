import { z } from "zod";

import { zRequiredEmail, zRequiredString } from "./base";
import { MusicAffiliation } from "@good-dog/db";
import { zPasswordValidation } from "./auth";

export const zAffiliationValidation = z.enum(MusicAffiliation);

export const zProfileValues = z.object({
  firstName: zRequiredString,
  lastName: zRequiredString,
  ipi: zRequiredString,
  affiliation: zAffiliationValidation,
});

export const zChangeEmailValues = z.object({
  email: zRequiredEmail,
  emailCode: zRequiredString,
});

export const zChangePasswordValues = z.object({
  password: zPasswordValidation,
  confirmPassword: zRequiredString,
});
