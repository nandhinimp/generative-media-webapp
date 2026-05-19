ALTER TABLE "Generation"
ADD COLUMN IF NOT EXISTS "userId" TEXT,
ADD COLUMN IF NOT EXISTS "userName" TEXT,
ADD COLUMN IF NOT EXISTS "userImage" TEXT;

UPDATE "Generation"
SET "userId" = COALESCE("userId", 'legacy-user')
WHERE "userId" IS NULL;

ALTER TABLE "Generation"
ALTER COLUMN "userId" SET NOT NULL;

CREATE INDEX IF NOT EXISTS "Generation_userId_createdAt_idx"
  ON "Generation" ("userId", "createdAt");

ALTER TABLE "SavedEdit"
ADD COLUMN IF NOT EXISTS "userId" TEXT,
ADD COLUMN IF NOT EXISTS "userName" TEXT,
ADD COLUMN IF NOT EXISTS "userImage" TEXT;

UPDATE "SavedEdit"
SET "userId" = COALESCE("userId", 'legacy-user')
WHERE "userId" IS NULL;

ALTER TABLE "SavedEdit"
ALTER COLUMN "userId" SET NOT NULL;

CREATE INDEX IF NOT EXISTS "SavedEdit_userId_createdAt_idx"
  ON "SavedEdit" ("userId", "createdAt");