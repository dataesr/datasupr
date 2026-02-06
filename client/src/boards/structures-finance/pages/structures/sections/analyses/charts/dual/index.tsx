import { useState, useMemo } from "react";
import {
  Row,
  Col,
  SegmentedControl,
  SegmentedElement,
} from "@dataesr/dsfr-plus";
import ChartWrapper from "../../../../../../../../components/chart-wrapper";
import MetricDefinitionsTable from "../../../../../../components/metric-definitions/metric-definitions-table";
import { useFinanceEtablissementEvolution } from "../../../../../../api/api";
import { RenderDataComparison } from "../render-data";
import { createDualChartOptions } from "./options";
import { METRICS_CONFIG } from "../../../../../../config/config";
import type { MetricKey } from "../../../../../../config/config";

interface DualEvolutionChartProps {
  etablissementId: string;
  metric1: MetricKey;
  metric2: MetricKey;
  baseMetrics: MetricKey[];
  chartConfig: any;
  xAxisField: "exercice" | "anuniv";
  onIPCChange: (show: boolean) => void;
}

export default function DualEvolutionChart({
  etablissementId,
  metric1,
  metric2,
  baseMetrics,
  chartConfig,
  xAxisField,
  onIPCChange,
}: DualEvolutionChartProps) {
  const { data } = useFinanceEtablissementEvolution(etablissementId);
  const [showIPC, setShowIPC] = useState(false);

  const hasIPCMetrics = useMemo(
    () => baseMetrics.some((m) => m.endsWith("_ipc")),
    [baseMetrics]
  );

  const handleIPCChange = (show: boolean) => {
    setShowIPC(show);
    onIPCChange(show);
  };

  const chartOptions = createDualChartOptions(
    data || [],
    metric1,
    metric2,
    METRICS_CONFIG,
    xAxisField
  );

  if (!data || data.length === 0) {
    return (
      <div className="fr-alert fr-alert--info">
        <p>Aucune donnée disponible</p>
      </div>
    );
  }

  return (
    <>
      {hasIPCMetrics && (
        <Row gutters className="fr-mb-2w">
          <Col xs="12" md="6">
            <SegmentedControl
              className="fr-segmented--sm"
              name="evolution-ipc-mode"
            >
              <SegmentedElement
                checked={!showIPC}
                label="À prix courant"
                onClick={() => handleIPCChange(false)}
                value="nominal"
              />
              <SegmentedElement
                checked={showIPC}
                label="À prix constant"
                onClick={() => handleIPCChange(true)}
                value="constant"
              />
            </SegmentedControl>
          </Col>
        </Row>
      )}
      <ChartWrapper
        config={chartConfig}
        options={chartOptions}
        renderData={() => (
          <RenderDataComparison
            data={data}
            metric1Key={metric1}
            metric1Config={METRICS_CONFIG[metric1]}
            metric2Key={metric2}
            metric2Config={METRICS_CONFIG[metric2]}
          />
        )}
      />
      <MetricDefinitionsTable metricKeys={[metric1, metric2]} />
    </>
  );
}
