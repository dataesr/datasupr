import { useQuery } from "@tanstack/react-query";
const { VITE_APP_SERVER_URL } = import.meta.env;

const useFacultyMembersAgeEvolution = (disciplineId?: string) => {
  return useQuery({
    queryKey: ["faculty-age-evolution", disciplineId],
    queryFn: async () => {
      let url = `${VITE_APP_SERVER_URL}/faculty-members-age-evolution`;

      if (disciplineId) {
        url += `?discipline=${disciplineId}`;
      }

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(
          `Erreur ${response.status} lors de la récupération des données d'évolution par âge`
        );
      }

      return await response.json();
    },
  });
};

export default useFacultyMembersAgeEvolution;
