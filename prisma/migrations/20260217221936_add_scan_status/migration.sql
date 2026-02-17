-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Scan" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT,
    "buildingId" TEXT,
    "roomId" TEXT,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "imageUrl" TEXT,
    "rawText" TEXT,
    "manufacturer" TEXT,
    "model" TEXT,
    "serialNumber" TEXT,
    "assetTag" TEXT,
    "extraFields" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "batchId" TEXT,
    CONSTRAINT "Scan_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Scan_buildingId_fkey" FOREIGN KEY ("buildingId") REFERENCES "Building" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Scan_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "Room" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Scan" ("assetTag", "batchId", "buildingId", "createdAt", "extraFields", "id", "imageUrl", "manufacturer", "model", "rawText", "roomId", "serialNumber", "userId") SELECT "assetTag", "batchId", "buildingId", "createdAt", "extraFields", "id", "imageUrl", "manufacturer", "model", "rawText", "roomId", "serialNumber", "userId" FROM "Scan";
DROP TABLE "Scan";
ALTER TABLE "new_Scan" RENAME TO "Scan";
CREATE INDEX "Scan_userId_idx" ON "Scan"("userId");
CREATE INDEX "Scan_batchId_idx" ON "Scan"("batchId");
CREATE INDEX "Scan_buildingId_idx" ON "Scan"("buildingId");
CREATE INDEX "Scan_roomId_idx" ON "Scan"("roomId");
CREATE INDEX "Scan_userId_status_idx" ON "Scan"("userId", "status");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
