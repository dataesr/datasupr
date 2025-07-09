import { useQuery } from "@tanstack/react-query";

const { VITE_APP_SERVER_URL } = import.meta.env;

export const useStatusDistribution = ({
  context,
  annee_universitaire,
  contextId,
}: {
  context: "structures" | "fields" | "geo";
  annee_universitaire?: string;
  contextId?: string;
}) => {
  return useQuery({
    queryKey: ["status-distribution", context, annee_universitaire, contextId],
    queryFn: async () => {
      const params = new URLSearchParams();

      if (annee_universitaire) {
        params.append("annee_universitaire", annee_universitaire);
      }

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

      const endpoints = {
        fields: "/faculty-members/fields/status-distribution",
        geo: "/faculty-members/geo/status-distribution",
        structures: "/faculty-members/structures/status-distribution",
      };

      const url = `${VITE_APP_SERVER_URL}${endpoints[context]}${
        params.toString() ? `?${params.toString()}` : ""
      }`;

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Erreur lors de la récupération des données de statut");
      }
      return response.json();
    },
    enabled: !!context,
  });
};
