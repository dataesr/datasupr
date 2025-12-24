import { useQueries } from "@tanstack/react-query";

const VITE_APP_SERVER_URL = import.meta.env.VITE_APP_SERVER_URL;

export const useMultipleEtablissementsEvolution = (ids: string[]) => {
  return useQueries({
    queries: ids.map((id) => ({
      queryKey: ["finance", "evolution", "etablissement", id],
      queryFn: async () => {
        const url = `${VITE_APP_SERVER_URL}/finance-universite/evolutions/etablissement/${id}`;
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(
            "Erreur lors de la récupération des évolutions de l'établissement"
          );
        }
        return response.json();
      },
      staleTime: 5 * 60 * 1000,
      enabled: Boolean(id),
    })),
  });
};
