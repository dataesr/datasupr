import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
  Row,
  Col,
  SegmentedControl,
  SegmentedElement,
} from "@dataesr/dsfr-plus";
import { useFinanceEtablissementEvolution } from "../../../../../../api/api";
import { useFinanceDefinitions } from "../../../../../definitions/api";
import {
  createEvolutionChartOptions,
  createStackedEvolutionChartOptions,
  type ThresholdConfig,
} from "./options";
import {
  RenderDataSingle,
  RenderDataComparison,
  RenderDataBase100,
  RenderDataStacked,
} from "./render-data";
import ChartWrapper from "../../../../../../../../components/chart-wrapper";
import RessourcesPropresEvolutionChart from "../../../resources/charts/ressources-propres-evolution";
import MetricDefinitionsTable from "../../components/metric-definitions-table";
import {
  METRICS_CONFIG,
  PREDEFINED_ANALYSES,
  METRIC_TO_PART,
  type MetricKey,
  type AnalysisKey,
} from "./config";

const FINANCIAL_HEALTH_INDICATORS = [
  "resultat_net_comptable",
  "resultat_net_comptable_hors_sie",
  "capacite_d_autofinancement",
  "caf_produits_encaissables",
  "fonds_de_roulement_net_global",
  "tresorerie",
  "fonds_de_roulement_en_jours_de_fonctionnement",
  "tresorerie_en_jours_de_fonctionnement",
  "charges_decaissables_produits_encaissables",
  "taux_de_remuneration_des_permanents",
  "ressources_propres_produits_encaissables",
  "charges_de_personnel_produits_encaissables",
  "caf_acquisitions_d_immobilisations",
  "solde_budgetaire",
];

interface EvolutionChartProps {
  etablissementId?: string;
  etablissementName?: string;
  selectedAnalysis?: AnalysisKey;
}

const capitalizeFirst = (str: string) =>
  str.charAt(0).toUpperCase() + str.slice(1);

export function useAnalysesWithData(etablissementId: string) {
  const { data, isLoading } = useFinanceEtablissementEvolution(etablissementId);

  const analysesWithData = useMemo(() => {
    if (!data || data.length === 0) return new Set<AnalysisKey>();

    const available = new Set<AnalysisKey>();
    const analysisKeys = Object.keys(PREDEFINED_ANALYSES) as AnalysisKey[];

    analysisKeys.forEach((key) => {
      const analysis = PREDEFINED_ANALYSES[key];
      const isStacked = (analysis as any).chartType === "stacked";

      const hasData = isStacked
        ? analysis.metrics.some((metric) => {
            return data.some((item: any) => {
              const value = item[metric];
              return value != null && value !== 0;
            });
          })
        : analysis.metrics.every((metric) => {
            return data.some((item: any) => {
              const value = item[metric];
              return value != null && value !== 0;
            });
          });

      if (hasData) {
        available.add(key);
      }
    });

    return available;
  }, [data]);

  const years = useMemo(() => {
    if (!data) return [];
    return [...new Set(data.map((d) => d.exercice))]
      .filter((y): y is number => typeof y === "number")
      .sort((a, b) => a - b);
  }, [data]);

  const periodText =
    years.length > 0 ? `${years[0]} - ${years[years.length - 1]}` : "";

  return { analysesWithData, periodText, isLoading, data };
}

export default function EvolutionChart({
  etablissementId: propEtablissementId,
  etablissementName,
  selectedAnalysis: propSelectedAnalysis,
}: EvolutionChartProps) {
  const [searchParams] = useSearchParams();
  const [displayMode, setDisplayMode] = useState<"values" | "percentage">(
    "values"
  );
  const [showIPC, setShowIPC] = useState(false);
  const etablissementId =
    propEtablissementId || searchParams.get("structureId") || "";
  const selectedAnalysis =
    propSelectedAnalysis ||
    (searchParams.get("analysis") as AnalysisKey) ||
    "ressources-total";

  const { data } = useFinanceEtablissementEvolution(etablissementId);
  const { data: definitionsData } = useFinanceDefinitions();

  const etabName = etablissementName || data?.[0]?.etablissement_lib || "";

  const analysisConfig = PREDEFINED_ANALYSES[selectedAnalysis];

  const baseMetrics = useMemo(() => {
    return [...analysisConfig.metrics] as MetricKey[];
  }, [analysisConfig]);

  const metricThreshold = useMemo((): ThresholdConfig | null => {
    if (!definitionsData) return null;
    const primaryMetric = baseMetrics.find((m) => !m.endsWith("_ipc"));
    if (!primaryMetric || !FINANCIAL_HEALTH_INDICATORS.includes(primaryMetric))
      return null;

    for (const cat of definitionsData) {
      for (const sr of cat.sousRubriques) {
        const def = sr.definitions.find((d) => d.indicateur === primaryMetric);
        if (
          def &&
          (def.ale_val != null || (def.vig_min != null && def.vig_max != null))
        ) {
          return {
            ale_sens: def.ale_sens,
            ale_val: def.ale_val,
            vig_min: def.vig_min,
            vig_max: def.vig_max,
          };
        }
      }
    }
    return null;
  }, [definitionsData, baseMetrics]);

  const hasIPCMetrics = useMemo(() => {
    return baseMetrics.some((m) => m.endsWith("_ipc"));
  }, [baseMetrics]);

  const selectedMetrics = useMemo(() => {
    if (!hasIPCMetrics || showIPC) {
      return baseMetrics;
    }
    return baseMetrics.filter((m) => !m.endsWith("_ipc"));
  }, [baseMetrics, hasIPCMetrics, showIPC]);

  const nominalMetric = useMemo(() => {
    if (!hasIPCMetrics) return null;
    const nominal = baseMetrics.find((m) => !m.endsWith("_ipc"));
    return nominal ? METRICS_CONFIG[nominal].label : null;
  }, [baseMetrics, hasIPCMetrics]);

  const showBase100 = useMemo(() => {
    return analysisConfig.showBase100 || false;
  }, [analysisConfig]);

  const isStacked = useMemo(() => {
    return (analysisConfig as any).chartType === "stacked";
  }, [analysisConfig]);

  const chartOptions = useMemo(() => {
    if (!data || data.length === 0 || !selectedAnalysis) return null;

    if (isStacked) {
      return createStackedEvolutionChartOptions(
        data,
        selectedMetrics,
        METRICS_CONFIG,
        displayMode === "percentage"
      );
    }

    return createEvolutionChartOptions(
      data,
      selectedMetrics,
      METRICS_CONFIG,
      false,
      metricThreshold
    );
  }, [
    data,
    selectedMetrics,
    selectedAnalysis,
    isStacked,
    displayMode,
    metricThreshold,
  ]);

  const chartOptionsBase100 = useMemo(() => {
    if (!data || data.length === 0 || !selectedAnalysis || !showBase100)
      return null;

    return createEvolutionChartOptions(
      data,
      selectedMetrics,
      METRICS_CONFIG,
      true,
      null
    );
  }, [data, selectedMetrics, selectedAnalysis, showBase100]);

  const years = useMemo(() => {
    if (!data) return [];
    return [...new Set(data.map((d) => d.exercice))]
      .filter((y): y is number => typeof y === "number")
      .sort((a, b) => a - b);
  }, [data]);

  const periodText =
    years.length > 0 ? `${years[0]} - ${years[years.length - 1]}` : "";

  const partMetricKey = useMemo(() => {
    if (selectedMetrics.length !== 1) return null;
    const partKey = METRIC_TO_PART[selectedMetrics[0]];
    if (!partKey) return null;
    const hasPartData = data?.some(
      (item: any) => item[partKey] != null && item[partKey] !== 0
    );
    return hasPartData ? partKey : null;
  }, [selectedMetrics, data]);

  const partChartOptions = useMemo(() => {
    if (!data || data.length === 0 || !partMetricKey) return null;

    return createEvolutionChartOptions(
      data,
      [partMetricKey] as MetricKey[],
      METRICS_CONFIG,
      false
    );
  }, [data, partMetricKey]);

  if (!data || data.length === 0) {
    return (
      <div className="fr-alert fr-alert--info">
        <p>Aucune donnée disponible</p>
      </div>
    );
  }

  if (isStacked && chartOptions) {
    const stackedConfig = {
      id: "evolution-stacked",
      integrationURL: `/integration?chart_id=evolution-stacked&structureId=${etablissementId}&analysis=${selectedAnalysis}`,
      title: `${analysisConfig.label}${etabName ? ` — ${etabName}` : ""}`,
      comment: periodText
        ? {
            fr: (
              <>
                Évolution des effectifs par{" "}
                {analysisConfig.label
                  .toLowerCase()
                  .replace("effectifs par ", "")}{" "}
              </>
            ),
          }
        : undefined,
    };

    return (
      <>
        <div className="fr-mb-2w">
          <SegmentedControl
            className="fr-segmented--sm"
            name="evolution-stacked-mode"
          >
            <SegmentedElement
              checked={displayMode === "values"}
              label="Valeurs"
              onClick={() => setDisplayMode("values")}
              value="values"
            />
            <SegmentedElement
              checked={displayMode === "percentage"}
              label="Part %"
              onClick={() => setDisplayMode("percentage")}
              value="percentage"
            />
          </SegmentedControl>
        </div>

        <ChartWrapper
          config={stackedConfig}
          options={chartOptions}
          renderData={() => (
            <RenderDataStacked
              data={data}
              metrics={selectedMetrics}
              metricsConfig={METRICS_CONFIG}
            />
          )}
        />
        <MetricDefinitionsTable metricKeys={selectedMetrics} />
      </>
    );
  }

  if (selectedMetrics.length === 1 && chartOptions) {
    const singleConfig = {
      id: "evolution-single",
      integrationURL: `/integration?chart_id=evolution-single&structureId=${etablissementId}&analysis=${selectedAnalysis}`,
      title: `${PREDEFINED_ANALYSES[selectedAnalysis].label}${etabName ? ` — ${etabName}` : ""}`,
      comment: periodText
        ? {
            fr: (
              <>
                Évolution de{" "}
                {METRICS_CONFIG[selectedMetrics[0]].label.toLowerCase()} sur la
                période {periodText}.
              </>
            ),
          }
        : undefined,
    };

    const partConfig = partMetricKey
      ? {
          id: "evolution-part",
          integrationURL: `/integration?chart_id=evolution-part&structureId=${etablissementId}&analysis=${selectedAnalysis}`,
          title: `${capitalizeFirst(METRICS_CONFIG[partMetricKey].label)}${etabName ? ` — ${etabName}` : ""}`,
          comment: periodText
            ? {
                fr: (
                  <>
                    Évolution de la {METRICS_CONFIG[partMetricKey].label}{" "}
                    {partMetricKey.includes("effectif")
                      ? "sur le total des effectifs"
                      : "sur ressources propres"}{" "}
                    sur la période {periodText}.
                  </>
                ),
              }
            : undefined,
        }
      : null;

    return (
      <>
        {hasIPCMetrics && (
          <div className="fr-mb-2w">
            <SegmentedControl
              className="fr-segmented--sm"
              name="evolution-ipc-mode"
            >
              <SegmentedElement
                checked={!showIPC}
                label={nominalMetric || "Valeur nominale"}
                onClick={() => setShowIPC(false)}
                value="nominal"
              />
              <SegmentedElement
                checked={showIPC}
                label={`${nominalMetric || "Valeur"} à prix constant`}
                onClick={() => setShowIPC(true)}
                value="constant"
              />
            </SegmentedControl>
          </div>
        )}
        <ChartWrapper
          config={singleConfig}
          options={chartOptions}
          renderData={() => (
            <RenderDataSingle
              data={data}
              metricKey={selectedMetrics[0]}
              metricConfig={METRICS_CONFIG[selectedMetrics[0]]}
            />
          )}
        />

        {partMetricKey && partChartOptions && partConfig && (
          <div className="fr-mt-3w">
            <ChartWrapper
              config={partConfig}
              options={partChartOptions}
              renderData={() => (
                <RenderDataSingle
                  data={data}
                  metricKey={partMetricKey}
                  metricConfig={METRICS_CONFIG[partMetricKey]}
                />
              )}
            />
          </div>
        )}

        {selectedAnalysis === "ressources-propres" && (
          <div className="fr-mt-3w">
            <RessourcesPropresEvolutionChart etablissementName={etabName} />
          </div>
        )}
        <MetricDefinitionsTable metricKeys={selectedMetrics} />
      </>
    );
  }

  if (selectedMetrics.length === 2 && !showBase100 && chartOptions) {
    const dualConfig = {
      id: "evolution-dual",
      integrationURL: `/integration?chart_id=evolution-dual&structureId=${etablissementId}&analysis=${selectedAnalysis}`,
      title: `${PREDEFINED_ANALYSES[selectedAnalysis].label}${etabName ? ` — ${etabName}` : ""}`,
      comment: periodText
        ? {
            fr: (
              <>
                Évolution de{" "}
                {METRICS_CONFIG[selectedMetrics[0]].label.toLowerCase()} et{" "}
                {METRICS_CONFIG[selectedMetrics[1]].label.toLowerCase()} sur la
                période {periodText}.
              </>
            ),
          }
        : undefined,
    };

    return (
      <>
        {hasIPCMetrics && (
          <div className="fr-mb-2w">
            <SegmentedControl
              className="fr-segmented--sm"
              name="evolution-ipc-mode"
            >
              <SegmentedElement
                checked={!showIPC}
                label={nominalMetric || "Valeur nominale"}
                onClick={() => setShowIPC(false)}
                value="nominal"
              />
              <SegmentedElement
                checked={showIPC}
                label={`${nominalMetric || "Valeur"} à prix constant`}
                onClick={() => setShowIPC(true)}
                value="constant"
              />
            </SegmentedControl>
          </div>
        )}
        <ChartWrapper
          config={dualConfig}
          options={chartOptions}
          renderData={() => (
            <RenderDataComparison
              data={data}
              metric1Key={selectedMetrics[0]}
              metric1Config={METRICS_CONFIG[selectedMetrics[0]]}
              metric2Key={selectedMetrics[1]}
              metric2Config={METRICS_CONFIG[selectedMetrics[1]]}
            />
          )}
        />
        <MetricDefinitionsTable metricKeys={selectedMetrics} />
      </>
    );
  }

  if (selectedMetrics.length >= 2 && showBase100) {
    const comparisonConfig = {
      id: "evolution-comparison",
      integrationURL: `/integration?chart_id=evolution-comparison&structureId=${etablissementId}&analysis=${selectedAnalysis}`,
      title: `${PREDEFINED_ANALYSES[selectedAnalysis].label}${etabName ? ` — ${etabName}` : ""}`,
      comment: periodText
        ? { fr: <>Comparaison en base 100 sur la période {periodText}.</> }
        : undefined,
    };

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
                      config={{
                        id: `evolution-metric${index + 1}`,
                        integrationURL: `/integration?chart_id=evolution-metric${index + 1}&structureId=${etablissementId}&analysis=${selectedAnalysis}`,
                        title: METRICS_CONFIG[metricKey].label,
                      }}
                      options={createEvolutionChartOptions(
                        data,
                        [metricKey] as MetricKey[],
                        METRICS_CONFIG,
                        false
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
                    config={{
                      id: `evolution-metric3`,
                      integrationURL: `/integration?chart_id=evolution-metric3&structureId=${etablissementId}&analysis=${selectedAnalysis}`,
                      title: METRICS_CONFIG[selectedMetrics[2]].label,
                    }}
                    options={createEvolutionChartOptions(
                      data,
                      [selectedMetrics[2]] as MetricKey[],
                      METRICS_CONFIG,
                      false
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
                    config={{
                      id: `evolution-metric${index + 1}`,
                      integrationURL: `/integration?chart_id=evolution-metric${index + 1}&structureId=${etablissementId}&analysis=${selectedAnalysis}`,
                      title: METRICS_CONFIG[metricKey].label,
                    }}
                    options={createEvolutionChartOptions(
                      data,
                      [metricKey] as MetricKey[],
                      METRICS_CONFIG,
                      false
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

  return null;
}
