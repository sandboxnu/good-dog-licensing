-- AlterTable
ALTER TABLE "User" ADD COLUMN     "phoneNumber" TEXT NOT NULL DEFAULT '';
-- AlterTable remove default value
ALTER TABLE "User" ALTER COLUMN "phoneNumber" DROP DEFAULT;

-- AlterTable
ALTER TABLE "_songWriters" ADD CONSTRAINT "_songWriters_AB_pkey" PRIMARY KEY ("A", "B");

-- DropIndex
DROP INDEX "_songWriters_AB_unique";
