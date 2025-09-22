/*
  Warnings:

  - You are about to drop the column `affliation` on the `MusicContributor` table. All the data in the column will be lost.
  - You are about to drop the column `artistId` on the `MusicSubmission` table. All the data in the column will be lost.
  - You are about to drop the column `isAscapAffiliated` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `isBmiAffiliated` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `isSongWriter` on the `User` table. All the data in the column will be lost.
  - Added the required column `affiliation` to the `MusicContributor` table without a default value. This is not possible if the table is not empty.
  - Added the required column `performerName` to the `MusicSubmission` table without a default value. This is not possible if the table is not empty.
  - Added the required column `submitterId` to the `MusicSubmission` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "MusicSubmission" DROP CONSTRAINT "MusicSubmission_artistId_fkey";

-- AlterTable
ALTER TABLE "MusicContributor" DROP COLUMN "affliation",
ADD COLUMN     "affiliation" "MusicAffiliation" NOT NULL;

-- AlterTable
ALTER TABLE "MusicSubmission" DROP COLUMN "artistId",
ADD COLUMN     "performerName" TEXT NOT NULL,
ADD COLUMN     "submitterId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "isAscapAffiliated",
DROP COLUMN "isBmiAffiliated",
DROP COLUMN "isSongWriter",
ADD COLUMN     "affiliation" "MusicAffiliation",
ADD COLUMN     "ipi" TEXT;

-- AddForeignKey
ALTER TABLE "MusicSubmission" ADD CONSTRAINT "MusicSubmission_submitterId_fkey" FOREIGN KEY ("submitterId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
