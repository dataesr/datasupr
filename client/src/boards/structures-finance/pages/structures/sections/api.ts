import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { useFinanceEtablissementEvolution } from "../../../api/api";

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
      .sort((a: any, b: any) => Number(a.exercice) - Number(b.exercice))
      .filter((item: any) => !yearNum || Number(item.exercice) <= yearNum)
      .map((item: any) => ({
        exercice: Number(item.exercice),
        value: Number(item[metricKey]),
      }))
      .filter((item: any) => item.value != null && !isNaN(item.value));
  }, [evolutionData, metricKey, selectedYear]);
};
