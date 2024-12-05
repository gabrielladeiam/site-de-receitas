import "./basepage.styles.css";
import { Recipes, SearchBar } from "..";
import { useState } from "react";

export function BasePage({ children, className }) {
  const [inputValue, setInputValue] = useState("");

  return (
    <>
      <div className="all-recipes-search">
        <SearchBar value={inputValue} onChange={setInputValue} />
      </div>

      {children}

      <div className={className}>
        <Recipes searchQuery={inputValue} />
      </div>
    </>
  );
}
