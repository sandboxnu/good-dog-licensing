/*
  Warnings:

  - You are about to drop the column `musicType` on the `SongRequest` table. All the data in the column will be lost.
  - You are about to drop the column `oneLineSummary` on the `SongRequest` table. All the data in the column will be lost.
  - Added the required column `projectType` to the `ProjectSubmission` table without a default value. This is not possible if the table is not empty.
  - Added the required column `feelingsConveyed` to the `SongRequest` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ProjectType" AS ENUM ('MOTION_PICTURE', 'SOCIAL_MEDIA_REEL', 'VIDEO_GAME');

-- AlterTable
ALTER TABLE "ProjectSubmission" ADD COLUMN     "projectType" "ProjectType" NOT NULL;

-- AlterTable
ALTER TABLE "SongRequest" DROP COLUMN "musicType",
DROP COLUMN "oneLineSummary",
ADD COLUMN     "feelingsConveyed" TEXT NOT NULL,
ALTER COLUMN "similarSongs" DROP DEFAULT;
