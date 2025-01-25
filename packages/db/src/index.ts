import type { ReferralSource as PrismaReferralSource } from "@prisma/client";
import { PrismaClient } from "@prisma/client";

export const prisma = new PrismaClient();

export const ReferralSource: Record<PrismaReferralSource, string> = {
  FRIEND: "Friend",
  COLLEAGUE: "Colleague",
  GREEN_LINE_RECORDS: "Green Line Records",
  SOCIAL_MEDIA: "Social Media",
  OTHER: "Other",
} as const;

export type ReferralType = keyof typeof ReferralSource;
