import { useMemo } from "react";
import {
  Row,
  Col,
  Text,
  SegmentedControl,
  SegmentedElement,
} from "@dataesr/dsfr-plus";
import ChartWrapper from "../../../../../../../../components/chart-wrapper";
import {
  METRICS_CONFIG,
  METRIC_TO_PART,
  type MetricKey,
} from "../../../../../../config/metrics-config";
import { useMetricLabel } from "../../../../../../hooks/useMetricLabel";
import { useMetricThreshold } from "../../../../../../hooks/useMetricThreshold";
import { useMetricSens } from "../../../../../../hooks/useMetricSens";
import {
  createComparisonOverviewOptions,
  type ComparisonOverviewConfig,
  type OverviewDataset,
} from "./options";
import { RenderData } from "./render-data";
import { ThresholdLegend } from "../../../../../../components/threshold/threshold-legend";

function buildComment(config: ComparisonOverviewConfig) {
  return (
    <p
      className="fr-text--xs fr-mb-0"
      style={{ color: "var(--text-mention-grey)" }}
    >
      Ce graphique montre la répartition des valeurs de l'indicateur «&nbsp;
      {config.metricLabel.toLowerCase()}&nbsp;» parmi les établissements
      d'enseignement supérieur, classées de la plus petite valeur à la plus
      grande. Chaque courbe relie les points correspondant à chaque
      établissement, dans l'ordre croissant des valeurs. Les extrémités de
      chaque courbe montrent les valeurs minimales et maximales pour chaque
      regroupement d'établissements.
    </p>
  );
}

interface ComparisonOverviewChartProps {
  config: ComparisonOverviewConfig;
  allData: any[];
  filterDataByCriteria: (criterion: "type" | "typologie" | "region") => any[];
  currentStructure?: any;
  currentStructureId?: string;
  showAll: boolean;
  showRegion: boolean;
  showType: boolean;
  showTypologie: boolean;
  showPart: boolean;
  onShowPartChange: (value: boolean) => void;
}

export default function ComparisonOverviewChart({
  config,
  allData,
  filterDataByCriteria,
  currentStructure,
  currentStructureId,
  showAll,
  showRegion,
  showType,
  showTypologie,
  showPart,
  onShowPartChange,
}: ComparisonOverviewChartProps) {
  const getMetricLabel = useMetricLabel();

  const partMetric = METRIC_TO_PART[config.metric as MetricKey];
  const hasPartVersion = useMemo(() => {
    if (!partMetric || !METRICS_CONFIG[partMetric] || !allData?.length)
      return false;
    return allData.some((item: any) => {
      const value = item[partMetric];
      return value != null && value !== 0;
    });
  }, [partMetric, allData]);

  const activeMetric: MetricKey =
    showPart && hasPartVersion && partMetric
      ? partMetric
      : (config.metric as MetricKey);
  const activeMetricConfig =
    METRICS_CONFIG[activeMetric] || METRICS_CONFIG["effectif_sans_cpge"];
  const activeMetricLabel = getMetricLabel(activeMetric);
  const activeMetricThreshold = useMetricThreshold(activeMetric);
  const activeMetricSens = useMetricSens(activeMetric);

  const metricThreshold = useMetricThreshold(activeMetric);

  const activeConfig: ComparisonOverviewConfig = useMemo(
    () => ({
      ...config,
      metric: activeMetric,
      metricLabel: activeMetricLabel,
      format: activeMetricConfig.format,
      threshold: activeMetricThreshold,
      sens: activeMetricSens,
    }),
    [
      config,
      activeMetric,
      activeMetricLabel,
      activeMetricConfig,
      activeMetricThreshold,
      activeMetricSens,
    ]
  );
  const datasets = useMemo(() => {
    const ds: OverviewDataset[] = [];

    if (showAll) {
      ds.push({ data: allData, label: "Tous les établissements" });
    }
    if (showRegion) {
      const regionLabel =
        currentStructure?.etablissement_actuel_region ||
        currentStructure?.region ||
        "";
      ds.push({
        data: filterDataByCriteria("region"),
        label: `Même région (${regionLabel})`,
      });
    }
    if (showType) {
      const typeLabel =
        currentStructure?.etablissement_actuel_type ||
        currentStructure?.type ||
        "";
      ds.push({
        data: filterDataByCriteria("type"),
        label: `Même type (${typeLabel})`,
      });
    }
    if (showTypologie) {
      const typoLabel =
        currentStructure?.etablissement_actuel_typologie ||
        currentStructure?.typologie ||
        "";
      ds.push({
        data: filterDataByCriteria("typologie"),
        label: `Même typologie (${typoLabel})`,
      });
    }

    return ds;
  }, [
    allData,
    filterDataByCriteria,
    currentStructure,
    showAll,
    showRegion,
    showType,
    showTypologie,
  ]);

  const hasData = useMemo(() => {
    if (!datasets.length || !currentStructureId) return false;
    return datasets.some((ds) =>
      ds.data.some(
        (item) =>
          item.etablissement_id_paysage_actuel === currentStructureId &&
          item[activeMetric] != null &&
          item[activeMetric] !== 0
      )
    );
  }, [datasets, currentStructureId, activeMetric]);

  const currentStructureName =
    currentStructure?.etablissement_actuel_lib ||
    currentStructure?.etablissement_lib ||
    undefined;

  const chartOptions = useMemo(
    () =>
      createComparisonOverviewOptions(
        activeConfig,
        datasets,
        currentStructureId,
        currentStructureName
      ),
    [activeConfig, datasets, currentStructureId, currentStructureName]
  );

  if (!hasData) return null;

  return (
    <div>
      {hasPartVersion && (
        <Row gutters className="fr-mb-3w">
          <Col xs="12" md="6">
            <Text className="fr-text--sm fr-text--bold fr-mb-1w">
              Affichage
            </Text>
            <SegmentedControl
              className="fr-segmented--sm"
              name={`overview-part-mode-${config.metric}`}
            >
              <SegmentedElement
                checked={!showPart}
                label="Valeur"
                onClick={() => onShowPartChange(false)}
                value="value"
              />
              <SegmentedElement
                checked={showPart}
                label="%"
                onClick={() => onShowPartChange(true)}
                value="part"
              />
            </SegmentedControl>
          </Col>
        </Row>
      )}
      <ChartWrapper
        config={{
          id: `comparison-overview-${activeMetric}`,
          title: `${activeMetricLabel} - Positionnement de ${currentStructureName || "l'établissement"} pour l'année ${activeConfig.metricConfig.year}`,
          comment: { fr: buildComment(activeConfig) },
          readingKey: {
            fr: (
              <p
                className="fr-text--xs fr-mb-0"
                style={{ color: "var(--text-mention-grey)" }}
              >
                Les losanges indiquent la position de{" "}
                {currentStructureName || "l'établissement"} en{" "}
                {activeConfig.metricConfig.year} par rapport aux autres
                établissements. L'axe vertical (50&nbsp;%) permet de repérer la
                médiane&nbsp;: la moitié des établissements ont des valeurs
                supérieures à cette valeur, et l'autre moitié des valeurs
                inférieures.
              </p>
            ),
          },
        }}
        legend={<ThresholdLegend threshold={metricThreshold} />}
        options={chartOptions}
        renderData={() => (
          <RenderData
            config={activeConfig}
            datasets={datasets}
            currentStructureId={currentStructureId}
          />
        )}
      />
    </div>
  );
}
