import { Row, Col } from "@dataesr/dsfr-plus";
import ChartWrapper from "../../../../../../../../components/chart-wrapper";
import MetricDefinitionsTable from "../../../../../../components/metric-definitions/metric-definitions-table";
import { RenderDataBase100, RenderDataSingle } from "../render-data";
import { createBase100ChartOptions } from "./options";
import { METRICS_CONFIG } from "../../../../../../config/config";
import type { MetricKey } from "../../../../../../config/config";

interface Base100EvolutionChartProps {
  etablissementId: string;
  selectedMetrics: MetricKey[];
  comparisonConfig: any;
  createChartConfig: (chartId: string, titleOverride?: string) => any;
  getMetricLabel: (metricKey: MetricKey) => string;
  xAxisField: "exercice" | "anuniv";
  data: any[];
}

// Helper pour nettoyer les labels des mentions de prix courant/constant
// En gros on a jamais de _ipc en base 100, donc on peut retirer ces mentions
const cleanPriceLabel = (label: string): string => {
  return label
    .replace(/\s*\(à\sprix\scourants?\)/gi, "")
    .replace(/\s*\(à\sprix\sconstants?\)/gi, "")
    .replace(/\s*à\sprix\scourants?/gi, "")
    .replace(/\s*à\sprix\sconstants?/gi, "")
    .trim();
};

export default function Base100EvolutionChart({
  selectedMetrics,
  comparisonConfig,
  createChartConfig,
  getMetricLabel,
  xAxisField,
  data,
}: Base100EvolutionChartProps) {
  const chartOptionsBase100 = createBase100ChartOptions(
    data || [],
    selectedMetrics,
    METRICS_CONFIG,
    xAxisField
  );

  return (
    <>
      {chartOptionsBase100 && (
        <ChartWrapper
          config={comparisonConfig}
          options={chartOptionsBase100}
          renderData={() => (
            <RenderDataBase100
              data={data}
              metric1Key={selectedMetrics[0]}
              metric1Config={METRICS_CONFIG[selectedMetrics[0]]}
              metric2Key={selectedMetrics[1]}
              metric2Config={METRICS_CONFIG[selectedMetrics[1]]}
            />
          )}
        />
      )}

      <div className="fr-mt-3w">
        {selectedMetrics.length === 3 ? (
          <>
            <Row gutters>
              {selectedMetrics.slice(0, 2).map((metricKey, index) => (
                <Col key={metricKey} md="6" xs="12">
                  <ChartWrapper
                    config={createChartConfig(
                      `evolution-metric${index + 1}`,
                      cleanPriceLabel(getMetricLabel(metricKey))
                    )}
                    options={createBase100ChartOptions(
                      data,
                      [metricKey],
                      METRICS_CONFIG,
                      xAxisField
                    )}
                    renderData={() => (
                      <RenderDataSingle
                        data={data}
                        metricKey={metricKey}
                        metricConfig={METRICS_CONFIG[metricKey]}
                      />
                    )}
                  />
                </Col>
              ))}
            </Row>
            <Row gutters className="fr-mt-3w">
              <Col md="6" xs="12">
                <ChartWrapper
                  config={createChartConfig(
                    `evolution-metric3`,
                    cleanPriceLabel(getMetricLabel(selectedMetrics[2]))
                  )}
                  options={createBase100ChartOptions(
                    data,
                    [selectedMetrics[2]],
                    METRICS_CONFIG,
                    xAxisField
                  )}
                  renderData={() => (
                    <RenderDataSingle
                      data={data}
                      metricKey={selectedMetrics[2]}
                      metricConfig={METRICS_CONFIG[selectedMetrics[2]]}
                    />
                  )}
                />
              </Col>
            </Row>
          </>
        ) : (
          <Row gutters>
            {selectedMetrics.map((metricKey, index) => (
              <Col key={metricKey} md="6" xs="12">
                <ChartWrapper
                  config={createChartConfig(
                    `evolution-metric${index + 1}`,
                    cleanPriceLabel(getMetricLabel(metricKey))
                  )}
                  options={createBase100ChartOptions(
                    data,
                    [metricKey],
                    METRICS_CONFIG,
                    xAxisField
                  )}
                  renderData={() => (
                    <RenderDataSingle
                      data={data}
                      metricKey={metricKey}
                      metricConfig={METRICS_CONFIG[metricKey]}
                    />
                  )}
                />
              </Col>
            ))}
          </Row>
        )}
      </div>
      <MetricDefinitionsTable metricKeys={selectedMetrics} />
    </>
  );
}
