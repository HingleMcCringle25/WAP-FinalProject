/*
  Warnings:

  - Added the required column `condition` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `edition` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `rarity` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `serialNumber` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `stockQuantity` to the `Product` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Product" (
    "product_id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "cost" DECIMAL NOT NULL,
    "image_filename" TEXT NOT NULL,
    "rarity" TEXT NOT NULL,
    "condition" TEXT NOT NULL,
    "serialNumber" INTEGER NOT NULL,
    "edition" TEXT NOT NULL,
    "stockQuantity" INTEGER NOT NULL
);
INSERT INTO "new_Product" ("cost", "description", "image_filename", "name", "product_id") SELECT "cost", "description", "image_filename", "name", "product_id" FROM "Product";
DROP TABLE "Product";
ALTER TABLE "new_Product" RENAME TO "Product";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
