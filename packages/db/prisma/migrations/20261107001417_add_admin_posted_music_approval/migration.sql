-- CreateEnum
CREATE TYPE "MusicApprovalStatus" AS ENUM ('WAITING_FOR_MUSICIAN_REVIEW', 'APPROVED');

-- AlterTable
ALTER TABLE "MusicSubmission" ADD COLUMN     "approvalStatus" "MusicApprovalStatus" NOT NULL DEFAULT 'APPROVED',
ADD COLUMN     "postedByAdminId" TEXT;

-- AddForeignKey
ALTER TABLE "MusicSubmission" ADD CONSTRAINT "MusicSubmission_postedByAdminId_fkey" FOREIGN KEY ("postedByAdminId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
