/*
  Warnings:

  - Added the required column `projectTitle` to the `ProjectSubmission` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sceneTitle` to the `SceneSubmission` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "SceneSubmission" DROP CONSTRAINT "SceneSubmission_projectId_fkey";

-- AlterTable
ALTER TABLE "ProjectSubmission" ADD COLUMN     "projectTitle" TEXT NOT NULL DEFAULT '';
-- DropDefault
ALTER TABLE "ProjectSubmission" ALTER COLUMN "projectTitle" DROP DEFAULT;

-- AlterTable
ALTER TABLE "SceneSubmission" ADD COLUMN     "sceneTitle" TEXT NOT NULL DEFAULT '';
-- DropDefault
ALTER TABLE "SceneSubmission" ALTER COLUMN "sceneTitle" DROP DEFAULT;

-- AddForeignKey
ALTER TABLE "SceneSubmission" ADD CONSTRAINT "SceneSubmission_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "ProjectSubmission"("projectId") ON DELETE CASCADE ON UPDATE CASCADE;
