/*
  Warnings:

  - You are about to drop the `Group` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `GroupInvite` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_GroupToUser` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "GroupInvite" DROP CONSTRAINT "GroupInvite_groupId_fkey";

-- DropForeignKey
ALTER TABLE "GroupInvite" DROP CONSTRAINT "GroupInvite_initiatorId_fkey";

-- DropForeignKey
ALTER TABLE "_GroupToUser" DROP CONSTRAINT "_GroupToUser_A_fkey";

-- DropForeignKey
ALTER TABLE "_GroupToUser" DROP CONSTRAINT "_GroupToUser_B_fkey";

-- DropTable
DROP TABLE "Group";

-- DropTable
DROP TABLE "GroupInvite";

-- DropTable
DROP TABLE "_GroupToUser";

-- CreateTable
CREATE TABLE "MusicianGroup" (
    "groupId" TEXT NOT NULL,
    "organizerId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MusicianGroup_pkey" PRIMARY KEY ("groupId")
);

-- CreateTable
CREATE TABLE "MusicianGroupMember" (
    "groupId" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "stageName" TEXT,
    "email" TEXT NOT NULL,
    "isSongWriter" BOOLEAN NOT NULL DEFAULT false,
    "isAscapAffiliated" BOOLEAN NOT NULL DEFAULT false,
    "isBmiAffiliated" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "MusicianGroupMember_groupId_email_key" ON "MusicianGroupMember"("groupId", "email");

-- AddForeignKey
ALTER TABLE "MusicianGroup" ADD CONSTRAINT "MusicianGroup_organizerId_fkey" FOREIGN KEY ("organizerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MusicianGroupMember" ADD CONSTRAINT "MusicianGroupMember_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "MusicianGroup"("groupId") ON DELETE CASCADE ON UPDATE CASCADE;
