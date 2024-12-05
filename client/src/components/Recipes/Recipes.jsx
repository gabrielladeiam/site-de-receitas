import "./recipes.styles.css";
import { Ingredients } from "../Ingredients/Ingredients";
import { useRecipesQuery, useRemoveRecipeMutation } from "../../hooks/recipes";
import { Link } from "react-router-dom";
import * as icons from "../../assets";
import { useState } from "react";

export function Recipes({ totalPrice, searchQuery }) {
  const [page, setPage] = useState(1);

  const { mutate } = useRemoveRecipeMutation(searchQuery);
  const { data, isLoading } = useRecipesQuery(searchQuery, page);
  const { foundRecipes, total } = data || {};

  const shouldRender = !foundRecipes || foundRecipes?.length === 0 || isLoading;
  if (shouldRender) {
    return (
      <>
        <div className="recipe">
          Nenhuma receita encontrada.
          <p />
          <a href="http://localhost:3000/recipes/create">
            Clique aqui para criar a sua primeira receita!
          </a>
        </div>
        <section className="page-section">
          <footer className="page-footer">
            Página {page}
            <br />
            <button onClick={() => setPage(page - 1)} disabled={page === 1}>
              &lt;
            </button>
            <button onClick={() => setPage(page + 1)}>&gt;</button>
          </footer>
        </section>
      </>
    );
  }

  // TODO- Refactor styles, extract internal component
  return (
    <>
      {foundRecipes.map((recipe, index) => (
        // Extract this into a Recipe component
        <div key={index} id={recipe.id} className="recipe">
          <button className="delete" onClick={() => mutate(recipe)} />

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
            {/* Extract this into a ingredient list component */}

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
      {/* To Do: with query totals, check if should disable next page button. Check if page is 1 and disable < button. */}
      <section className="page-section">
        <footer className="page-footer">
          Página {page}
          <br />
          <button onClick={() => setPage(page - 1)} disabled={page === 1}>
            &lt;
          </button>
          <button
            onClick={() => setPage(page + 1)}
            disabled={page === Math.ceil(total / 4)}
          >
            &gt;
          </button>
        </footer>
      </section>
    </>
  );
}
