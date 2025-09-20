-- CreateTable
CREATE TABLE "MusicContributors" (
    "contributorId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "email" TEXT,
    "phoneNumber" TEXT,
    "musicSubmissionMusicId" TEXT,

    CONSTRAINT "MusicContributors_pkey" PRIMARY KEY ("contributorId")
);

-- CreateIndex
CREATE UNIQUE INDEX "MusicContributors_email_key" ON "MusicContributors"("email");

-- AddForeignKey
ALTER TABLE "MusicContributors" ADD CONSTRAINT "MusicContributors_musicSubmissionMusicId_fkey" FOREIGN KEY ("musicSubmissionMusicId") REFERENCES "MusicSubmission"("musicId") ON DELETE SET NULL ON UPDATE CASCADE;
