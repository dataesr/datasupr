import { useQuery } from "@tanstack/react-query";
const { VITE_APP_SERVER_URL } = import.meta.env;

const useFacultyMembersByRegion = (geoId?: string, selectedYear?: string) => {
  return useQuery({
    queryKey: ["faculty-members-region", geoId, selectedYear],
    queryFn: async () => {
      let url;

      if (geoId) {
        url = `${VITE_APP_SERVER_URL}/faculty-members-by-region/${geoId}`;
        if (selectedYear) {
          url += `?year=${selectedYear}`;
        }
      } else {
        url = `${VITE_APP_SERVER_URL}/faculty-members-by-region`;
        if (selectedYear) {
          url += `?year=${selectedYear}`;
        }
      }

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(
          `Erreur lors de la récupération des données${
            geoId ? ` pour la région ${geoId}` : ""
          }`
        );
      }
      return response.json();
    },
    enabled: geoId !== "",
  });
};

export default useFacultyMembersByRegion;
