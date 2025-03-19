-- CreateTable
CREATE TABLE "UnlicensedMusic" (
    "musicId" TEXT NOT NULL,
    "songName" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "artist" TEXT NOT NULL,
    "songLink" TEXT NOT NULL,
    "genre" TEXT NOT NULL,
    "additionalInfo" TEXT NOT NULL DEFAULT '',

    CONSTRAINT "UnlicensedMusic_pkey" PRIMARY KEY ("musicId")
);
