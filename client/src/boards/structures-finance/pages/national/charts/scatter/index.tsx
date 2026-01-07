import { useMemo } from "react";
import ChartWrapper from "../../../../../../components/chart-wrapper";
import { createScatterOptions, ScatterConfig } from "./options";

interface ScatterChartProps {
  config: ScatterConfig;
  data: any[];
}

export default function ScatterChart({ config, data }: ScatterChartProps) {
  const chartOptions = useMemo(() => {
    return createScatterOptions(config, data);
  }, [config, data]);

  const chartConfig = {
    id: `scatter-${config.xMetric}-${config.yMetric}`,
    title: "",
  };

  return (
    <ChartWrapper
      config={chartConfig}
      options={chartOptions}
      legend={null}
      hideTitle
    />
  );
}
