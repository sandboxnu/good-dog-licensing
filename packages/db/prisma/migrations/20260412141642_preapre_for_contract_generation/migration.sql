/*
  Warnings:

  - The values [MOTION_PICTURE,SOCIAL_MEDIA_REEL,VIDEO_GAME] on the enum `ProjectType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "ProjectType_new" AS ENUM ('SOCIAL_MEDIA', 'PERSONAL_WEBSITE', 'FILM_FESTIVAL', 'ACADEMIC_PROJECT', 'OTHER');
ALTER TABLE "ProjectSubmission" ALTER COLUMN "projectType" TYPE "ProjectType_new" USING ("projectType"::text::"ProjectType_new");
ALTER TYPE "ProjectType" RENAME TO "ProjectType_old";
ALTER TYPE "ProjectType_new" RENAME TO "ProjectType";
DROP TYPE "ProjectType_old";
COMMIT;

-- AlterTable
ALTER TABLE "MusicContributor" ADD COLUMN     "publisher" TEXT,
ADD COLUMN     "publisherIpi" TEXT;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "publisher" TEXT,
ADD COLUMN     "publisherIpi" TEXT;

-- CreateTable
CREATE TABLE "Contract" (
    "contractId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "matchId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "licensorFullName" TEXT NOT NULL,
    "licensorPhone" TEXT NOT NULL,
    "licensorEmail" TEXT NOT NULL,
    "licensorEntity" TEXT NOT NULL,
    "licensorSigned" BOOLEAN NOT NULL DEFAULT false,
    "licenseeFullName" TEXT NOT NULL,
    "licenseePhone" TEXT NOT NULL,
    "licenseeEmail" TEXT NOT NULL,
    "licenseeEntity" TEXT NOT NULL,
    "licenseeSigned" BOOLEAN NOT NULL DEFAULT false,
    "productionTitle" TEXT NOT NULL,
    "productionDescription" TEXT NOT NULL,
    "songRequestDescription" TEXT NOT NULL,
    "locationOfUse" TEXT NOT NULL,
    "songTitle" TEXT NOT NULL,

    CONSTRAINT "Contract_pkey" PRIMARY KEY ("contractId")
);

-- CreateTable
CREATE TABLE "ContractMusicContributor" (
    "contractMusicContributorId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "contractId" TEXT NOT NULL,
    "contributorFullName" TEXT NOT NULL,
    "contributorRole" "MusicRole" NOT NULL,
    "contributorAffiliation" "MusicAffiliation",
    "contributorEmail" TEXT NOT NULL,
    "contributorPublisher" TEXT NOT NULL,
    "contributorPublisherIpi" TEXT NOT NULL,

    CONSTRAINT "ContractMusicContributor_pkey" PRIMARY KEY ("contractMusicContributorId")
);

-- CreateIndex
CREATE UNIQUE INDEX "Contract_matchId_key" ON "Contract"("matchId");

-- AddForeignKey
ALTER TABLE "Contract" ADD CONSTRAINT "Contract_matchId_fkey" FOREIGN KEY ("matchId") REFERENCES "Matches"("matchId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContractMusicContributor" ADD CONSTRAINT "ContractMusicContributor_contractId_fkey" FOREIGN KEY ("contractId") REFERENCES "Contract"("contractId") ON DELETE CASCADE ON UPDATE CASCADE;
