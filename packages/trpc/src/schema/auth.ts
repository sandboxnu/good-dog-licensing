import { z } from "zod";

export const zPasswordValidation = z
  .string()
  .min(8, "Password must be at least 8 characters long");
/* TODO: re-introduce stricter password requirements once we have better UX on the frontend */
//   .regex(/[a-z]/, "Password must contain at least one lowercase letter")
//   .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
//   .regex(/[0-9]/, "Password must contain at least one number")
//   .regex(
//     /[^a-zA-Z0-9]/,
//     "Password must contain at least one special character",
// );

export const zPasswordValues = z.object({
  password: zPasswordValidation,
});

export const zSignUpValues = z.object({
  email: z.string().email(),
  phoneNumber: z
    .string()
    .regex(
      /[-.\s]?(\(?\d{3}\)?)[-.\s]?\d{3}[-.\s]?\d{4}$/,
      "Phone number must be a valid US format such as 1234567890, 123-456-7890, or (123) 456-7890.",
    ),
  password: zPasswordValidation,
  confirmPassword: z.string(),
  firstName: z.string(),
  lastName: z.string(),
});

export const zSignInValues = z.object({
  email: z.string().email(),
  password: z.string(),
});

export const zForgotPasswordValues = z.object({
  email: z.string().email(),
});
