-- CreateEnum
CREATE TYPE "MusicRole" AS ENUM ('VOCALIST', 'INSTRUMENTALIST', 'PRODUCER', 'SONGWRITER', 'LYRICIST');

-- CreateEnum
CREATE TYPE "MusicAffiliation" AS ENUM ('ASCAP', 'BMI', 'NONE');

-- CreateTable
CREATE TABLE "MusicContributor" (
    "contributorId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "roles" "MusicRole"[],
    "affliation" "MusicAffiliation" NOT NULL,
    "ipi" TEXT,
    "musicSubmissionMusicId" TEXT NOT NULL,

    CONSTRAINT "MusicContributor_pkey" PRIMARY KEY ("contributorId")
);

-- AddForeignKey
ALTER TABLE "MusicContributor" ADD CONSTRAINT "MusicContributor_musicSubmissionMusicId_fkey" FOREIGN KEY ("musicSubmissionMusicId") REFERENCES "MusicSubmission"("musicId") ON DELETE CASCADE ON UPDATE CASCADE;
