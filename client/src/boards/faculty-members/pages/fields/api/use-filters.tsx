import { useQuery } from "@tanstack/react-query";
const { VITE_APP_SERVER_URL } = import.meta.env;

// Hook pour récupérer les filtres de disciplines
export const useFacultyMembersFields = () => {
  return useQuery({
    queryKey: ["faculty-members-fields"],
    queryFn: async () => {
      const response = await fetch(
        `${VITE_APP_SERVER_URL}/faculty-members/filters/fields`
      );
      if (!response.ok) {
        throw new Error("Erreur lors de la récupération des disciplines");
      }
      return response.json();
    },
  });
};
