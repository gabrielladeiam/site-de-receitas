import "./App.css";
import { Navbar } from "./components";
import { Home, AllRecipes, NewRecipe, Contact, EditRecipe } from "./pages";
import { Route, Routes } from "react-router-dom";

function App() {
  return (
    <>
      <Navbar />
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/recipes" element={<AllRecipes />} />
          <Route path="/recipes/create" element={<NewRecipe />} />
          <Route path="/recipes/:id/edit" element={<EditRecipe />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
