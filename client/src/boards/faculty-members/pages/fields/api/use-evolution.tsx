import { useQuery } from "@tanstack/react-query";
const { VITE_APP_SERVER_URL } = import.meta.env;

const useFacultyMembersEvolution = (disciplineIds?: string[]) => {
  return useQuery({
    queryKey: ["faculty-evolution", disciplineIds?.join(",")],
    queryFn: async () => {
      let url = `${VITE_APP_SERVER_URL}/faculty-members-evolution`;

      if (disciplineIds && disciplineIds.length > 0) {
        const params = new URLSearchParams();
        params.append("disciplines", disciplineIds.join(","));
        url += `?${params.toString()}`;
      }

      const response = await fetch(url);

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(
          `Erreur ${response.status} lors de la récupération des données d'évolution: ${errorData}`
        );
      }

      return await response.json();
    },
    enabled: true,
  });
};

export default useFacultyMembersEvolution;
