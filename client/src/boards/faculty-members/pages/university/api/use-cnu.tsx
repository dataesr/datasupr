import { useQuery } from "@tanstack/react-query";
const { VITE_APP_SERVER_URL } = import.meta.env;

export const useFacultyMembersStructuresCnu = (
  year?: string,
  structureId?: string
) => {
  return useQuery({
    queryKey: ["faculty-members-structures-cnu", year, structureId],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (year) params.append("year", year);
      if (structureId) params.append("structure_id", structureId);

      const url = `${VITE_APP_SERVER_URL}/faculty-members/structures/cnu-analysis${
        params.toString() ? `?${params.toString()}` : ""
      }`;
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(
          "Erreur lors de la récupération des données CNU structures"
        );
      }
      return response.json();
    },
  });
};
