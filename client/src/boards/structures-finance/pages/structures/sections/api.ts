import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";

const { VITE_APP_SERVER_URL } = import.meta.env;

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

export const useMetricEvolution = (metricKey: string) => {
  const [searchParams] = useSearchParams();
  const etablissementId = searchParams.get("structureId") || "";
  const selectedYear = searchParams.get("year") || "";

  const { data: evolutionData } = useFinanceEtablissementEvolution(
    etablissementId,
    !!etablissementId
  );

  return useMemo(() => {
    if (!evolutionData || evolutionData.length === 0) return undefined;
    const yearNum = selectedYear ? Number(selectedYear) : null;
    return evolutionData
      .sort((a: any, b: any) => a.exercice - b.exercice)
      .filter((item: any) => !yearNum || item.exercice <= yearNum)
      .map((item: any) => ({ exercice: item.exercice, value: item[metricKey] }))
      .filter((item: any) => item.value != null && !isNaN(item.value));
  }, [evolutionData, metricKey, selectedYear]);
};
