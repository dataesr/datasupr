import { useQuery } from "@tanstack/react-query";
const { VITE_APP_SERVER_URL } = import.meta.env;

const useFacultyMembersByEstablishmentType = (selectedYear?: string) => {
  return useQuery({
    queryKey: ["faculty-establishment-types", selectedYear],
    queryFn: async () => {
      let url = `${VITE_APP_SERVER_URL}/faculty-members-establishment-types`;

      if (selectedYear) {
        const params = new URLSearchParams();
        params.append("annee", selectedYear);
        url += `?${params.toString()}`;
      }

      const response = await fetch(url);

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(
          `Erreur ${response.status} lors de la récupération des données par type d'établissement: ${errorData}`
        );
      }

      const data = await response.json();

      return data;
    },
    enabled: true,
  });
};

export default useFacultyMembersByEstablishmentType;
