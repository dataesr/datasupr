import { useQuery } from "@tanstack/react-query";

const { VITE_APP_SERVER_URL } = import.meta.env;

export const useFinanceYears = (enabled = true) => {
  return useQuery({
    queryKey: ["finance", "years"],
    queryFn: async () => {
      const url = `${VITE_APP_SERVER_URL}/structures-finance/filters/years`;
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Erreur lors de la récupération des années");
      }
      return response.json();
    },
    enabled,
    staleTime: 5 * 60 * 1000, // TODO : delete
  });
};

export const useFinanceComparisonFilters = (annee?: string, enabled = true) => {
  return useQuery({
    queryKey: ["finance", "comparison-filters", annee ?? null],
    queryFn: async () => {
      const sp = new URLSearchParams();
      if (annee) sp.append("annee", annee);
      const url = `${VITE_APP_SERVER_URL}/structures-finance/comparisons/filters${
        sp.toString() ? `?${sp.toString()}` : ""
      }`;
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Erreur lors de la récupération des filtres");
      }
      return response.json();
    },
    enabled,
    staleTime: 5 * 60 * 1000,
  });
};
