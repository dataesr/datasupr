import { useQuery } from "@tanstack/react-query";
const { VITE_APP_SERVER_URL } = import.meta.env;

const useFacultyMembersGeoData = (selectedYear?: string) => {
  return useQuery({
    queryKey: ["faculty-members-geo-data", selectedYear], // Inclure selectedYear dans la clé de requête
    queryFn: async () => {
      let url = `${VITE_APP_SERVER_URL}/faculty-members-geo-data`;
      if (selectedYear) {
        url += `?annee=${selectedYear}`; // Ajouter le paramètre d'année à l'URL
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
