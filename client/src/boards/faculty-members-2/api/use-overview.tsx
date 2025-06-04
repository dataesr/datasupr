import { useQuery } from "@tanstack/react-query";

const { VITE_APP_SERVER_URL } = import.meta.env;

type OverviewContext = "fields" | "geo" | "structures";

interface UseOverviewParams {
  context: OverviewContext;
  year?: string;
  contextId?: string; // field_id, geo_id, ou structure_id
}
export const useFacultyMembersOverview = ({
  context,
  year,
  contextId,
}: UseOverviewParams) => {
  return useQuery({
    queryKey: ["faculty-members-overview", context, year, contextId],
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
        fields: "/faculty-members/fields/overview",
        geo: "/faculty-members/geo/overview",
        structures: "/faculty-members/structures/overview",
      };

      const url = `${VITE_APP_SERVER_URL}${endpoints[context]}${
        params.toString() ? `?${params.toString()}` : ""
      }`;

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(
          `Erreur lors de la récupération des données ${context}`
        );
      }
      return response.json();
    },
    enabled: !!context,
  });
};
