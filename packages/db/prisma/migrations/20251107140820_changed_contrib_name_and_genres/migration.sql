/*
  Warnings:

  - You are about to drop the column `name` on the `MusicContributor` table. All the data in the column will be lost.
  - You are about to drop the column `genre` on the `MusicSubmission` table. All the data in the column will be lost.
  - Added the required column `firstName` to the `MusicContributor` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lastName` to the `MusicContributor` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "MusicContributor" DROP COLUMN "name",
ADD COLUMN     "firstName" TEXT NOT NULL,
ADD COLUMN     "lastName" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "MusicSubmission" DROP COLUMN "genre",
ADD COLUMN     "genres" TEXT[];
