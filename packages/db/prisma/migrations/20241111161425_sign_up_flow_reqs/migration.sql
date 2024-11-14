-- AlterEnum
ALTER TYPE "Role" ADD VALUE 'ONBOARDING';

-- AlterTable
ALTER TABLE "User" 
ADD COLUMN     "isAscapAffiliated" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isBmiAffiliated" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isSongWriter" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "stageName" TEXT;

-- AlterTable
ALTER TABLE "GroupInvite" 
ADD COLUMN     "isAscapAffiliated" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isBmiAffiliated" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isSongWriter" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "role" "Role" NOT NULL DEFAULT 'MUSICIAN',
ADD COLUMN     "stageName" TEXT;

-- RemoveDefault
ALTER TABLE "GroupInvite"
ALTER COLUMN "role" DROP DEFAULT;
