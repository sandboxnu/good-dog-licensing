/*
  Warnings:

  - You are about to drop the `MatchComments` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "MatchComments" DROP CONSTRAINT "MatchComments_suggestedMatchId_fkey";

-- DropForeignKey
ALTER TABLE "MatchComments" DROP CONSTRAINT "MatchComments_userId_fkey";

-- DropTable
DROP TABLE "MatchComments";

-- CreateTable
CREATE TABLE "Comments" (
    "commentId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "commentText" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "songRequestId" TEXT,

    CONSTRAINT "Comments_pkey" PRIMARY KEY ("commentId")
);

-- AddForeignKey
ALTER TABLE "Comments" ADD CONSTRAINT "Comments_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comments" ADD CONSTRAINT "Comments_songRequestId_fkey" FOREIGN KEY ("songRequestId") REFERENCES "SongRequest"("songRequestId") ON DELETE CASCADE ON UPDATE CASCADE;
