import { z } from "zod";

import { ReferralSource } from "@good-dog/db";

export const zPasswordValidation = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .regex(
    /[!@#$%^&*(),.?":{}|<>]/,
    "Password must contain at least 1 special character",
  )
  .regex(/[A-Z]/, "Password must contain at least 1 uppercase character");

export const zPasswordValues = z.object({
  password: zPasswordValidation,
});

export const zSignUpValues = z.object({
  email: z.email(),
  phoneNumber: z
    .string()
    .regex(
      /[-.\s]?(\(?\d{3}\)?)[-.\s]?\d{3}[-.\s]?\d{4}$/,
      "Phone number must be a valid US format such as 1234567890, 123-456-7890, or (123) 456-7890.",
    ),
  password: zPasswordValidation,
  confirmPassword: z.string(),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  referral: z.enum(ReferralSource),
  role: z.enum(["MUSICIAN", "MEDIA_MAKER"]),
  emailCode: z.string(),
});

export const zSignInValues = z.object({
  email: z.email(),
  password: z.string(),
});

export const zForgotPasswordValues = z.object({
  email: z.email(),
});

export const zResetPasswordValues = z
  .object({
    password: zPasswordValidation,
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"], // This targets the confirmPassword field specifically
  });
