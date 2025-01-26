import type { ReferralSource } from "@prisma/client";
import { PrismaClient } from "@prisma/client";

export const prisma = new PrismaClient();

export { ReferralSource };
export type ReferralType = keyof typeof ReferralSource;
