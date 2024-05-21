import { useQuery } from "@tanstack/react-query";

/*
  Recipes queries
*/
export function useRecipesQuery(search) {
  const resolver = async () => {
    let url = "http://localhost:3001/recipes/query";

    if (search) {
      url += `?search=${search}`;
    }

    const response = await fetch(url);

    if (!response.ok) {
      console.error("Failed to fetch recipes");
      return [];
    }

    const data = await response.json();

    return data;
  };

  return useQuery({ queryKey: ["recipes", search], queryFn: resolver });
}

//TODO- Create mutation to remove and add recipes
/*
  Recipes mutations
*/
