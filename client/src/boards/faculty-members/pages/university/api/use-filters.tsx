import { useQuery } from "@tanstack/react-query";
const { VITE_APP_SERVER_URL } = import.meta.env;

export const useFacultyMembersStructures = () => {
  return useQuery({
    queryKey: ["faculty-members-structures"],
    queryFn: async () => {
      const response = await fetch(
        `${VITE_APP_SERVER_URL}/faculty-members/filters/structures`
      );
      if (!response.ok) {
        throw new Error("Erreur lors de la récupération des structures");
      }
      return response.json();
    },
  });
};
