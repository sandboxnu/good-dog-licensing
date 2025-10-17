/*
  Warnings:

  - You are about to drop the `SuggestedMatches` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "SuggestedMatches" DROP CONSTRAINT "SuggestedMatches_matcherUserId_fkey";

-- DropForeignKey
ALTER TABLE "SuggestedMatches" DROP CONSTRAINT "SuggestedMatches_musicId_fkey";

-- DropForeignKey
ALTER TABLE "SuggestedMatches" DROP CONSTRAINT "SuggestedMatches_songRequestId_fkey";

-- DropTable
DROP TABLE "SuggestedMatches";

-- CreateTable
CREATE TABLE "Matches" (
    "matchId" TEXT NOT NULL,
    "songRequestId" TEXT NOT NULL,
    "musicId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "matcherUserId" TEXT NOT NULL,
    "matchState" "MatchState" NOT NULL,

    CONSTRAINT "Matches_pkey" PRIMARY KEY ("matchId")
);

-- CreateIndex
CREATE UNIQUE INDEX "Matches_songRequestId_musicId_key" ON "Matches"("songRequestId", "musicId");

-- AddForeignKey
ALTER TABLE "Matches" ADD CONSTRAINT "Matches_songRequestId_fkey" FOREIGN KEY ("songRequestId") REFERENCES "SongRequest"("songRequestId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Matches" ADD CONSTRAINT "Matches_musicId_fkey" FOREIGN KEY ("musicId") REFERENCES "MusicSubmission"("musicId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Matches" ADD CONSTRAINT "Matches_matcherUserId_fkey" FOREIGN KEY ("matcherUserId") REFERENCES "User"("id") ON DELETE NO ACTION ON UPDATE CASCADE;
