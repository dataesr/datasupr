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
    staleTime: 5 * 60 * 1000,
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

export const useFinanceEtablissementDetail = (
  id?: string,
  annee?: string,
  enabled = true
) => {
  return useQuery({
    queryKey: ["finance", "etab-detail", id ?? null, annee ?? null],
    queryFn: async () => {
      if (!id) throw new Error("missing id");
      const sp = new URLSearchParams();
      if (annee) sp.append("annee", annee);
      const url = `${VITE_APP_SERVER_URL}/structures-finance/etablissements/${id}/detail${
        sp.toString() ? `?${sp.toString()}` : ""
      }`;
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(
          "Erreur lors de la récupération du détail de l'établissement"
        );
      }
      return response.json();
    },
    enabled: enabled && Boolean(id),
    staleTime: 5 * 60 * 1000,
  });
};

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
