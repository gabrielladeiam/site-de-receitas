/*
  Warnings:

  - A unique constraint covering the columns `[ingredientId]` on the table `IngredientInRecipe` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "IngredientInRecipe_ingredientId_key" ON "IngredientInRecipe"("ingredientId");
