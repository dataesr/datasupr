import { useMemo } from "react";
import { useFinanceEtablissementEvolution } from "../api/api";
import { PREDEFINED_ANALYSES, type AnalysisKey } from "../config/config";

export function useAnalysesWithData(etablissementId: string) {
  const { data, isLoading } = useFinanceEtablissementEvolution(etablissementId);

  const analysesWithData = useMemo(() => {
    if (!data || data.length === 0) return new Set<AnalysisKey>();

    const available = new Set<AnalysisKey>();
    const analysisKeys = Object.keys(PREDEFINED_ANALYSES) as AnalysisKey[];

    analysisKeys.forEach((key) => {
      const analysis = PREDEFINED_ANALYSES[key];
      const isStacked = (analysis as any).chartType === "stacked";

      const hasData = isStacked
        ? analysis.metrics.some((metric) => {
            return data.some((item: any) => {
              const value = item[metric];
              return value != null && value !== 0;
            });
          })
        : analysis.metrics.every((metric) => {
            return data.some((item: any) => {
              const value = item[metric];
              return value != null && value !== 0;
            });
          });

      if (hasData) {
        available.add(key);
      }
    });

    return available;
  }, [data]);

  const years = useMemo(() => {
    if (!data) return [];
    return [...new Set(data.map((d: any) => d.exercice))]
      .filter((y): y is number => typeof y === "number")
      .sort((a, b) => a - b);
  }, [data]);

  const periodText =
    years.length > 0 ? `${years[0]} - ${years[years.length - 1]}` : "";

  return { analysesWithData, periodText, isLoading, data };
}
