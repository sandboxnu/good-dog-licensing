/*
  Warnings:

  - The required column `id` was added to the `MusicianGroupMember` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- AlterTable
ALTER TABLE "MusicianGroupMember" ADD COLUMN     "id" TEXT NOT NULL,
ADD CONSTRAINT "MusicianGroupMember_pkey" PRIMARY KEY ("id");

-- CreateTable
CREATE TABLE "ProjectSubmission" (
    "projectId" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deadline" TIMESTAMP(3) NOT NULL,
    "videoLink" TEXT NOT NULL DEFAULT '',
    "additionalInfo" TEXT NOT NULL DEFAULT '',

    CONSTRAINT "ProjectSubmission_pkey" PRIMARY KEY ("projectId")
);

-- CreateTable
CREATE TABLE "SceneSubmission" (
    "sceneId" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "musicType" TEXT NOT NULL,
    "similarSongs" TEXT NOT NULL DEFAULT '',
    "additionalInfo" TEXT NOT NULL DEFAULT '',
    "projectId" TEXT NOT NULL,

    CONSTRAINT "SceneSubmission_pkey" PRIMARY KEY ("sceneId")
);

-- CreateTable
CREATE TABLE "MusicSubmission" (
    "musicId" TEXT NOT NULL,
    "songName" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "artistId" TEXT NOT NULL,
    "songLink" TEXT NOT NULL,
    "genre" TEXT NOT NULL,
    "groupId" TEXT NOT NULL,
    "additionalInfo" TEXT NOT NULL DEFAULT '',

    CONSTRAINT "MusicSubmission_pkey" PRIMARY KEY ("musicId")
);

-- CreateTable
CREATE TABLE "_songWriters" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_songWriters_AB_unique" ON "_songWriters"("A", "B");

-- CreateIndex
CREATE INDEX "_songWriters_B_index" ON "_songWriters"("B");

-- AddForeignKey
ALTER TABLE "ProjectSubmission" ADD CONSTRAINT "ProjectSubmission_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SceneSubmission" ADD CONSTRAINT "SceneSubmission_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "ProjectSubmission"("projectId") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MusicSubmission" ADD CONSTRAINT "MusicSubmission_artistId_fkey" FOREIGN KEY ("artistId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MusicSubmission" ADD CONSTRAINT "MusicSubmission_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "MusicianGroup"("groupId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_songWriters" ADD CONSTRAINT "_songWriters_A_fkey" FOREIGN KEY ("A") REFERENCES "MusicSubmission"("musicId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_songWriters" ADD CONSTRAINT "_songWriters_B_fkey" FOREIGN KEY ("B") REFERENCES "MusicianGroupMember"("id") ON DELETE CASCADE ON UPDATE CASCADE;
