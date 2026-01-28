import { useQuery } from "@tanstack/react-query";

const { VITE_APP_SERVER_URL } = import.meta.env;

export interface Definition {
  indicateur: string;
  libelle: string;
  definition: string;
  interpretation: string;
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
