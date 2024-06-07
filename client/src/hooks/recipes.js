import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

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

  return useQuery({
    queryKey: ["recipes", search],
    queryFn: resolver,
    staleTime: 30_000,
  });
}

/*
  Recipes mutations
*/
export function useRemoveRecipeMutation() {
  const queryClient = useQueryClient();

  async function resolver(recipe) {
    const response = await fetch(`http://localhost:3001/recipes/${recipe.id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error("Falha ao excluir a receita");
    }

    return response.json();
  }

  return useMutation({
    mutationFn: resolver,
    onSuccess: () => {
      queryClient.invalidateQueries("recipes");
    },
    onError: (error) => {
      console.error("Falha ao excluir a receita: ", error.message);
    },
  });
}
