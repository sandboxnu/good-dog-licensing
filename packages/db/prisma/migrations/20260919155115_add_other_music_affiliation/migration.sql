-- AlterEnum
ALTER TYPE "MusicAffiliation" ADD VALUE 'OTHER';

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "otherAffiliationName" TEXT;

-- AlterTable
ALTER TABLE "MusicContributor" ADD COLUMN     "otherAffiliationName" TEXT;
