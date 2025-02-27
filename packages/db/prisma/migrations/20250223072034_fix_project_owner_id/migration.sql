/*
  Warnings:

  - Added the required column `projectOwnerId` to the `ProjectSubmission` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "ProjectSubmission" DROP CONSTRAINT "ProjectSubmission_projectId_fkey";

-- AlterTable
ALTER TABLE "ProjectSubmission" ADD COLUMN     "projectOwnerId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "ProjectSubmission" ADD CONSTRAINT "ProjectSubmission_projectOwnerId_fkey" FOREIGN KEY ("projectOwnerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
