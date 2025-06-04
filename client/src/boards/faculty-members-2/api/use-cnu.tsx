import { useQuery } from "@tanstack/react-query";

const { VITE_APP_SERVER_URL } = import.meta.env;

type CNUContext = "fields" | "geo" | "structures";

interface UseCNUParams {
  context: CNUContext;
  year?: string;
  contextId?: string; // field_id, geo_id, ou structure_id
}

export const useFacultyMembersCNU = ({
  context,
  year,
  contextId,
}: UseCNUParams) => {
  return useQuery({
    queryKey: ["faculty-members-cnu", context, year, contextId],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (year) params.append("year", year);

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
        fields: "/faculty-members/fields/cnu-analysis",
        geo: "/faculty-members/geo/cnu-analysis",
        structures: "/faculty-members/structures/cnu-analysis",
      };

      const url = `${VITE_APP_SERVER_URL}${endpoints[context]}${
        params.toString() ? `?${params.toString()}` : ""
      }`;

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(
          `Erreur lors de la récupération des données CNU ${context}`
        );
      }
      return response.json();
    },
    enabled: !!context,
  });
};
