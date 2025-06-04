import { useQuery } from "@tanstack/react-query";
const { VITE_APP_SERVER_URL } = import.meta.env;

export const useFacultyMembersGeoCnu = (year?: string, geoId?: string) => {
  return useQuery({
    queryKey: ["faculty-members-geo-cnu", year, geoId],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (year) params.append("year", year);
      if (geoId) params.append("geo_id", geoId);

      const url = `${VITE_APP_SERVER_URL}/faculty-members/geo/cnu-analysis${
        params.toString() ? `?${params.toString()}` : ""
      }`;
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(
          "Erreur lors de la récupération des données CNU géographiques"
        );
      }
      return response.json();
    },
  });
};
