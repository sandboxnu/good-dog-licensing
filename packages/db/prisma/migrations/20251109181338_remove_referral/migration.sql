/*
  Warnings:

  - You are about to drop the column `referral` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "referral";

-- DropEnum
DROP TYPE "ReferralSource";
