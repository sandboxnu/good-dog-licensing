/*
  Warnings:

  - Added the required column `updatedAt` to the `SceneSubmission` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
ALTER TYPE "Role" ADD VALUE 'MODERATOR';

-- AlterTable
ALTER TABLE "SceneSubmission" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- CreateTable
CREATE TABLE "SuggestedMatches" (
    "matchId" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "sceneId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "SuggestedMatches_pkey" PRIMARY KEY ("matchId")
);

-- CreateTable
CREATE TABLE "MatchComments" (
    "commentId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "commentText" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "matchId" TEXT NOT NULL,

    CONSTRAINT "MatchComments_pkey" PRIMARY KEY ("commentId")
);

-- AddForeignKey
ALTER TABLE "SuggestedMatches" ADD CONSTRAINT "SuggestedMatches_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "ProjectSubmission"("projectId") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SuggestedMatches" ADD CONSTRAINT "SuggestedMatches_sceneId_fkey" FOREIGN KEY ("sceneId") REFERENCES "SceneSubmission"("sceneId") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SuggestedMatches" ADD CONSTRAINT "SuggestedMatches_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MatchComments" ADD CONSTRAINT "MatchComments_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MatchComments" ADD CONSTRAINT "MatchComments_matchId_fkey" FOREIGN KEY ("matchId") REFERENCES "SuggestedMatches"("matchId") ON DELETE NO ACTION ON UPDATE CASCADE;
