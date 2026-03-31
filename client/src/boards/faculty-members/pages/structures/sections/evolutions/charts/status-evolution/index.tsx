import { useMemo } from "react";
import ChartWrapper from "../../../../../../../../components/chart-wrapper";
import { createStatusEvolutionOptions } from "./options";

interface StatusEvolutionChartProps {
  statusEvolution: any[];
}

export default function StatusEvolutionChart({
  statusEvolution,
}: StatusEvolutionChartProps) {
  const { options, readingKey } = useMemo(() => {
    if (!statusEvolution?.length) return { options: null, readingKey: null };
    const categories = statusEvolution.map((e: any) => e._id);
    const first = statusEvolution[0];
    const last = statusEvolution[statusEvolution.length - 1];
    const ecFirst = first?.status_breakdown?.find((s: any) => s.status === "enseignant_chercheur")?.count || 0;
    const ecLast = last?.status_breakdown?.find((s: any) => s.status === "enseignant_chercheur")?.count || 0;
    const diff = ecLast - ecFirst;
    const pct = ecFirst > 0 ? ((diff / ecFirst) * 100).toFixed(1) : "0";
    return {
      options: createStatusEvolutionOptions(categories, statusEvolution),
      readingKey: ecFirst > 0 ? {
        fr: (<>
          Les enseignants-chercheurs sont passés de{" "}
          <strong>{ecFirst.toLocaleString("fr-FR")}</strong> ({first._id}) à{" "}
          <strong>{ecLast.toLocaleString("fr-FR")}</strong> ({last._id}),
          soit {diff >= 0 ? "+" : ""}{pct}%.
        </>),
      } : null,
    };
  }, [statusEvolution]);

  if (!options) return null;

  return (
    <ChartWrapper
      config={{
        id: "faculty-status-evolution",
        title: {
          fr: "Évolution par statut",
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
