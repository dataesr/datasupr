import { useQuery } from "@tanstack/react-query";
const { VITE_APP_SERVER_URL } = import.meta.env;

const useFacultyMembersGeoData = (selectedYear?: string) => {
  return useQuery({
    queryKey: ["faculty-members-overview-geo-data", selectedYear],
    queryFn: async () => {
      let url = `${VITE_APP_SERVER_URL}/faculty-members-overview-geo-data`;
      if (selectedYear) {
        url += `?annee=${selectedYear}`;
      }
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(
          "Erreur lors de la récupération des données géographiques"
        );
      }
      return response.json();
    },
  });
};

export default useFacultyMembersGeoData;
