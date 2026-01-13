import { useMemo } from "react";
import ChartWrapper from "../../../../../../components/chart-wrapper";
import { createScatterOptions, ScatterConfig } from "./options";
import { RenderData } from "./render-data";

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
    title: {
      className: "fr-mt-0w",
      look: "h5" as const,
      size: "h3" as const,
      fr: config.title,
    },
  };

  return <ChartWrapper config={chartConfig} options={chartOptions} renderData={() => <RenderData config={config} data={data} />} />;
}
