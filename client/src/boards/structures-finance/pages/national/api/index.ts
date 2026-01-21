import { useQuery } from "@tanstack/react-query";

const { VITE_APP_SERVER_URL } = import.meta.env;

export const useFinanceAdvancedComparison = (
  params: {
    annee?: string;
    type?: string;
    typologie?: string;
    region?: string;
  } = {},
  enabled = true
) => {
  const { annee, type, typologie, region } = params;
  return useQuery({
    queryKey: [
      "finance",
      "advanced-comparison",
      annee ?? null,
      type ?? null,
      typologie ?? null,
      region ?? null,
    ],
    queryFn: async () => {
      const sp = new URLSearchParams();
      if (annee) sp.append("annee", annee);
      if (type) sp.append("type", type);
      if (typologie) sp.append("typologie", typologie);
      if (region) sp.append("region", region);
      const url = `${VITE_APP_SERVER_URL}/structures-finance/comparisons/advanced${
        sp.toString() ? `?${sp.toString()}` : ""
      }`;
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Erreur lors de la récupération des analyses avancées");
      }
      return response.json();
    },
    enabled,
    staleTime: 5 * 60 * 1000,
  });
};
