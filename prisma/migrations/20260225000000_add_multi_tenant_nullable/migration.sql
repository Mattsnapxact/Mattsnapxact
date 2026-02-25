-- CreateTable: Organization
CREATE TABLE "Organization" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Organization_pkey" PRIMARY KEY ("id")
);

-- Add nullable columns to User
ALTER TABLE "User" ADD COLUMN "organizationId" TEXT;
ALTER TABLE "User" ADD COLUMN "isAdmin" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "User" ADD COLUMN "isActive" BOOLEAN NOT NULL DEFAULT true;

-- Add nullable organizationId to tenant models
ALTER TABLE "Building" ADD COLUMN "organizationId" TEXT;
ALTER TABLE "Room" ADD COLUMN "organizationId" TEXT;
ALTER TABLE "Scan" ADD COLUMN "organizationId" TEXT;

-- Backfill: create an Organization per existing User and assign all their data
DO $$
DECLARE
  user_record RECORD;
  org_id TEXT;
BEGIN
  FOR user_record IN SELECT "id", "email", "name" FROM "User" LOOP
    org_id := gen_random_uuid()::text;

    INSERT INTO "Organization" ("id", "name", "createdAt")
    VALUES (org_id, COALESCE(user_record."name", split_part(user_record."email", '@', 1)) || '''s Organisation', NOW());

    UPDATE "User" SET "organizationId" = org_id WHERE "id" = user_record."id";
    UPDATE "Building" SET "organizationId" = org_id WHERE "userId" = user_record."id";
    UPDATE "Room" SET "organizationId" = org_id WHERE "userId" = user_record."id";
    UPDATE "Scan" SET "organizationId" = org_id WHERE "userId" = user_record."id";
  END LOOP;
END $$;

-- Delete orphan scans that have no user (and thus no org)
DELETE FROM "Scan" WHERE "organizationId" IS NULL AND "userId" IS NULL;

-- Add foreign keys
ALTER TABLE "User" ADD CONSTRAINT "User_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "Building" ADD CONSTRAINT "Building_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "Room" ADD CONSTRAINT "Room_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "Scan" ADD CONSTRAINT "Scan_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- Add indexes
CREATE INDEX "User_organizationId_idx" ON "User"("organizationId");
CREATE INDEX "Building_organizationId_idx" ON "Building"("organizationId");
CREATE INDEX "Room_organizationId_idx" ON "Room"("organizationId");
CREATE INDEX "Scan_organizationId_idx" ON "Scan"("organizationId");
