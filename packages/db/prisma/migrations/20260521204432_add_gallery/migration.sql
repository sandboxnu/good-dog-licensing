-- CreateTable
CREATE TABLE "GalleryProject" (
    "galleryProjectId" TEXT NOT NULL,
    "projectName" TEXT NOT NULL,
    "mediaMakerName" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GalleryProject_pkey" PRIMARY KEY ("galleryProjectId")
);
