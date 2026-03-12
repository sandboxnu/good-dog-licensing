/*
  Warnings:

  - Added the required column `adminStatus` to the `Matches` table without a default value. This is not possible if the table is not empty.
  - Added the required column `mediaMakerStatus` to the `Matches` table without a default value. This is not possible if the table is not empty.
  - Added the required column `musicianStatus` to the `Matches` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Status" AS ENUM ('ACTION_NEEDED', 'APPROVAL_NEEDED', 'SUGGESTIONS_NEEDED', 'IN_PROGRESS', 'REJECTED', 'COMPLETED', 'HIDDEN');

-- AlterTable
ALTER TABLE "Matches" ADD COLUMN     "adminStatus" "Status" NOT NULL,
ADD COLUMN     "mediaMakerStatus" "Status" NOT NULL,
ADD COLUMN     "musicianStatus" "Status" NOT NULL;

-- AlterTable
ALTER TABLE "ProjectSubmission" ADD COLUMN     "adminStatus" "Status" NOT NULL DEFAULT 'ACTION_NEEDED',
ADD COLUMN     "mediaMakerStatus" "Status" NOT NULL DEFAULT 'IN_PROGRESS';

-- AlterTable
ALTER TABLE "SongRequest" ADD COLUMN     "adminStatus" "Status" NOT NULL DEFAULT 'SUGGESTIONS_NEEDED',
ADD COLUMN     "mediaMakerStatus" "Status" NOT NULL DEFAULT 'IN_PROGRESS';
