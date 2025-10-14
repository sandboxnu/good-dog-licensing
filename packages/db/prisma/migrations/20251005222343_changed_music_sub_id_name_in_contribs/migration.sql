/*
  Warnings:

  - You are about to drop the column `musicSubmissionMusicId` on the `MusicContributor` table. All the data in the column will be lost.
  - Added the required column `musicSubmissionId` to the `MusicContributor` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "MusicContributor" DROP CONSTRAINT "MusicContributor_musicSubmissionMusicId_fkey";

-- AlterTable
ALTER TABLE "MusicContributor" DROP COLUMN "musicSubmissionMusicId",
ADD COLUMN     "musicSubmissionId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "MusicContributor" ADD CONSTRAINT "MusicContributor_musicSubmissionId_fkey" FOREIGN KEY ("musicSubmissionId") REFERENCES "MusicSubmission"("musicId") ON DELETE CASCADE ON UPDATE CASCADE;
