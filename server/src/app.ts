import * as express from "express";
import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { createIngredient } from "./services";
import { create } from "domain";

const prisma = new PrismaClient();

// create and setup express app
const app = express();
app.use(express.json());

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:3000");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

// REGISTER ROUTES
//get all recipes and ingredients by query
app.get("/recipes/query", async function (req: Request, res: Response) {
  const allRecipes = await prisma.recipe.findMany({
    include: {
      ingredients: {
        include: {
          ingredient: true,
        },
      },
    },
  });
  const searchQuery = req.query.search as string;
  if (!searchQuery) {
    return res.json(allRecipes);
  }
  const filteredRecipes = allRecipes.filter((recipe) => {
    if (recipe.name.toLowerCase().includes(searchQuery.toLowerCase())) {
      return true;
    }
    return recipe.ingredients.some(({ ingredient }) =>
      ingredient.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });
  res.json(filteredRecipes);
});

//get all ingredients
app.get("/ingredients", async function (req: Request, res: Response) {
  const allIngredients = await prisma.ingredient.findMany();
  res.json(allIngredients);
});

//create a new recipe
app.post("/recipes", async function (req: Request, res: Response) {
  try {
    const { name, icon, ingredients } = req.body.data;
    const createPayload = ingredients.map((ingredient) => ({
      ingredient: {
        connect: { id: ingredient.id },
      },
      quantity: Number(ingredient.quantity),
    }));

    const newRecipe = await prisma.recipe.create({
      data: {
        name: name,
        icon: icon,
        ingredients: {
          create: createPayload,
        },
      },
      include: { ingredients: true },
    });
    res.json(newRecipe);
  } catch (error) {
    console.error("Erro ao criar nova receita: ", error);
    res.status(500).send("Erro ao criar nova receita");
  }
});

//update a recipe

app.put("/recipes/:id", async function (req: Request, res: Response) {
  const id = req.params.id;
  const { name, icon, ingredients } = req.body;
  const createPayload = ingredients.map((ingredient) => ({
    ingredient: {
      connect: { id: ingredient.id },
    },
    quantity: Number(ingredient.quantity),
  }));
  await prisma.recipe.update({
    where: {
      id: id,
    },
    data: {
      ingredients: {
        deleteMany: {},
      },
    },
  });
  const updatedRecipe = await prisma.recipe.update({
    where: { id: id },
    data: {
      name: name,
      icon: icon,
      ingredients: {
        create: createPayload,
      },
    },
    include: { ingredients: true },
  });
  res.json(updatedRecipe);
});

//delete a recipe by id
app.delete("/recipes/:id", async function (req: Request, res: Response) {
  const id = req.params.id;
  try {
    await prisma.recipe.update({
      where: {
        id: id,
      },
      data: {
        ingredients: {
          deleteMany: {},
        },
      },
    });

    await prisma.recipe.delete({
      where: { id: id },
    });
    res.status(204).send();
  } catch (error) {
    console.error("Falha ao excluir a receita: ", error.message);
    res.status(500).json({ error: "Falha ao excluir a receita" });
  }
});

/*create new ingredient
app.get("/ingredients/create", async function (req: Request, res: Response) {
  res.json(createIngredient("uva", 6.83));
});*/

app.listen(3001);
