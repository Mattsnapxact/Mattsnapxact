-- Make organizationId required on tenant models (safe after backfill)
ALTER TABLE "Building" ALTER COLUMN "organizationId" SET NOT NULL;
ALTER TABLE "Room" ALTER COLUMN "organizationId" SET NOT NULL;
ALTER TABLE "Scan" ALTER COLUMN "organizationId" SET NOT NULL;
