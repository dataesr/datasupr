import { useMemo } from "react";
import ChartWrapper from "../../../../../../../../components/chart-wrapper";
import { createGenderEvolutionOptions } from "./options";

interface GenderEvolutionChartProps {
  globalEvolution: any[];
}

export default function GenderEvolutionChart({
  globalEvolution,
}: GenderEvolutionChartProps) {
  const { options, trend } = useMemo(() => {
    if (!globalEvolution?.length) return { options: null, trend: null };

    const categories = globalEvolution.map((e: any) => e._id);
    const maleData = globalEvolution.map(
      (e: any) =>
        e.gender_breakdown?.find((g: any) => g.gender === "Masculin")?.count ||
        0
    );
    const femaleData = globalEvolution.map(
      (e: any) =>
        e.gender_breakdown?.find((g: any) => g.gender === "Féminin")?.count || 0
    );

    const first = globalEvolution[0];
    const last = globalEvolution[globalEvolution.length - 1];
    const diff = (last?.total || 0) - (first?.total || 0);

    return {
      trend:
        first && last
          ? {
              from: first._id,
              to: last._id,
              diff,
              pct: first.total
                ? ((diff / first.total) * 100).toFixed(1)
                : "0",
            }
          : null,
      options: createGenderEvolutionOptions(categories, maleData, femaleData),
    };
  }, [globalEvolution]);

  if (!options) return null;

  return (
    <ChartWrapper
      config={{
        id: "faculty-gender-evolution",
        title: {
          fr: "Évolution des effectifs par genre",
          look: "h5" as const,
        },
        readingKey: trend
          ? {
              fr: (
                <>
                  Entre {trend.from} et {trend.to}, l'effectif total a{" "}
                  {trend.diff >= 0 ? "augmenté" : "diminué"} de{" "}
                  <strong>
                    {Math.abs(trend.diff).toLocaleString("fr-FR")}
                  </strong>{" "}
                  personnes ({trend.diff >= 0 ? "+" : ""}
                  {trend.pct}&nbsp;%).
                </>
              ),
            }
          : undefined,
        sources: [
          {
            label: { fr: <>MESR-SIES, SISE</> },
            url: { fr: "https://data.enseignementsup-recherche.gouv.fr" },
          },
        ],
      }}
      options={options}
    />
  );
}
