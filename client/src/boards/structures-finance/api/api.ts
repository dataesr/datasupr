import { useQuery } from "@tanstack/react-query";

const { VITE_APP_SERVER_URL } = import.meta.env;

interface MultipleStructuresResponse {
  hasMultiples: boolean;
  count: number;
  etablissements: Array<{
    etablissement_id_paysage: string;
    etablissement_lib: string;
    etablissement_id_paysage_actuel: string;
    etablissement_actuel_lib: string;
    type: string;
    typologie: string;
    exercice: number;
    date_de_creation?: string;
    date_de_fermeture?: string;
    effectif_sans_cpge?: number;
    anuniv: string;
  }>;
}

export const useCheckMultipleStructures = (
  id?: string,
  annee?: string,
  enabled = true
) => {
  return useQuery<MultipleStructuresResponse>({
    queryKey: ["finance", "check-multiples", id ?? null, annee ?? null],
    queryFn: async () => {
      if (!id) throw new Error("missing id");
      const sp = new URLSearchParams();
      if (annee) sp.append("annee", annee);
      const url = `${VITE_APP_SERVER_URL}/structures-finance/etablissements/${id}/check-multiples${
        sp.toString() ? `?${sp.toString()}` : ""
      }`;
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(
          "Erreur lors de la vérification des établissements multiples"
        );
      }
      return response.json();
    },
    enabled: enabled && Boolean(id),
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

export const useFinanceStructureDetail = (
  id?: string,
  annee?: string,
  enabled = true,
  useHistorical = false
) => {
  return useQuery({
    queryKey: [
      "finance",
      "etab-detail",
      id ?? null,
      annee ?? null,
      useHistorical,
    ],
    queryFn: async () => {
      if (!id) throw new Error("missing id");
      const sp = new URLSearchParams();
      if (annee) sp.append("annee", annee);
      if (useHistorical) sp.append("useHistorical", "true");
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

interface CheckExistsResponse {
  exists: boolean;
  etablissement_id_paysage?: string;
  etablissement_lib?: string;
  etablissement_lib_historique?: string;
  etablissementActuel?: {
    etablissement_id_paysage: string;
    etablissement_id_paysage_actuel: string;
    etablissement_lib: string;
    etablissement_actuel_lib: string;
  } | null;
}

export const useCheckStructureExists = (
  id?: string,
  annee?: string,
  enabled = true
) => {
  return useQuery<CheckExistsResponse>({
    queryKey: ["finance", "check-exists", id ?? null, annee ?? null],
    queryFn: async () => {
      if (!id) throw new Error("missing id");
      const sp = new URLSearchParams();
      if (annee) sp.append("annee", annee);
      const url = `${VITE_APP_SERVER_URL}/structures-finance/etablissements/${id}/check-exists${
        sp.toString() ? `?${sp.toString()}` : ""
      }`;
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Erreur lors de la vérification de l'établissement");
      }
      return response.json();
    },
    enabled: enabled && Boolean(id) && Boolean(annee),
    staleTime: 5 * 60 * 1000,
  });
};
