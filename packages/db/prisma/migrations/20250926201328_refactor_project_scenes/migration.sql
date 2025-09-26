/*
  Warnings:

  - You are about to drop the column `sceneId` on the `SuggestedMatches` table. All the data in the column will be lost.
  - You are about to drop the `SceneSubmission` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[songRequestId,musicId]` on the table `SuggestedMatches` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `songRequestId` to the `SuggestedMatches` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "SceneSubmission" DROP CONSTRAINT "SceneSubmission_projectId_fkey";

-- DropForeignKey
ALTER TABLE "SuggestedMatches" DROP CONSTRAINT "SuggestedMatches_musicId_fkey";

-- DropForeignKey
ALTER TABLE "SuggestedMatches" DROP CONSTRAINT "SuggestedMatches_sceneId_fkey";

-- DropIndex
DROP INDEX "SuggestedMatches_sceneId_musicId_key";

-- AlterTable
ALTER TABLE "SuggestedMatches" DROP COLUMN "sceneId",
ADD COLUMN     "songRequestId" TEXT NOT NULL;

-- DropTable
DROP TABLE "SceneSubmission";

-- CreateTable
CREATE TABLE "SongRequest" (
    "songRequestId" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "musicType" TEXT NOT NULL,
    "similarSongs" TEXT NOT NULL DEFAULT '',
    "additionalInfo" TEXT NOT NULL DEFAULT '',
    "projectId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SongRequest_pkey" PRIMARY KEY ("songRequestId")
);

-- CreateIndex
CREATE UNIQUE INDEX "SuggestedMatches_songRequestId_musicId_key" ON "SuggestedMatches"("songRequestId", "musicId");

-- AddForeignKey
ALTER TABLE "SongRequest" ADD CONSTRAINT "SongRequest_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "ProjectSubmission"("projectId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SuggestedMatches" ADD CONSTRAINT "SuggestedMatches_songRequestId_fkey" FOREIGN KEY ("songRequestId") REFERENCES "SongRequest"("songRequestId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SuggestedMatches" ADD CONSTRAINT "SuggestedMatches_musicId_fkey" FOREIGN KEY ("musicId") REFERENCES "MusicSubmission"("musicId") ON DELETE CASCADE ON UPDATE CASCADE;
