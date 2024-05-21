import "./App.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Navbar } from "./components";
import { Home, AllRecipes, NewRecipe, Contact, EditRecipe } from "./pages";
import { Route, Routes } from "react-router-dom";

function App() {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
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
    </QueryClientProvider>
  );
}

export default App;
