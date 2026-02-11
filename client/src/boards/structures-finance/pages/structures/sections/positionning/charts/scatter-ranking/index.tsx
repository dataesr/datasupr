import { useMemo } from "react";
import ChartWrapper from "../../../../../../../../components/chart-wrapper";
import { createRankingScatterOptions } from "./options";

interface RankingScatterChartProps {
  rank: number;
  total: number;
  currentStructureName?: string;
}

export default function RankingScatterChart({
  rank,
  total,
  currentStructureName = "",
}: RankingScatterChartProps) {
  const chartOptions = useMemo(
    () => createRankingScatterOptions(rank, total, currentStructureName),
    [rank, total, currentStructureName]
  );

  if (total <= 0) return null;

  return (
    <ChartWrapper
      key={`ranking-${rank}-${total}`}
      config={{ id: "ranking-scatter", title: "" }}
      options={chartOptions}
    />
  );
}
