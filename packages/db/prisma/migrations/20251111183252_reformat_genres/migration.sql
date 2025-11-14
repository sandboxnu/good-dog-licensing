/*
  Warnings:

  - The `genres` column on the `MusicSubmission` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "MusicSubmission" DROP COLUMN "genres",
ADD COLUMN     "genres" "Genre"[];
