-- AlterEnum
ALTER TYPE "MatchState" ADD VALUE 'WAITING_FOR_MANAGER_APPROVAL';

-- AlterTable
ALTER TABLE "ProjectSubmission" ADD COLUMN     "projectManagerId" TEXT;

-- AddForeignKey
ALTER TABLE "ProjectSubmission" ADD CONSTRAINT "ProjectSubmission_projectManagerId_fkey" FOREIGN KEY ("projectManagerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
