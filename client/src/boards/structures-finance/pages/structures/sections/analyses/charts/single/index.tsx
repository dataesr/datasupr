import { useState, useMemo } from "react";
import {
  Row,
  Col,
  SegmentedControl,
  SegmentedElement,
} from "@dataesr/dsfr-plus";
import ChartWrapper from "../../../../../../../../components/chart-wrapper";
import MetricDefinitionsTable from "../../../../../../components/metric-definitions/metric-definitions-table";
import RessourcesPropresEvolutionChart from "../../../resources/charts/ressources-propres-evolution";
import RessourcesPropresDecompositionChart from "../../../resources/charts/ressources-propres-decomposition";
import RessourcesFormationDecompositionChart from "../../../resources/charts/ressources-formation-decomposition";
import RessourcesRechercheDecompositionChart from "../../../resources/charts/ressources-recherche-decomposition";
import RessourcesAutresDecompositionChart from "../../../resources/charts/ressources-autres-decomposition";
import SanteFinanciereTableau from "../../../sante-financiere/charts/sante-financiere-tableau";
import { useFinanceEtablissementEvolution } from "../../../../../../api/api";
import {
  ThresholdLegend,
  type ThresholdConfig,
} from "../../../../../../config/index";
import { RenderDataSingle } from "../render-data";
import { createSingleChartOptions } from "./options";
import {
  METRICS_CONFIG,
  METRIC_TO_PART,
} from "../../../../../../config/config";
import type { MetricKey, AnalysisKey } from "../../../../../../config/config";

interface SingleEvolutionChartProps {
  etablissementId: string;
  selectedMetric: MetricKey;
  baseMetrics: MetricKey[];
  chartConfig: any;
  metricThreshold: ThresholdConfig | null;
  selectedAnalysis: AnalysisKey;
  etablissementName: string;
  xAxisField: "exercice" | "anuniv";
  onIPCChange: (show: boolean) => void;
  onPartChange: (show: boolean) => void;
}

export default function SingleEvolutionChart({
  etablissementId,
  selectedMetric,
  baseMetrics,
  chartConfig,
  metricThreshold,
  selectedAnalysis,
  etablissementName,
  xAxisField,
  onIPCChange,
  onPartChange,
}: SingleEvolutionChartProps) {
  const { data } = useFinanceEtablissementEvolution(etablissementId);
  const [showIPC, setShowIPC] = useState(false);
  const [showPart, setShowPart] = useState(false);

  const hasIPCMetrics = useMemo(
    () => baseMetrics.some((m) => m.endsWith("_ipc")),
    [baseMetrics]
  );

  const nominalMetric = useMemo(() => {
    if (!hasIPCMetrics) return null;
    const metric = baseMetrics.find((m) => !m.endsWith("_ipc"));
    return metric ? METRICS_CONFIG[metric]?.label : null;
  }, [hasIPCMetrics, baseMetrics]);

  const partMetricKey = useMemo(() => {
    if (baseMetrics.length !== 1) return null;
    const partKey = METRIC_TO_PART[baseMetrics[0]];
    if (!partKey) return null;
    return data?.some(
      (item: any) => item[partKey] != null && item[partKey] !== 0
    )
      ? partKey
      : null;
  }, [baseMetrics, data]);

  const isSanteFinanciere = useMemo(() => {
    const config = METRICS_CONFIG[selectedMetric];
    return (
      config && "category" in config && config.category === "Santé financière"
    );
  }, [selectedMetric]);

  const handleIPCChange = (show: boolean) => {
    setShowIPC(show);
    onIPCChange(show);
  };

  const handlePartChange = (show: boolean) => {
    setShowPart(show);
    onPartChange(show);
  };

  const chartOptions = createSingleChartOptions(
    data || [],
    selectedMetric,
    METRICS_CONFIG,
    metricThreshold,
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
      {(hasIPCMetrics || partMetricKey) && (
        <Row gutters className="fr-mb-2w">
          {hasIPCMetrics && (
            <Col xs="12" md="6">
              <SegmentedControl
                className="fr-segmented--sm"
                name="evolution-ipc-mode"
              >
                <SegmentedElement
                  checked={!showIPC}
                  label={`${nominalMetric || "Valeur"} à prix courant`}
                  onClick={() => handleIPCChange(false)}
                  value="nominal"
                />
                <SegmentedElement
                  checked={showIPC}
                  label={`${nominalMetric || "Valeur"} à prix constant`}
                  onClick={() => handleIPCChange(true)}
                  value="constant"
                />
              </SegmentedControl>
            </Col>
          )}
          {partMetricKey && (
            <Col xs="12" md="6">
              <SegmentedControl
                className="fr-segmented--sm"
                name="evolution-part-mode"
              >
                <SegmentedElement
                  checked={!showPart}
                  label="Valeur"
                  onClick={() => handlePartChange(false)}
                  value="value"
                />
                <SegmentedElement
                  checked={showPart}
                  label="%"
                  onClick={() => handlePartChange(true)}
                  value="part"
                />
              </SegmentedControl>
            </Col>
          )}
        </Row>
      )}
      <ChartWrapper
        config={chartConfig}
        options={chartOptions}
        legend={<ThresholdLegend threshold={metricThreshold} />}
        renderData={() => (
          <RenderDataSingle
            data={data}
            metricKey={selectedMetric}
            metricConfig={METRICS_CONFIG[selectedMetric]}
          />
        )}
      />

      {selectedAnalysis === "ressources-propres" && (
        <div className="fr-mt-3w">
          <RessourcesPropresDecompositionChart
            etablissementName={etablissementName}
          />
        </div>
      )}
      {selectedAnalysis === "ressources-propres" && (
        <div className="fr-mt-3w">
          <RessourcesPropresEvolutionChart
            etablissementName={etablissementName}
          />
        </div>
      )}

      {selectedAnalysis === "ressources-formation" && (
        <div className="fr-mt-3w">
          <RessourcesFormationDecompositionChart
            etablissementName={etablissementName}
          />
        </div>
      )}

      {selectedAnalysis === "ressources-recherche" && (
        <div className="fr-mt-3w">
          <RessourcesRechercheDecompositionChart
            etablissementName={etablissementName}
          />
        </div>
      )}

      {selectedAnalysis === "ressources-autres-recettes" && (
        <div className="fr-mt-3w">
          <RessourcesAutresDecompositionChart
            etablissementName={etablissementName}
          />
        </div>
      )}

      {isSanteFinanciere && (
        <div className="fr-mt-3w">
          <SanteFinanciereTableau data={data?.[0]} />
        </div>
      )}

      <MetricDefinitionsTable metricKeys={[selectedMetric]} />
    </>
  );
}
