import { PrismaClient, ReferralSource } from "@prisma/client";

export const prisma = new PrismaClient();

export { ReferralSource };
export type ReferralType = keyof typeof ReferralSource;

export function referralDisplay(referral: ReferralSource) {
  switch (referral) {
    case "FRIEND":
      return "Friend";
    case "COLLEAGUE":
      return "Colleague";
    case "GREEN_LINE_RECORDS":
      return "Green Line Records";
    case "SOCIAL_MEDIA":
      return "Social Media";
    case "OTHER":
      return "Other";
    default:
      return "None";
  }
}
