-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Product" (
    "product_id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "cost" REAL NOT NULL,
    "image_filename" TEXT NOT NULL,
    "rarity" TEXT NOT NULL,
    "condition" TEXT NOT NULL,
    "serialNumber" TEXT NOT NULL,
    "edition" TEXT NOT NULL,
    "stockQuantity" INTEGER NOT NULL
);
INSERT INTO "new_Product" ("condition", "cost", "description", "edition", "image_filename", "name", "product_id", "rarity", "serialNumber", "stockQuantity") SELECT "condition", "cost", "description", "edition", "image_filename", "name", "product_id", "rarity", "serialNumber", "stockQuantity" FROM "Product";
DROP TABLE "Product";
ALTER TABLE "new_Product" RENAME TO "Product";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
