import { useQuery } from "@tanstack/react-query";

const { VITE_APP_SERVER_URL } = import.meta.env;

export const useFinanceEtablissementEvolution = (
  id?: string,
  enabled = true
) => {
  return useQuery({
    queryKey: ["finance", "etab-evolution", id ?? null],
    queryFn: async () => {
      if (!id) throw new Error("missing id");
      const url = `${VITE_APP_SERVER_URL}/structures-finance/etablissements/${id}/evolution`;
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(
          "Erreur lors de la récupération de l'évolution de l'établissement"
        );
      }
      return response.json();
    },
    enabled: enabled && Boolean(id),
    staleTime: 5 * 60 * 1000,
  });
};
