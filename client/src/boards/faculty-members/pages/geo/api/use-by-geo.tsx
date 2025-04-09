import { useQuery } from "@tanstack/react-query";
const { VITE_APP_SERVER_URL } = import.meta.env;

const useFacultyMembersByGeo = (geoId: string, selectedYear?: string) => {
  return useQuery({
    queryKey: ["geo", geoId, selectedYear],
    queryFn: async () => {
      let url = `${VITE_APP_SERVER_URL}/faculty-members-geo-data/${geoId}`;
      if (selectedYear) {
        url += `?annee=${selectedYear}`;
      }
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Erreur lors de la récupération des données");
      }
      return response.json();
    },
    enabled: !!geoId,
  });
};

export default useFacultyMembersByGeo;
