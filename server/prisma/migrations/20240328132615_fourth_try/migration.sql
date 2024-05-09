/*
  Warnings:

  - You are about to drop the `_IngredientToRecipe` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the column `createdAd` on the `Recipe` table. All the data in the column will be lost.
  - Added the required column `createdAt` to the `Recipe` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "_IngredientToRecipe_B_index";

-- DropIndex
DROP INDEX "_IngredientToRecipe_AB_unique";

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "_IngredientToRecipe";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "IngredientInRecipe" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "quantity" REAL NOT NULL,
    "recipeId" TEXT NOT NULL,
    "ingredientId" TEXT NOT NULL,
    CONSTRAINT "IngredientInRecipe_recipeId_fkey" FOREIGN KEY ("recipeId") REFERENCES "Recipe" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "IngredientInRecipe_ingredientId_fkey" FOREIGN KEY ("ingredientId") REFERENCES "Ingredient" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Recipe" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "icon" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Recipe" ("icon", "id", "name", "updatedAt") SELECT "icon", "id", "name", "updatedAt" FROM "Recipe";
DROP TABLE "Recipe";
ALTER TABLE "new_Recipe" RENAME TO "Recipe";
CREATE UNIQUE INDEX "Recipe_name_key" ON "Recipe"("name");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
