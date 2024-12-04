/*
  Warnings:

  - You are about to drop the column `intitiatorId` on the `GroupInvite` table. All the data in the column will be lost.
  - Added the required column `initiatorId` to the `GroupInvite` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "GroupInvite" DROP CONSTRAINT "GroupInvite_intitiatorId_fkey";

-- AlterTable
ALTER TABLE "GroupInvite" DROP COLUMN "intitiatorId",
ADD COLUMN     "initiatorId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "GroupInvite" ADD CONSTRAINT "GroupInvite_initiatorId_fkey" FOREIGN KEY ("initiatorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
