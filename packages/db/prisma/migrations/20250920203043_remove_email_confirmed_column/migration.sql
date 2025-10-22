/*
  Warnings:

  - You are about to drop the column `emailConfirmed` on the `EmailVerificationCode` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "EmailVerificationCode" DROP COLUMN "emailConfirmed";
