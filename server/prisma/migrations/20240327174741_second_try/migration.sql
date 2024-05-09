/*
  Warnings:

  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the column `calories` on the `Ingridient` table. All the data in the column will be lost.
  - You are about to drop the column `authorId` on the `Recipe` table. All the data in the column will be lost.
  - Added the required column `icon` to the `Recipe` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "User_name_key";

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "User";
PRAGMA foreign_keys=on;

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Ingridient" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "price" REAL NOT NULL,
    "icon" TEXT NOT NULL
);
INSERT INTO "new_Ingridient" ("icon", "id", "name", "price") SELECT "icon", "id", "name", "price" FROM "Ingridient";
DROP TABLE "Ingridient";
ALTER TABLE "new_Ingridient" RENAME TO "Ingridient";
CREATE UNIQUE INDEX "Ingridient_name_key" ON "Ingridient"("name");
CREATE TABLE "new_Recipe" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "icon" TEXT NOT NULL,
    "createdAd" DATETIME NOT NULL,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Recipe" ("createdAd", "id", "name", "updatedAt") SELECT "createdAd", "id", "name", "updatedAt" FROM "Recipe";
DROP TABLE "Recipe";
ALTER TABLE "new_Recipe" RENAME TO "Recipe";
CREATE UNIQUE INDEX "Recipe_name_key" ON "Recipe"("name");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
