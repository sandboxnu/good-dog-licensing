/*
  Warnings:

  - The values [ONBOARDING] on the enum `Role` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `groupId` on the `MusicSubmission` table. All the data in the column will be lost.
  - You are about to drop the column `stageName` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `MusicianGroup` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `MusicianGroupMember` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Referral` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_songWriters` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Role_new" AS ENUM ('MUSICIAN', 'MEDIA_MAKER', 'ADMIN', 'MODERATOR');
ALTER TABLE "User" ALTER COLUMN "role" TYPE "Role_new" USING ("role"::text::"Role_new");
ALTER TYPE "Role" RENAME TO "Role_old";
ALTER TYPE "Role_new" RENAME TO "Role";
DROP TYPE "Role_old";
COMMIT;

-- DropForeignKey
ALTER TABLE "MusicSubmission" DROP CONSTRAINT "MusicSubmission_groupId_fkey";

-- DropForeignKey
ALTER TABLE "MusicianGroup" DROP CONSTRAINT "MusicianGroup_organizerId_fkey";

-- DropForeignKey
ALTER TABLE "MusicianGroupMember" DROP CONSTRAINT "MusicianGroupMember_groupId_fkey";

-- DropForeignKey
ALTER TABLE "Referral" DROP CONSTRAINT "Referral_userId_fkey";

-- DropForeignKey
ALTER TABLE "_songWriters" DROP CONSTRAINT "_songWriters_A_fkey";

-- DropForeignKey
ALTER TABLE "_songWriters" DROP CONSTRAINT "_songWriters_B_fkey";

-- AlterTable
ALTER TABLE "MusicSubmission" DROP COLUMN "groupId";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "stageName",
ADD COLUMN     "referral" "ReferralSource",
ALTER COLUMN "isAscapAffiliated" DROP NOT NULL,
ALTER COLUMN "isAscapAffiliated" DROP DEFAULT,
ALTER COLUMN "isBmiAffiliated" DROP NOT NULL,
ALTER COLUMN "isBmiAffiliated" DROP DEFAULT,
ALTER COLUMN "isSongWriter" DROP NOT NULL,
ALTER COLUMN "isSongWriter" DROP DEFAULT;

-- DropTable
DROP TABLE "MusicianGroup";

-- DropTable
DROP TABLE "MusicianGroupMember";

-- DropTable
DROP TABLE "Referral";

-- DropTable
DROP TABLE "_songWriters";
