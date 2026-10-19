-- Normalize stored email addresses to trimmed lowercase, matching how the
-- API now normalizes every email it receives. Data-only: no schema changes.

-- Users and moderator invites have unique emails. Only normalize a row when
-- no other row normalizes to the same address, so this can never violate the
-- unique constraint. Any such conflicts are left untouched for manual review.
UPDATE "User" AS u
SET "email" = LOWER(TRIM(u."email"))
WHERE u."email" <> LOWER(TRIM(u."email"))
  AND (
    SELECT COUNT(*) FROM "User" AS o
    WHERE LOWER(TRIM(o."email")) = LOWER(TRIM(u."email"))
  ) = 1;

UPDATE "ModeratorInvite" AS m
SET "email" = LOWER(TRIM(m."email"))
WHERE m."email" <> LOWER(TRIM(m."email"))
  AND (
    SELECT COUNT(*) FROM "ModeratorInvite" AS o
    WHERE LOWER(TRIM(o."email")) = LOWER(TRIM(m."email"))
  ) = 1;

-- Verification codes expire after 15 minutes, so drop any stored under a
-- non-normalized email instead of migrating them; users can request a new code.
DELETE FROM "EmailVerificationCode"
WHERE "email" <> LOWER(TRIM("email"));

-- Contributor emails are contact details only (not unique).
UPDATE "MusicContributor"
SET "email" = LOWER(TRIM("email"))
WHERE "email" IS NOT NULL
  AND "email" <> LOWER(TRIM("email"));
