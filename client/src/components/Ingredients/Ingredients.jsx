import "./ingredients.styles.css";
import { useState } from "react";

export function Ingredients({
  image,
  imageName,
  onClick,
  className,
  buttonOnClick,
  ingredientQuant,
  ingredientPrice,
  style,
}) {
  const [showInfo, setShowInfo] = useState(false);

  const shouldShowInfo = showInfo && ingredientQuant && ingredientPrice;  

  return (
    <span
      style={style}
      className={className}
      onMouseEnter={() => setShowInfo(true)}
      onMouseLeave={() => setShowInfo(false)}
    >
      <button onClick={buttonOnClick}></button>
      <img onClick={onClick} src={image} alt={image} />

      <h3>{imageName}</h3>

      {shouldShowInfo && (
        <div className={`ingredient-info ${showInfo ? "show" : ""}`}>
          <h3>{`R$ ${ingredientPrice}`}</h3>
          <h3>{`${ingredientQuant}Kg`}</h3>
        </div>
      )}
    </span>
  );
}
