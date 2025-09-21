/*
  Warnings:

  - You are about to drop the `MusicContributors` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "MusicRoles" AS ENUM ('VOCALIST', 'INSTRUMENTALIST', 'PRODUCER', 'SONGWRITER', 'LYRICIST');

-- DropForeignKey
ALTER TABLE "MusicContributors" DROP CONSTRAINT "MusicContributors_musicSubmissionMusicId_fkey";

-- DropTable
DROP TABLE "MusicContributors";

-- CreateTable
CREATE TABLE "MusicContributor" (
    "contributorId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "roles" "MusicRoles"[],
    "isAscapAffiliated" BOOLEAN NOT NULL,
    "isBmiAffiliated" BOOLEAN NOT NULL,
    "ipi" TEXT NOT NULL,
    "musicSubmissionMusicId" TEXT NOT NULL,

    CONSTRAINT "MusicContributor_pkey" PRIMARY KEY ("contributorId")
);

-- AddForeignKey
ALTER TABLE "MusicContributor" ADD CONSTRAINT "MusicContributor_musicSubmissionMusicId_fkey" FOREIGN KEY ("musicSubmissionMusicId") REFERENCES "MusicSubmission"("musicId") ON DELETE CASCADE ON UPDATE CASCADE;
