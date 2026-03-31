import { useMemo } from "react";
import ChartWrapper from "../../../../../../../../components/chart-wrapper";
import { createAgeEvolutionOptions } from "./options";

interface AgeEvolutionChartProps {
  ageEvolution: any[];
}

export default function AgeEvolutionChart({
  ageEvolution,
}: AgeEvolutionChartProps) {
  const { options, readingKey } = useMemo(() => {
    if (!ageEvolution?.length) return { options: null, readingKey: null };
    const categories = ageEvolution.map((e: any) => e._id);
    const last = ageEvolution[ageEvolution.length - 1];
    const seniors = last?.age_breakdown?.find((a: any) => a.age_class === "56 ans et plus");
    const juniors = last?.age_breakdown?.find((a: any) => a.age_class === "35 ans et moins");
    const seniorPct = last?.total > 0 ? ((seniors?.count || 0) / last.total * 100).toFixed(0) : "0";
    const juniorPct = last?.total > 0 ? ((juniors?.count || 0) / last.total * 100).toFixed(0) : "0";
    return {
      options: createAgeEvolutionOptions(categories, ageEvolution),
      readingKey: last?.total > 0 ? {
        fr: (<>
          En <strong>{last._id}</strong>, les 56 ans et plus représentent{" "}
          <strong>{seniorPct}%</strong> de l'effectif, contre{" "}
          <strong>{juniorPct}%</strong> pour les 35 ans et moins.
        </>),
      } : null,
    };
  }, [ageEvolution]);

  if (!options) return null;

  return (
    <ChartWrapper
      config={{
        id: "faculty-age-evolution",
        title: {
          fr: "Évolution de la répartition par âge",
          look: "h5" as const,
        },
        readingKey: readingKey || undefined,
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
