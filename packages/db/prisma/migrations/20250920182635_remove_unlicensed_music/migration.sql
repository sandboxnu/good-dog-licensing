/*
  Warnings:

  - You are about to drop the column `unlicensedSuggestedMatchId` on the `MatchComments` table. All the data in the column will be lost.
  - You are about to drop the column `unlicensedSuggestedMatchId` on the `MatchRatings` table. All the data in the column will be lost.
  - You are about to drop the `UnlicensedMusicSubmission` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `UnlicensedSuggestedMatches` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "MatchComments" DROP CONSTRAINT "MatchComments_unlicensedSuggestedMatchId_fkey";

-- DropForeignKey
ALTER TABLE "MatchRatings" DROP CONSTRAINT "MatchRatings_unlicensedSuggestedMatchId_fkey";

-- DropForeignKey
ALTER TABLE "UnlicensedSuggestedMatches" DROP CONSTRAINT "UnlicensedSuggestedMatches_matcherUserId_fkey";

-- DropForeignKey
ALTER TABLE "UnlicensedSuggestedMatches" DROP CONSTRAINT "UnlicensedSuggestedMatches_musicId_fkey";

-- DropForeignKey
ALTER TABLE "UnlicensedSuggestedMatches" DROP CONSTRAINT "UnlicensedSuggestedMatches_projectId_fkey";

-- DropForeignKey
ALTER TABLE "UnlicensedSuggestedMatches" DROP CONSTRAINT "UnlicensedSuggestedMatches_sceneId_fkey";

-- AlterTable
ALTER TABLE "MatchComments" DROP COLUMN "unlicensedSuggestedMatchId";

-- AlterTable
ALTER TABLE "MatchRatings" DROP COLUMN "unlicensedSuggestedMatchId";

-- DropTable
DROP TABLE "UnlicensedMusicSubmission";

-- DropTable
DROP TABLE "UnlicensedSuggestedMatches";
