import { useQuery } from "@tanstack/react-query";

const { VITE_APP_SERVER_URL } = import.meta.env;

type TypologyContext = "fields" | "geo" | "structures";

interface UseTypologyParams {
  context: TypologyContext;
  annee_universitaire?: string;
  contextId?: string;
}

export const useFacultyMembersTypology = ({
  context,
  annee_universitaire,
  contextId,
}: UseTypologyParams) => {
  return useQuery({
    queryKey: [
      "faculty-members-typology",
      context,
      annee_universitaire,
      contextId,
    ],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (annee_universitaire)
        params.append("annee_universitaire", annee_universitaire);

      if (contextId) {
        switch (context) {
          case "fields":
            params.append("field_id", contextId);
            break;
          case "geo":
            params.append("geo_id", contextId);
            break;
          case "structures":
            params.append("structure_id", contextId);
            break;
        }
      }

      const url = `${VITE_APP_SERVER_URL}/faculty-members/typology/${context}${
        params.toString() ? `?${params.toString()}` : ""
      }`;

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(
          "Erreur lors de la récupération des données de typologie"
        );
      }

      const data = await response.json();
      return data;
    },
  });
};
