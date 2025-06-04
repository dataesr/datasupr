import { useQuery } from "@tanstack/react-query";
const { VITE_APP_SERVER_URL } = import.meta.env;

export const useFacultyMembersRegions = () => {
  return useQuery({
    queryKey: ["faculty-members-regions"],
    queryFn: async () => {
      const response = await fetch(
        `${VITE_APP_SERVER_URL}/faculty-members/filters/regions`
      );
      if (!response.ok) {
        throw new Error("Erreur lors de la récupération des régions");
      }
      return response.json();
    },
  });
};
