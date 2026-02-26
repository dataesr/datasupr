import { useQuery } from "@tanstack/react-query";

const { VITE_APP_SERVER_URL } = import.meta.env;

export interface Definition {
  calculfr: string;
  indicateur: string;
  libelle: string;
  PageDefinition: boolean;
  definition: string;
  interpretation: string;
  source1fr?: string | null;
  opendata1?: string | null;
  source2fr?: string | null;
  opendata2?: string | null;
  source3fr?: string | null;
  opendata3?: string | null;
  source4fr?: string | null;
  opendata4?: string | null;
  unite: string;
  ale_sens?: "sup" | "inf" | "infegal" | null;
  ale_val?: number | null;
  ale_lib?: string | null;
  vig_min?: number | null;
  vig_max?: number | null;
  vig_lib?: string | null;
  sens?: "augmentation" | "diminution" | null;
}

export interface DefinitionCategory {
  rubrique: string;
  sousRubriques: {
    nom: string;
    definitions: Definition[];
  }[];
}

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
  });
};

export const useFinanceDefinitions = (enabled = true) => {
  return useQuery({
    queryKey: ["finance", "definitions"],
    queryFn: async () => {
      const url = `${VITE_APP_SERVER_URL}/structures-finance/definitions`;
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Erreur lors de la récupération des définitions");
      }
      return response.json() as Promise<DefinitionCategory[]>;
    },
    enabled,
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
  });
};
