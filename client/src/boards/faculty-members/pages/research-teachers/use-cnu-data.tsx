import { useQuery } from "@tanstack/react-query";

const { VITE_APP_SERVER_URL } = import.meta.env;

interface UseCnuDataProps {
  context: "fields" | "geo" | "structures";
  contextId?: string;
  annee_universitaire?: string;
}

export function useResearchTeachersData({
  context,
  contextId,
  annee_universitaire,
}: UseCnuDataProps) {
  const params = new URLSearchParams();

  if (contextId) {
    if (context === "fields") params.set("field_id", contextId);
    if (context === "geo") params.set("geo_id", contextId);
    if (context === "structures") params.set("structure_id", contextId);
  }

  if (annee_universitaire)
    params.set("annee_universitaire", annee_universitaire);

  const endpoints = {
    fields: "/faculty-members/fields/research-teachers",
    geo: "/faculty-members/geo/research-teachers",
    structures: "/faculty-members/structures/research-teachers",
  };

  const url = `${VITE_APP_SERVER_URL}${endpoints[context]}${
    params.toString() ? `?${params.toString()}` : ""
  }`;

  return useQuery({
    queryKey: ["research-teachers-data", url],
    queryFn: async () => {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(
          `Erreur lors de la récupération des données des enseignants-chercheurs (${context})`
        );
      }
      return response.json();
    },
    refetchOnWindowFocus: false,
    enabled: !!context,
  });
}
