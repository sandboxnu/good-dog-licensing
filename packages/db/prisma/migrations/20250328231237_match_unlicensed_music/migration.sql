/*
  Warnings:

  - You are about to drop the column `matchId` on the `MatchComments` table. All the data in the column will be lost.
  - The primary key for the `SuggestedMatches` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `matchId` on the `SuggestedMatches` table. All the data in the column will be lost.
  - The required column `suggestedMatchId` was added to the `SuggestedMatches` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- CreateEnum
CREATE TYPE "Rating" AS ENUM ('LIKE', 'DISLIKE');

-- AlterTable
ALTER TABLE "MatchComments" 
RENAME COLUMN "matchId" TO "suggestedMatchId";

-- AlterTable
ALTER TABLE "MatchComments" ALTER COLUMN "suggestedMatchId" DROP NOT NULL;

-- RenameForeignKey
ALTER TABLE "MatchComments" RENAME CONSTRAINT "MatchComments_matchId_fkey" TO "MatchComments_suggestedMatchId_fkey";

-- AlterTable
ALTER TABLE "MatchComments"
ADD COLUMN     "unlicensedSuggestedMatchId" TEXT;

-- AlterTable
ALTER TABLE "SuggestedMatches" RENAME COLUMN "matchId" TO "suggestedMatchId";

-- CreateTable
CREATE TABLE "MatchRatings" (
    "ratingId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "ratingEnum" "Rating" NOT NULL,
    "suggestedMatchId" TEXT,
    "unlicensedSuggestedMatchId" TEXT,

    CONSTRAINT "MatchRatings_pkey" PRIMARY KEY ("ratingId")
);

-- AlterTable
ALTER TABLE IF EXISTS "UnlicensedMusic" RENAME TO "UnlicensedMusicSubmission";

-- AlterTable
ALTER TABLE "UnlicensedMusicSubmission" RENAME CONSTRAINT "UnlicensedMusic_pkey" TO "UnlicensedMusicSubmission_pkey";

-- CreateTable
CREATE TABLE "UnlicensedSuggestedMatches" (
    "unlicensedSuggestedMatchId" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "sceneId" TEXT NOT NULL,
    "musicId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "description" TEXT NOT NULL,
    "matcherUserId" TEXT NOT NULL,
    "matchState" "MatchState" NOT NULL,

    CONSTRAINT "UnlicensedSuggestedMatches_pkey" PRIMARY KEY ("unlicensedSuggestedMatchId")
);

-- CreateIndex
CREATE UNIQUE INDEX "UnlicensedSuggestedMatches_sceneId_musicId_key" ON "UnlicensedSuggestedMatches"("sceneId", "musicId");

-- DropForeignKey
ALTER TABLE "SceneSubmission" DROP CONSTRAINT "SceneSubmission_projectId_fkey";

-- AddForeignKey
ALTER TABLE "SceneSubmission" ADD CONSTRAINT "SceneSubmission_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "ProjectSubmission"("projectId") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MatchComments" ADD CONSTRAINT "MatchComments_unlicensedSuggestedMatchId_fkey" FOREIGN KEY ("unlicensedSuggestedMatchId") REFERENCES "UnlicensedSuggestedMatches"("unlicensedSuggestedMatchId") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MatchRatings" ADD CONSTRAINT "MatchRatings_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MatchRatings" ADD CONSTRAINT "MatchRatings_suggestedMatchId_fkey" FOREIGN KEY ("suggestedMatchId") REFERENCES "SuggestedMatches"("suggestedMatchId") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MatchRatings" ADD CONSTRAINT "MatchRatings_unlicensedSuggestedMatchId_fkey" FOREIGN KEY ("unlicensedSuggestedMatchId") REFERENCES "UnlicensedSuggestedMatches"("unlicensedSuggestedMatchId") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UnlicensedSuggestedMatches" ADD CONSTRAINT "UnlicensedSuggestedMatches_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "ProjectSubmission"("projectId") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UnlicensedSuggestedMatches" ADD CONSTRAINT "UnlicensedSuggestedMatches_sceneId_fkey" FOREIGN KEY ("sceneId") REFERENCES "SceneSubmission"("sceneId") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UnlicensedSuggestedMatches" ADD CONSTRAINT "UnlicensedSuggestedMatches_musicId_fkey" FOREIGN KEY ("musicId") REFERENCES "UnlicensedMusicSubmission"("musicId") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UnlicensedSuggestedMatches" ADD CONSTRAINT "UnlicensedSuggestedMatches_matcherUserId_fkey" FOREIGN KEY ("matcherUserId") REFERENCES "User"("id") ON DELETE NO ACTION ON UPDATE CASCADE;
