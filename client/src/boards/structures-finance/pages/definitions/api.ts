import { useQuery } from "@tanstack/react-query";

const { VITE_APP_SERVER_URL } = import.meta.env;

export interface Definition {
  indicateur: string;
  libelle: string;
  definition: string;
  source: string;
  unite: string;
}

export interface DefinitionCategory {
  rubrique: string;
  sousRubriques: {
    nom: string;
    definitions: Definition[];
  }[];
}

export const useFinanceDefinitions = (language?: string, enabled = true) => {
  return useQuery({
    queryKey: ["finance", "definitions", language ?? "fr"],
    queryFn: async () => {
      const sp = new URLSearchParams();
      if (language) sp.append("language", language);
      const url = `${VITE_APP_SERVER_URL}/structures-finance/definitions${
        sp.toString() ? `?${sp.toString()}` : ""
      }`;
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Erreur lors de la récupération des définitions");
      }
      return response.json() as Promise<DefinitionCategory[]>;
    },
    enabled,
    staleTime: 30 * 60 * 1000, // 30 minutes cache
  });
};
