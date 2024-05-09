/*
  Warnings:

  - The primary key for the `Recipe` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `recipe_id` on the `Recipe` table. All the data in the column will be lost.
  - The primary key for the `Ingridient` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `ingridient_id` on the `Ingridient` table. All the data in the column will be lost.
  - The primary key for the `User` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `user_id` on the `User` table. All the data in the column will be lost.
  - Added the required column `authorId` to the `Recipe` table without a default value. This is not possible if the table is not empty.
  - Added the required column `createdAd` to the `Recipe` table without a default value. This is not possible if the table is not empty.
  - The required column `id` was added to the `Recipe` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Added the required column `updatedAt` to the `Recipe` table without a default value. This is not possible if the table is not empty.
  - Added the required column `calories` to the `Ingridient` table without a default value. This is not possible if the table is not empty.
  - Added the required column `icon` to the `Ingridient` table without a default value. This is not possible if the table is not empty.
  - The required column `id` was added to the `Ingridient` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Added the required column `price` to the `Ingridient` table without a default value. This is not possible if the table is not empty.
  - The required column `id` was added to the `User` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Added the required column `password` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- CreateTable
CREATE TABLE "_IngridientToRecipe" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,
    CONSTRAINT "_IngridientToRecipe_A_fkey" FOREIGN KEY ("A") REFERENCES "Ingridient" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_IngridientToRecipe_B_fkey" FOREIGN KEY ("B") REFERENCES "Recipe" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Recipe" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,
    "createdAd" DATETIME NOT NULL,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Recipe_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Recipe" ("name") SELECT "name" FROM "Recipe";
DROP TABLE "Recipe";
ALTER TABLE "new_Recipe" RENAME TO "Recipe";
CREATE UNIQUE INDEX "Recipe_name_key" ON "Recipe"("name");
CREATE TABLE "new_Ingridient" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "price" REAL NOT NULL,
    "calories" INTEGER NOT NULL,
    "icon" BLOB NOT NULL
);
INSERT INTO "new_Ingridient" ("name") SELECT "name" FROM "Ingridient";
DROP TABLE "Ingridient";
ALTER TABLE "new_Ingridient" RENAME TO "Ingridient";
CREATE UNIQUE INDEX "Ingridient_name_key" ON "Ingridient"("name");
CREATE TABLE "new_User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "password" TEXT NOT NULL
);
INSERT INTO "new_User" ("name") SELECT "name" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_name_key" ON "User"("name");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;

-- CreateIndex
CREATE UNIQUE INDEX "_IngridientToRecipe_AB_unique" ON "_IngridientToRecipe"("A", "B");

-- CreateIndex
CREATE INDEX "_IngridientToRecipe_B_index" ON "_IngridientToRecipe"("B");
