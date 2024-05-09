import "./new-recipe.styles.css";
import { Ingredients } from "../../components";

import { useState, useEffect, useRef } from "react";
import * as icons from "../../assets";

export function NewRecipe() {
  const allRecipeIcons = [
    icons["abacate"],
    icons["alface"],
    icons["brocolis"],
    icons["cenoura"],
    icons["frutas"],
    icons["laranja"],
    icons["legumes"],
    icons["maca"],
    icons["melancia"],
    icons["morango"],
    icons["pera"],
    icons["repolho"],
    icons["tomate"],
    icons["uva"],
  ];

  //será substituido por um estado
  const [recipeName, setRecipeName] = useState("Name Your Recipe");
  const [recipeIcon, setRecipeIcon] = useState(icons["plus"]);
  const [recipePrice, setRecipePrice] = useState();
  //controlam a visibilidade das divs
  const [inputVisible, setInputVisible] = useState("off");
  const [imgVisible, setImgVisible] = useState("off");
  const [ingredientConfigVisible, setIngredientConfigVisible] = useState("off");
  const [selectedImage, setSelectedImage] = useState(null);
  //Informações dos Ingredientes Selecionados
  const [ingredientQuant, setIngredientQuant] = useState("");
  const [ingredientInfo, setIngredientInfo] = useState({
    name: "",
    price: "",
    icon: icons["plus"],
    quantity: 0,
    id: "",
  });

  //Armazena a lista de ingredientes selecionados
  const [ingredientList, setIngredientList] = useState([]);

  //Resultado do Fetch
  const [allIngredients, setAllIngredients] = useState([]);

  const inputTitleRef = useRef();
  const inputRef = useRef();

  //FETCHS

  //buscar ingredientes_________________________________________________________________________
  const fetchAllIngredients = async () => {
    try {
      const response = await fetch("http://localhost:3001/ingredients");
      if (!response.ok) {
        throw new Error("Falha ao buscar lista de ingredientes");
      }
      const data = await response.json();
      setAllIngredients(data);
    } catch (error) {
      console.error("Falha ao exibir lista de ingredientes: ", error.message);
    }
  };

  useEffect(() => {
    fetchAllIngredients();
  }, []);
  //salvar receita
  const saveRecipe = async (recipe) => {
    try {
      const response = await fetch("http://localhost:3001/recipes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ data: recipe }), // Enviar os dados como objeto { data: recipe }
      });
      if (!response.ok) {
        throw new Error("Falha ao adicionar receita");
      }
      // Defina os estados após o sucesso da requisição
      setRecipeIcon(icons["plus"]);
      setRecipeName("Name Your Recipe");
      setIngredientList([]);
      window.alert("Receita Adicionada com Sucesso!");
    } catch (error) {
      console.error("Falha ao adicionar receita: ", error.message);
    }
  };

  //ABRIR E FECHAR DIVS_______________________________________________________________________

  const closeDivs = () => {
    setInputVisible("off");
    setIngredientConfigVisible("off");
    setImgVisible("off");
  };

  useEffect(() => {
    const escCloseDivs = (event) => {
      if (event.keyCode === 27) {
        closeDivs();
      }
    };
    document.addEventListener("keydown", escCloseDivs);
    return () => {
      document.removeEventListener("keydown", escCloseDivs);
    };
  }, []);

  useEffect(() => {
    inputTitleRef.current.focus();
  }, [inputVisible]);

  useEffect(() => {
    inputRef.current.focus();
  }, [ingredientConfigVisible]);

  const handleNameClick = () => {
    setInputVisible("title-on");
    setIngredientConfigVisible("off");
    setImgVisible("off");
  };

  const handleImgClick = () => {
    setImgVisible("img-on");
    setIngredientConfigVisible("off");
    setInputVisible("off");
  };

  const handleIngredientImgClick = () => {
    setIngredientConfigVisible("ingredient-config-on");
    setImgVisible("off");
    setInputVisible("off");
  };

  //SALVAR INFORMAÇÕES_________________________________________________________________________

  //Título da Receita
  const handleInputKeyDown = ({ target, key }) => {
    if (key === "Enter") {
      setRecipeName(!target.value ? "Name Your Recipe" : target.value);
      setInputVisible("off");
    }
  };

  //Icone da Receita
  const handleIconClick = (newSrc) => {
    setRecipeIcon(newSrc);
    setImgVisible("off");
  };

  //Icone e informação do Ingrediente
  const handleIngredientIconClick = (ingredient) => {
    setSelectedImage(ingredient);
    setIngredientInfo({
      name: ingredient.name,
      price: ingredient.price,
      icon: icons[ingredient.icon],
      id: ingredient.id,
    });
  };

  //ADICIONA O INGREDIENT NA LISTA
  const handleIngredientConfigKeyDown = ({ key }) => {
    if (key === "Enter") {
      const newIngredient = {
        name: ingredientInfo.name,
        price: ingredientInfo.price,
        icon: ingredientInfo.icon,
        quantity: ingredientQuant, // Adicionando a quantidade diretamente aqui
        id: ingredientInfo.id,
      };

      setIngredientList((prevIngredientList) => [
        ...prevIngredientList,
        newIngredient,
      ]);
      handleRecipePrice([...ingredientList, newIngredient]); // Passando a lista atualizada de ingredientes
      setIngredientConfigVisible("off");
      setSelectedImage(null);
      setIngredientQuant("");
      setIngredientInfo({
        name: "",
        price: "",
        icon: icons["plus"],
        quantity: 0,
      });
    }
  };

  //DELETA UM INGREDIENT NA LISTA
  const handleDeleteIng = (ingredientName) => {
    const updatedIngredientList = ingredientList.filter(
      (ingredient) => ingredient.name !== ingredientName
    );
    setIngredientList(updatedIngredientList);
  };

  //CALCULA O PREÇO DA RECEITA
  const handleRecipePrice = (ingredientList) => {
    const ingredientPrice = ingredientList.map((ingredient) => {
      const price = Number(ingredient.price);
      const quantity = Number(ingredient.quantity);
      return price * quantity;
    });
    const recipeTotalPrice = ingredientPrice.reduce(
      (acc, curr) => acc + curr,
      0
    );

    setRecipePrice(recipeTotalPrice);
  };
  //SALVANDO RECEITA
  const handleButtonClick = async () => {
    if (
      recipeIcon === icons["plus"] ||
      recipeName === "Name Your Recipe" ||
      ingredientList.length === 0
    ) {
      window.alert("Está faltando informações na receita");
    } else {
      const newRecipe = {
        name: recipeName,
        icon: recipeIcon,
        ingredients: ingredientList,
      };
      saveRecipe(newRecipe);
    }
  };

  return (
    <div className="new-recipe-container">
      <button className="save-recipe" onClick={() => handleButtonClick()}>
        Save Recipe
      </button>

      <div className="recype">
        <div className="ingredients-tittles">
          <img
            style={{ cursor: "pointer" }}
            onClick={() => handleImgClick()}
            src={recipeIcon}
            alt="Recipe Icon"
          />
          <noscript>
            SELEÇÃO DO ICONE DA RECEITA_________________________________________
          </noscript>
          <div className={imgVisible}>
            {allRecipeIcons.map((icon, index) => (
              <img
                style={{ cursor: "pointer" }}
                src={icon}
                onClick={() => handleIconClick(icon)}
                key={index}
                alt={`icon ${index + 1}`}
              />
            ))}
          </div>
          <noscript>
            SELEÇÃO DO NOME DA RECEITA__________________________________________
          </noscript>
          <h1 className="title" onClick={() => handleNameClick()}>
            {recipeName}
          </h1>
          <input
            className={inputVisible}
            type="text"
            onKeyDown={handleInputKeyDown}
            ref={inputTitleRef}
          />
          <h2>Ingredients</h2>
          <h3>R${recipePrice}</h3>
        </div>
        <noscript>
          BOTÃO DE ADICIONAR INGREDIENTE________________________________________
        </noscript>
        <div className="ingredients">
          <Ingredients
            style={{ cursor: "pointer" }}
            onClick={() => handleIngredientImgClick()}
            image={icons["plus"]}
            imageName={"Adicionar"}
          />
          {ingredientList.map((ingredient, index) => (
            <Ingredients
              buttonOnClick={() => handleDeleteIng(ingredient.name)}
              className={"ingredient-list"}
              key={index}
              image={ingredient.icon}
              imageName={ingredient.name}
              ingredientQuant={ingredient.quantity}
              ingredientPrice={ingredient.price}
            />
          ))}
          <noscript>
            SELEÇÃO DOS INGREDIENTES____________________________________________
          </noscript>
          <div
            className={ingredientConfigVisible}
            onKeyDown={handleIngredientConfigKeyDown}
          >
            <div className="ingredient-config-icons">
              {allIngredients.map((ingredient, index) => (
                <Ingredients
                  style={{ cursor: "pointer" }}
                  key={index}
                  image={icons[ingredient.icon]}
                  imageName={ingredient.name}
                  onClick={() => handleIngredientIconClick(ingredient)}
                  className={
                    selectedImage === ingredient
                      ? "grid-item selected"
                      : "grid-item"
                  }
                />
              ))}
            </div>
            <input
              name="ingredientQuant"
              type="number"
              placeholder="Quantidade em Kg"
              value={ingredientQuant}
              onChange={(e) => setIngredientQuant(e.target.value)}
              ref={inputRef}
            />
            Kg
          </div>
        </div>
      </div>
    </div>
  );
}
