import { useQuery } from "@tanstack/react-query";

const { VITE_APP_SERVER_URL } = import.meta.env;

export const useGenderDistribution = ({
  context,
  annee_universitaire,
  contextId,
}: {
  context: "geo" | "fields" | "structures";
  annee_universitaire?: string;
  contextId?: string;
}) => {
  return useQuery({
    queryKey: ["gender-distribution", context, annee_universitaire, contextId],
    queryFn: async () => {
      const params = new URLSearchParams();

      if (annee_universitaire) {
        params.append("annee_universitaire", annee_universitaire);
      }

      if (contextId) {
        switch (context) {
          case "geo":
            params.append("geo_id", contextId);
            break;
          case "fields":
            params.append("field_id", contextId);
            break;
          case "structures":
            params.append("structure_id", contextId);
            break;
        }
      }

      const endpoints = {
        geo: "/faculty-members/geo/gender-distribution",
        fields: "/faculty-members/fields/gender-distribution",
        structures: "/faculty-members/structures/gender-distribution",
      };

      const url = `${VITE_APP_SERVER_URL}${endpoints[context]}${
        params.toString() ? `?${params.toString()}` : ""
      }`;

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Erreur lors de la récupération des données");
      }

      return response.json();
    },
    enabled: !!context && !!annee_universitaire,
  });
};
