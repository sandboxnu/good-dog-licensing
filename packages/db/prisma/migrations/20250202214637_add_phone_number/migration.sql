/*
  Warnings:

  - Added the required column `phoneNumber` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "phoneNumber" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "_songWriters" ADD CONSTRAINT "_songWriters_AB_pkey" PRIMARY KEY ("A", "B");

-- DropIndex
DROP INDEX "_songWriters_AB_unique";
