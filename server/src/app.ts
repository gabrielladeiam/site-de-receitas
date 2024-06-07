import * as express from "express";
import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { getPagination } from "./utils/pagination";
import { createIngredient } from "./services";

// import { createIngredient } from "./services";
// import { create } from "domain";

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
// 1st refactor: do not filter queries directly with the language, use the database instead
// 2nd refactor: use pagination, avoid breaking memory
// 3rd refactor: Encapsulation
// app.get("/recipes/query", async function (req: Request, res: Response) {
//   const searchQuery = String(req.query.search);

//   const page = Number(req.query.page);
//   const takeQuery = Number(req.query.take) || 10;
//   const { skip, take } = getPagination(page, takeQuery);

//   const whereCondition = searchQuery
//     ? {
//         name: {
//           contains: searchQuery,
//         },
//         ingredients: {
//           some: {
//             ingredient: {
//               name: {
//                 contains: searchQuery,
//               },
//             },
//           },
//         },
//       }
//     : undefined;

//   const foundRecipes = await prisma.recipe.findMany({
//     include: {
//       ingredients: {
//         include: {
//           ingredient: true,
//         },
//       },
//     },
//     where: whereCondition,
//     skip,
//     take,
//   });

//   res.json(foundRecipes);
// });

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
    if (error.code === "P2025") {
      return res.status(400).json({ error: "Ingrediente não encontrado" });
    }

    console.error("Erro ao criar nova receita: ", error);
    throw error;
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
    res.json({ id });
  } catch (error) {
    console.error("Falha ao excluir a receita: ", error.message);
    res.json({ error: "Falha ao excluir a receita" }).status(500);
  }
});

app.get("/ingredients/create", async function (req: Request, res: Response) {
  res.json(createIngredient("uva", 6.83));
});

app.listen(3001);
