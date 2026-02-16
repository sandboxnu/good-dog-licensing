import { z } from "zod";

import { zRequiredEmail, zRequiredString } from "./base";

export const zPasswordValidation = zRequiredString
  .min(8, "Password must be at least 8 characters")
  .regex(
    /[!@#$%^&*(),.?":{}|<>]/,
    "Password must contain at least 1 special character",
  )
  .regex(/[A-Z]/, "Password must contain at least 1 uppercase character");

export const zPasswordValues = z.object({
  password: zPasswordValidation,
});

export const zSignUpValues = z
  .object({
    email: zRequiredEmail,
    phoneNumber: zRequiredString.regex(
      /[-.\s]?(\(?\d{3}\)?)[-.\s]?\d{3}[-.\s]?\d{4}$/,
      "Phone number must be a valid US format such as 1234567890, 123-456-7890, or (123) 456-7890.",
    ),
    password: zPasswordValidation,
    confirmPassword: zRequiredString,
    firstName: zRequiredString,
    lastName: zRequiredString,
    role: z.enum(["MUSICIAN", "MEDIA_MAKER"], { error: "This is required" }),
    emailCode: zRequiredString,
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export const zSignInValues = z.object({
  email: zRequiredEmail,
  password: zRequiredString,
  rememberMe: z.boolean().default(false),
});

export const zForgotPasswordValues = z.object({
  email: zRequiredEmail,
});

export const zResetPasswordValues = z
  .object({
    password: zPasswordValidation,
    confirmPassword: zRequiredString,
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"], // This targets the confirmPassword field specifically
  });
