import "./recipes.styles.css";
import { useState, useEffect } from "react";
import { Ingredients } from "../Ingredients/Ingredients";
import { Link } from "react-router-dom";
import * as icons from "../../assets";

export function Recipes({ totalPrice, searchQuery }) {
  const [recipeList, setRecipeList] = useState();

  //FETCH
  //busca receitas por query
  const fetchQueryList = async () => {
    try {
      let url = "http://localhost:3001/recipes/query";
      if (searchQuery) {
        url += `?search=${searchQuery}`;
      }
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Falha ao buscar receitas");
      }
      const data = await response.json();
      setRecipeList(data);
    } catch (error) {
      console.error("Falha ao pesquisar receitas:", error.message);
    }
  };

  useEffect(() => {
    fetchQueryList();
  });

  //edita uma receita

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
        fetchQueryList();
        console.log("Receita excluída com sucesso!");
      } catch (error) {
        console.error("Falha ao excluir a receita: ", error.message);
      }
    }
  };

  if (!recipeList || recipeList.length === 0) {
    return null; // Não há receitas, nada será renderizado
  }

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
