import { useQuery } from "@tanstack/react-query";
import { CategoryEvolutionResponse } from "./options";

const { VITE_APP_SERVER_URL } = import.meta.env;

interface CategoryEvolutionParams {
  context: "fields" | "geo" | "structures" | undefined;
  contextId: string | undefined;
  start_year?: string;
  end_year?: string;
}

export const useCategoryEvolution = ({
  context,
  contextId,
  start_year,
  end_year,
}: CategoryEvolutionParams) => {
  const params = new URLSearchParams();

  if (context) params.append("context", context);
  if (contextId) params.append("contextId", contextId);
  if (start_year) params.append("start_year", start_year);
  if (end_year) params.append("end_year", end_year);

  const endpoint = "/faculty-members/evolution/categories";

  const url = `${VITE_APP_SERVER_URL}${endpoint}${
    params.toString() ? `?${params.toString()}` : ""
  }`;

  return useQuery<CategoryEvolutionResponse, Error>({
    queryKey: [
      "category-evolution-data",
      context,
      contextId,
      start_year,
      end_year,
    ],
    queryFn: async () => {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(
          `Erreur lors de la récupération des données d'évolution par catégorie (${
            context || "global"
          })`
        );
      }
      return response.json();
    },
  });
};
