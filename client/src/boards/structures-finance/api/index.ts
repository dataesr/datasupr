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

export const useFinanceNationalOverview = (annee?: string, enabled = true) => {
  return useQuery({
    queryKey: ["finance", "national-overview", annee ?? null],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (annee) params.append("annee", annee);
      const url = `${VITE_APP_SERVER_URL}/structures-finance/national/overview${
        params.toString() ? `?${params.toString()}` : ""
      }`;
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Erreur lors de la récupération de la vue nationale");
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

export const useFinanceComparison = (
  params: { annee?: string; groupBy?: string; groupValue?: string } = {},
  enabled = true
) => {
  const { annee, groupBy, groupValue } = params;
  return useQuery({
    queryKey: [
      "finance",
      "comparison",
      annee ?? null,
      groupBy ?? null,
      groupValue ?? null,
    ],
    queryFn: async () => {
      const sp = new URLSearchParams();
      if (annee) sp.append("annee", annee);
      if (groupBy) sp.append("groupBy", groupBy);
      if (groupValue) sp.append("groupValue", groupValue);
      const url = `${VITE_APP_SERVER_URL}/structures-finance/comparisons/compare${
        sp.toString() ? `?${sp.toString()}` : ""
      }`;
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Erreur lors de la récupération des comparaisons");
      }
      return response.json();
    },
    enabled: enabled && !!groupBy && !!groupValue,
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

export const useFinanceComparisons = (
  params: { annee?: string; typologie?: string; limit?: number } = {},
  enabled = true
) => {
  const { annee, typologie, limit } = params;
  return useQuery({
    queryKey: [
      "finance",
      "comparisons",
      annee ?? null,
      typologie ?? null,
      limit ?? null,
    ],
    queryFn: async () => {
      const sp = new URLSearchParams();
      if (annee) sp.append("annee", annee);
      if (typologie) sp.append("typologie", typologie);
      if (limit) sp.append("limit", String(limit));
      const url = `${VITE_APP_SERVER_URL}/structures-finance/comparaisons${
        sp.toString() ? `?${sp.toString()}` : ""
      }`;
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Erreur lors de la récupération des comparaisons");
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

export const useFinanceEtablissementOverview = (
  id?: string,
  annee?: string,
  enabled = true
) => {
  return useQuery({
    queryKey: ["finance", "etab-overview", id ?? null, annee ?? null],
    queryFn: async () => {
      if (!id) throw new Error("missing id");
      const sp = new URLSearchParams();
      if (annee) sp.append("annee", annee);
      const url = `${VITE_APP_SERVER_URL}/structures-finance/etablissements/${id}/overview${
        sp.toString() ? `?${sp.toString()}` : ""
      }`;
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Erreur lors de la récupération de l'établissement");
      }
      return response.json();
    },
    enabled: enabled && Boolean(id),
    staleTime: 5 * 60 * 1000,
  });
};

export const useFinanceEvolutionNational = (
  params: { type?: string; typologie?: string; region?: string } = {},
  enabled = true
) => {
  const { type, typologie, region } = params;
  return useQuery({
    queryKey: [
      "finance",
      "evolution",
      "national",
      type ?? null,
      typologie ?? null,
      region ?? null,
    ],
    queryFn: async () => {
      const sp = new URLSearchParams();
      if (type) sp.append("type", type);
      if (typologie) sp.append("typologie", typologie);
      if (region) sp.append("region", region);
      const url = `${VITE_APP_SERVER_URL}/structures-finance/evolutions/national${
        sp.toString() ? `?${sp.toString()}` : ""
      }`;
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(
          "Erreur lors de la récupération des évolutions nationales"
        );
      }
      return response.json();
    },
    enabled,
    staleTime: 5 * 60 * 1000,
  });
};

export const useFinanceEvolutionEtablissement = (
  id?: string,
  enabled = true
) => {
  return useQuery({
    queryKey: ["finance", "evolution", "etablissement", id ?? null],
    queryFn: async () => {
      if (!id) throw new Error("missing id");
      const url = `${VITE_APP_SERVER_URL}/structures-finance/evolutions/etablissement/${id}`;
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(
          "Erreur lors de la récupération des évolutions de l'établissement"
        );
      }
      return response.json();
    },
    enabled: enabled && Boolean(id),
    staleTime: 5 * 60 * 1000,
  });
};

export const useFinanceComparisonData = (
  params: { annee?: string } = {},
  enabled = true
) => {
  const { annee } = params;
  return useQuery({
    queryKey: ["finance", "comparison-data", annee ?? null],
    queryFn: async () => {
      const sp = new URLSearchParams();
      if (annee) sp.append("annee", annee);
      const url = `${VITE_APP_SERVER_URL}/structures-finance/comparisons/data${
        sp.toString() ? `?${sp.toString()}` : ""
      }`;
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(
          "Erreur lors de la récupération des données de comparaison"
        );
      }
      return response.json();
    },
    enabled,
    staleTime: 5 * 60 * 1000,
  });
};
