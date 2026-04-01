import type { Prisma } from "@good-dog/db";

/**
 * Backend only. Use when hashedPassword is required (e.g. sign-in, existence checks).
 * Never return a PrivateUser to the frontend.
 */
export const privateUserSelect = {
  userId: true,
  email: true,
  hashedPassword: true,
  firstName: true,
  lastName: true,
  role: true,
  active: true,
} satisfies Prisma.UserSelect;

export type PrivateUser = Prisma.UserGetPayload<{
  select: typeof privateUserSelect;
}>;

/**
 * Full public profile — all fields safe for the frontend, no hashedPassword.
 * Use for the current user's profile view and the admin manage-users page.
 */
export const publicUserFullSelect = {
  userId: true,
  email: true,
  phoneNumber: true,
  firstName: true,
  lastName: true,
  role: true,
  active: true,
  affiliation: true,
  ipi: true,
  createdAt: true,
} satisfies Prisma.UserSelect;

export type PublicUserFull = Prisma.UserGetPayload<{
  select: typeof publicUserFullSelect;
}>;

/**
 * Minimal user info for lists, name badges, project manager assignment, etc.
 * Use as the nested select whenever a relation to User is included in a query.
 */
export const publicUserSummarySelect = {
  userId: true,
  firstName: true,
  lastName: true,
  email: true,
  role: true,
  active: true,
} satisfies Prisma.UserSelect;

export type PublicUserSummary = Prisma.UserGetPayload<{
  select: typeof publicUserSummarySelect;
}>;
