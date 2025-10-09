-- AlterTable
ALTER TABLE "MusicContributor" ADD COLUMN     "isSubmitter" BOOLEAN NOT NULL DEFAULT false,
ALTER COLUMN "affiliation" DROP NOT NULL;
