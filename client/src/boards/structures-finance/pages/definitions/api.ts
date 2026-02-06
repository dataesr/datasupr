import { useQuery } from "@tanstack/react-query";

const { VITE_APP_SERVER_URL } = import.meta.env;

export interface Definition {
  calculfr: string;
  indicateur: string;
  libelle: string;
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
