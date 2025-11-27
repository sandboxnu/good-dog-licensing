/*
  Warnings:

  - Added the required column `songRequestTitle` to the `SongRequest` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "SongRequest" ADD COLUMN     "songRequestTitle" TEXT NOT NULL;
