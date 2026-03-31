import { useMemo } from "react";
import ChartWrapper from "../../../../../../../../components/chart-wrapper";
import { createStatusChartOptions } from "./options";

interface StatusChartProps {
  selectedYear: string;
  statusDistribution: any[];
}

export default function StatusChart({
  selectedYear,
  statusDistribution,
}: StatusChartProps) {
  const { options } = useMemo(() => {
    if (!statusDistribution?.length) return { options: null };
    return {
      options: createStatusChartOptions(statusDistribution),

    };
  }, [statusDistribution]);

  if (!options) return null;

  return (
    <ChartWrapper
      config={{
        id: "faculty-status-distribution",
        title: {
          fr: `Répartition par statut (${selectedYear})`,
          look: "h5" as const,
        },
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
