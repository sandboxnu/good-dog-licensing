/*
  Warnings:

  - The values [APPROVED,REJECTED,PENDING] on the enum `MatchState` will be removed. If these variants are still used in the database, this will fail.
  - The primary key for the `SuggestedMatches` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `description` on the `SuggestedMatches` table. All the data in the column will be lost.
  - You are about to drop the column `projectId` on the `SuggestedMatches` table. All the data in the column will be lost.
  - You are about to drop the column `reviewerId` on the `SuggestedMatches` table. All the data in the column will be lost.
  - You are about to drop the column `suggestedMatchId` on the `SuggestedMatches` table. All the data in the column will be lost.
  - You are about to drop the `MatchRatings` table. If the table is not empty, all the data it contains will be lost.
  - The required column `matchId` was added to the `SuggestedMatches` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "MatchState_new" AS ENUM ('NEW', 'SONG_REQUESTED', 'REJECTED_BY_MEDIA_MAKER', 'REJECTED_BY_MUSICIAN', 'APPROVED_BY_MUSICIAN');
ALTER TABLE "SuggestedMatches" ALTER COLUMN "matchState" TYPE "MatchState_new" USING ("matchState"::text::"MatchState_new");
ALTER TYPE "MatchState" RENAME TO "MatchState_old";
ALTER TYPE "MatchState_new" RENAME TO "MatchState";
DROP TYPE "MatchState_old";
COMMIT;

-- DropForeignKey
ALTER TABLE "MatchRatings" DROP CONSTRAINT "MatchRatings_suggestedMatchId_fkey";

-- DropForeignKey
ALTER TABLE "MatchRatings" DROP CONSTRAINT "MatchRatings_userId_fkey";

-- DropForeignKey
ALTER TABLE "SuggestedMatches" DROP CONSTRAINT "SuggestedMatches_projectId_fkey";

-- DropForeignKey
ALTER TABLE "SuggestedMatches" DROP CONSTRAINT "SuggestedMatches_reviewerId_fkey";

-- AlterTable
ALTER TABLE "SuggestedMatches" DROP CONSTRAINT "SuggestedMatches_pkey",
DROP COLUMN "description",
DROP COLUMN "projectId",
DROP COLUMN "reviewerId",
DROP COLUMN "suggestedMatchId",
ADD COLUMN     "matchId" TEXT NOT NULL,
ADD CONSTRAINT "SuggestedMatches_pkey" PRIMARY KEY ("matchId");

-- DropTable
DROP TABLE "MatchRatings";

-- DropEnum
DROP TYPE "Rating";
