import "./recipes.styles.css";
import { useEffect, useState,  } from "react";
import { Ingredients } from "../Ingredients/Ingredients";
import { useRecipesQuery } from "../../hooks/recipes"
import { Link } from "react-router-dom";
import * as icons from "../../assets";

export function Recipes({ totalPrice, searchQuery }) {
  
  // TODO - Remove state in favour of useRecipesQuery
  const [recipeList, setRecipeList] = useState();
  const { data , isLoading}  = useRecipesQuery(searchQuery)

  console.log({ data })
  useEffect(() => {
    setRecipeList(data)
  }, [data])

  //remove uma receita
  const removeRecipe = async (recipe) => {
    if (
      window.confirm(`Você realmente quer deletar a receita ${recipe.name}?`)
    ) {
      try {
        const response = await fetch(
          `http://localhost:3001/recipes/${recipe.id}`,
          {
            method: "DELETE",
          }
        );
        if (!response.ok) {
          throw new Error("Falha ao excluir a receita");
        }
        console.log("Receita excluída com sucesso!");
      } catch (error) {
        console.error("Falha ao excluir a receita: ", error.message);
      }
    }
  };

  // TODO - Extract condition
  if (!recipeList || recipeList.length === 0 || isLoading) {
    return null; // Não há receitas, nada será renderizado
  }

  // TODO- Refactor styles, extract internal component
  return (
    <>
      {recipeList.map((recipe, index) => (
        <div key={index} id={recipe.id} className="recipe">
          <button
            className="delete"
            onClick={() => removeRecipe(recipe)}
          ></button>
          <Link to={`/recipes/${recipe.id}/edit`} state={recipe}>
            <button className="edit"></button>
          </Link>
          <div className="ingredients-tittles">
            <img src={recipe.icon} alt={recipe.name} />

            <h1>{recipe.name}</h1>
            <h2>Ingredients</h2>
            <h3>{totalPrice}</h3>
          </div>
          <div className="ingredients">
            {/* Not use index as list key, use descriptive names */}
            {recipe.ingredients.map((ingredient, i) => (
              <Ingredients
                key={i}
                image={icons[ingredient.ingredient.icon]}
                imageName={ingredient.ingredient.name}
                ingredientQuant={ingredient.quantity}
                ingredientPrice={ingredient.ingredient.price}
              />
            ))}
          </div>
        </div>
      ))}
    </>
  );
}
