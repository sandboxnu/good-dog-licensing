-- CreateEnum
CREATE TYPE "MatchState" AS ENUM ('APPROVED', 'REJECTED', 'PENDING');

-- AlterTable
ALTER TABLE "SceneSubmission" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "SceneSubmission" ALTER COLUMN "updatedAt" DROP DEFAULT;

-- CreateTable
CREATE TABLE "SuggestedMatches" (
    "matchId" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "sceneId" TEXT NOT NULL,
    "musicId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "description" TEXT NOT NULL,
    "matcherUserId" TEXT NOT NULL,
    "matchState" "MatchState" NOT NULL,
    "reviewerId" TEXT,

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

-- CreateIndex
CREATE UNIQUE INDEX "SuggestedMatches_sceneId_musicId_key" ON "SuggestedMatches"("sceneId", "musicId");

-- AddForeignKey
ALTER TABLE "SuggestedMatches" ADD CONSTRAINT "SuggestedMatches_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "ProjectSubmission"("projectId") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SuggestedMatches" ADD CONSTRAINT "SuggestedMatches_sceneId_fkey" FOREIGN KEY ("sceneId") REFERENCES "SceneSubmission"("sceneId") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SuggestedMatches" ADD CONSTRAINT "SuggestedMatches_musicId_fkey" FOREIGN KEY ("musicId") REFERENCES "MusicSubmission"("musicId") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SuggestedMatches" ADD CONSTRAINT "SuggestedMatches_matcherUserId_fkey" FOREIGN KEY ("matcherUserId") REFERENCES "User"("id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SuggestedMatches" ADD CONSTRAINT "SuggestedMatches_reviewerId_fkey" FOREIGN KEY ("reviewerId") REFERENCES "User"("id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MatchComments" ADD CONSTRAINT "MatchComments_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MatchComments" ADD CONSTRAINT "MatchComments_matchId_fkey" FOREIGN KEY ("matchId") REFERENCES "SuggestedMatches"("matchId") ON DELETE NO ACTION ON UPDATE CASCADE;
