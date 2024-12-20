-- CreateEnum
CREATE TYPE "Role" AS ENUM ('MUSICIAN', 'MEDIA_MAKER', 'ADMIN');

-- AlterTable
ALTER TABLE "User"
RENAME COLUMN "name" TO "firstName";

-- AlterTable
ALTER TABLE "User"
ADD COLUMN "lastName" TEXT NOT NULL DEFAULT '',
ADD COLUMN "role" "Role" NOT NULL DEFAULT 'MEDIA_MAKER';

-- RemoveDefault
ALTER TABLE "User"
ALTER COLUMN "lastName" DROP DEFAULT,
ALTER COLUMN "role" DROP DEFAULT;