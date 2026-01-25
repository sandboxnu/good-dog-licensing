/*
  Warnings:

  - The values [NEW,SONG_REQUESTED] on the enum `MatchState` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "MatchState_new" AS ENUM ('WAITING_FOR_MANAGER_APPROVAL', 'SENT_TO_MEDIA_MAKER', 'SENT_TO_MUSICIAN', 'REJECTED_BY_MEDIA_MAKER', 'REJECTED_BY_MUSICIAN', 'APPROVED_BY_MUSICIAN');
ALTER TABLE "Matches" ALTER COLUMN "matchState" TYPE "MatchState_new" USING ("matchState"::text::"MatchState_new");
ALTER TYPE "MatchState" RENAME TO "MatchState_old";
ALTER TYPE "MatchState_new" RENAME TO "MatchState";
DROP TYPE "MatchState_old";
COMMIT;
