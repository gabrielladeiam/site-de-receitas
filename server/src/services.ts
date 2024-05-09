import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const createIngredient = async (name, price) => {
  const newIngredient = await prisma.ingredient.create({
    data: {
      name: name,
      icon: name,
      price: price,
    },
  });
  console.log(newIngredient);
  return newIngredient;
};
