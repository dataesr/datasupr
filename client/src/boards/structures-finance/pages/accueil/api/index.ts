import { useQuery } from "@tanstack/react-query";

const { VITE_APP_SERVER_URL } = import.meta.env;

export const useFinanceEtablissements = (annee?: string, enabled = true) => {
  return useQuery({
    queryKey: ["finance", "etablissements", annee ?? null],
    queryFn: async () => {
      const sp = new URLSearchParams();
      if (annee) sp.append("annee", annee);
      const url = `${VITE_APP_SERVER_URL}/structures-finance/etablissements${
        sp.toString() ? `?${sp.toString()}` : ""
      }`;
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Erreur lors de la récupération des établissements");
      }
      return response.json();
    },
    enabled,
    staleTime: 5 * 60 * 1000,
  });
};
