/*
  Warnings:

  - Added the required column `admModStatus` to the `Matches` table without a default value. This is not possible if the table is not empty.
  - Added the required column `mediaMakerStatus` to the `Matches` table without a default value. This is not possible if the table is not empty.
  - Added the required column `musicianStatus` to the `Matches` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "AdmModProjectStatus" AS ENUM ('COMPLETED', 'ACTION_NEEDED', 'IN_PROGRESS');

-- CreateEnum
CREATE TYPE "AdmModSongRequestStatus" AS ENUM ('COMPLETED', 'APPROVAL_NEEDED', 'IN_PROGRESS', 'SUGGESTIONS_NEEDED');

-- CreateEnum
CREATE TYPE "AdmModMatchStatus" AS ENUM ('APPROVAL_NEEDED', 'IN_PROGRESS', 'REJECTED', 'COMPLETED');

-- CreateEnum
CREATE TYPE "MediaMakerProjectStatus" AS ENUM ('ACTION_NEEDED', 'IN_PROGRESS', 'COMPLETED');

-- CreateEnum
CREATE TYPE "MediaMakerSongRequestStatus" AS ENUM ('COMPLETED', 'APPROVAL_NEEDED', 'IN_PROGRESS');

-- CreateEnum
CREATE TYPE "MediaMakerMatchStatus" AS ENUM ('HIDDEN', 'APPROVAL_NEEDED', 'IN_PROGRESS', 'COMPLETED', 'REJECTED');

-- CreateEnum
CREATE TYPE "MusicianSongStatus" AS ENUM ('ACTION_NEEDED', 'SONG_SUBMITTED');

-- CreateEnum
CREATE TYPE "MusicianMatchStatus" AS ENUM ('HIDDEN', 'APPROVAL_NEEDED', 'REJECTED', 'COMPLETED');

-- AlterTable
ALTER TABLE "Matches" ADD COLUMN     "admModStatus" "AdmModMatchStatus" NOT NULL,
ADD COLUMN     "mediaMakerStatus" "MediaMakerMatchStatus" NOT NULL,
ADD COLUMN     "musicianStatus" "MusicianMatchStatus" NOT NULL;

-- AlterTable
ALTER TABLE "MusicSubmission" ADD COLUMN     "musicianSongStatus" "MusicianSongStatus" NOT NULL DEFAULT 'SONG_SUBMITTED';

-- AlterTable
ALTER TABLE "ProjectSubmission" ADD COLUMN     "admModStatus" "AdmModProjectStatus" NOT NULL DEFAULT 'ACTION_NEEDED',
ADD COLUMN     "mediaMakerStatus" "MediaMakerProjectStatus" NOT NULL DEFAULT 'IN_PROGRESS';

-- AlterTable
ALTER TABLE "SongRequest" ADD COLUMN     "admModStatus" "AdmModSongRequestStatus" NOT NULL DEFAULT 'SUGGESTIONS_NEEDED',
ADD COLUMN     "mediaMakerStatus" "MediaMakerSongRequestStatus" NOT NULL DEFAULT 'IN_PROGRESS';
