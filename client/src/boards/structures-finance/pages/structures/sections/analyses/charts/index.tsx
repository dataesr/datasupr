import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { SegmentedControl, SegmentedElement } from "@dataesr/dsfr-plus";
import { useFinanceEtablissementEvolution } from "../../../../../api";
import StructureColumnRangeChart from "./column-range";
import { useMetricLabel } from "../../../../../hooks/useMetricLabel";
import { useMetricThreshold } from "../../../../../hooks/useMetricThreshold";
import StackedEvolutionChart from "./stacked";
import SingleEvolutionChart from "./single";
import DualEvolutionChart from "./dual";
import Base100EvolutionChart from "./base100";
import SyntheseSanteFinanciere from "./synthese-sante-financiere";
import {
  METRICS_CONFIG,
  PREDEFINED_ANALYSES,
  METRIC_TO_PART,
  type MetricKey,
  type AnalysisKey,
} from "../../../../../config/metrics-config";

interface EvolutionChartProps {
  etablissementId?: string;
  etablissementName?: string;
  selectedAnalysis?: AnalysisKey;
  periodText?: string;
}

export default function EvolutionChart({
  etablissementId = "",
  etablissementName,
  selectedAnalysis = "" as AnalysisKey,
  periodText = "",
}: EvolutionChartProps) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [displayMode, setDisplayMode] = useState<"values" | "percentage">(
    "values"
  );
  const [showIPC, setShowIPC] = useState(false);
  const [showPart, setShowPart] = useState(false);
  const [viewMode, setViewMode] = useState<"evolution" | "variation">(
    "evolution"
  );

  const activeEtablissementId =
    etablissementId || searchParams.get("structureId") || "";
  const activeSelectedAnalysis =
    selectedAnalysis || (searchParams.get("analysis") as AnalysisKey);

  const displayModeParam = searchParams.get("analysisDisplay");
  const priceModeParam = searchParams.get("analysisPrice");
  const valueModeParam = searchParams.get("analysisValue");

  const syncParam = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams);
    params.set(key, value);
    setSearchParams(params, { replace: true });
  };

  const handleDisplayModeChange = (mode: "values" | "percentage") => {
    setDisplayMode(mode);
    syncParam("analysisDisplay", mode);
  };

  const handleIPCChange = (show: boolean) => {
    setShowIPC(show);
    syncParam("analysisPrice", show ? "constant" : "current");
  };

  const handlePartChange = (show: boolean) => {
    setShowPart(show);
    syncParam("analysisValue", show ? "part" : "value");
  };

  useEffect(() => {
    setDisplayMode(displayModeParam === "percentage" ? "percentage" : "values");
  }, [displayModeParam]);

  useEffect(() => {
    setShowIPC(priceModeParam === "constant");
  }, [priceModeParam]);

  useEffect(() => {
    setShowPart(valueModeParam === "part");
  }, [valueModeParam]);

  const { data: rawData } = useFinanceEtablissementEvolution(
    activeEtablissementId
  );

  // Logique métier en lien avec les id actual etc......
  // Nécessaire pour les institutions fusionnées qui ont plusieurs
  // lignes pour une même année (ex: Université de Lille 2018-2020).
  const data = useMemo(() => {
    if (!rawData) return undefined;

    const currentStructureId = String(activeEtablissementId || "").trim();
    const filteredData = rawData.filter((item: any) => {
      if (!currentStructureId) return true;
      return (
        String(item.etablissement_id_paysage || "").trim() ===
        currentStructureId
      );
    });

    const uniqueByExercice = new Map();
    filteredData.forEach((item: any) => {
      const key = item.exercice || item.anuniv;
      if (!uniqueByExercice.has(key)) {
        uniqueByExercice.set(key, item);
      }
    });

    return Array.from(uniqueByExercice.values()).map((item: any) => ({
      ...item,
      exercice_fin:
        item.sanfin_source === "Budget"
          ? `${item.exercice} (budget)`
          : String(item.exercice),
    }));
  }, [rawData, activeEtablissementId]);

  const getMetricLabel = useMetricLabel();

  const etabName = etablissementName || data?.[0]?.etablissement_lib || "";
  const analysisConfig = PREDEFINED_ANALYSES[activeSelectedAnalysis];
  const baseMetrics = [...analysisConfig.metrics] as MetricKey[];
  const primaryMetric = baseMetrics.find((m) => !m.endsWith("_ipc"));
  const metricThreshold = useMetricThreshold(primaryMetric);
  const isStacked = (analysisConfig as any).chartType === "stacked";
  const isSynthese = (analysisConfig as any).chartType === "synthese";
  const isBase100 = analysisConfig.showBase100;
  const isFormationsCategory =
    analysisConfig.category === "Dîplomes et formations";
  const useAcademicYear = activeSelectedAnalysis === "scsp-etudiant";
  const xAxisField =
    useAcademicYear || isFormationsCategory ? "anuniv" : "exercice_fin";

  const selectedMetrics = useMemo(() => {
    let metrics = baseMetrics;
    const hasIPCMetrics = baseMetrics.some((m) => m.endsWith("_ipc"));

    // En base 100, on exclut TOUJOURS les métriques IPC, sinon ça veut rien dire
    if (isBase100) {
      metrics = baseMetrics.filter((m) => !m.endsWith("_ipc"));
    } else if (!hasIPCMetrics || showIPC) {
      metrics = baseMetrics;
    } else {
      metrics = baseMetrics.filter((m) => !m.endsWith("_ipc"));
    }

    if (showPart && metrics.length === 1) {
      const partKey = METRIC_TO_PART[metrics[0]];
      if (partKey && METRICS_CONFIG[partKey]) {
        const hasPartData = data?.some(
          (item: any) => item[partKey] != null && item[partKey] !== 0
        );
        if (hasPartData) {
          return [partKey];
        }
      }
    }

    return metrics;
  }, [baseMetrics, showIPC, showPart, data, isBase100]);

  const createChartConfig = (
    chartId: string,
    titleOverride?: string,
    commentOverride?: JSX.Element
  ) => ({
    id: chartId,
    integrationURL: `/integration?chart_id=${chartId}&structureId=${activeEtablissementId}&analysis=${activeSelectedAnalysis}`,
    title:
      titleOverride ||
      `${getMetricLabel(baseMetrics[0])}${etabName ? ` — ${etabName}` : ""}`,
    comment: periodText ? { fr: commentOverride || <></> } : undefined,
  });

  if (!data || data.length === 0) {
    return (
      <div className="fr-alert fr-alert--info">
        <p>Aucune donnée disponible</p>
      </div>
    );
  }

  if (isSynthese) {
    return (
      <SyntheseSanteFinanciere
        etablissementId={activeEtablissementId}
        etablissementName={etabName}
      />
    );
  }

  if (isStacked) {
    return (
      <StackedEvolutionChart
        etablissementId={activeEtablissementId}
        selectedMetrics={selectedMetrics}
        baseMetrics={baseMetrics}
        chartConfig={createChartConfig(
          "evolution-stacked",
          undefined,
          <>
            Évolution des effectifs par{" "}
            {analysisConfig.label.toLowerCase().replace("effectifs par ", "")}
          </>
        )}
        displayMode={displayMode}
        onDisplayModeChange={handleDisplayModeChange}
        xAxisField={xAxisField}
        data={data}
      />
    );
  }

  if (selectedMetrics.length === 1) {
    return (
      <>
        <SegmentedControl
          className="fr-segmented--sm fr-mb-3w"
          name="analysis-view-mode"
        >
          <SegmentedElement
            checked={viewMode === "evolution"}
            label="Évolution"
            onClick={() => setViewMode("evolution")}
            value="evolution"
          />
          <SegmentedElement
            checked={viewMode === "variation"}
            label="Variation"
            onClick={() => setViewMode("variation")}
            value="variation"
          />
        </SegmentedControl>
        {viewMode === "variation" ? (
          <StructureColumnRangeChart
            data={data}
            metricKey={selectedMetrics[0]}
            etablissementName={etabName}
          />
        ) : (
          <SingleEvolutionChart
            etablissementId={activeEtablissementId}
            selectedMetric={selectedMetrics[0]}
            baseMetrics={baseMetrics}
            chartConfig={createChartConfig(
              "evolution-single",
              undefined,
              <>
                Évolution de {getMetricLabel(selectedMetrics[0]).toLowerCase()}{" "}
                sur la période {periodText}.
              </>
            )}
            metricThreshold={metricThreshold}
            selectedAnalysis={activeSelectedAnalysis}
            etablissementName={etabName}
            xAxisField={xAxisField}
            showIPC={showIPC}
            showPart={showPart}
            onIPCChange={handleIPCChange}
            onPartChange={handlePartChange}
            data={data}
          />
        )}
      </>
    );
  }

  if (selectedMetrics.length === 2 && !analysisConfig.showBase100) {
    return (
      <DualEvolutionChart
        etablissementId={activeEtablissementId}
        metric1={selectedMetrics[0]}
        metric2={selectedMetrics[1]}
        baseMetrics={baseMetrics}
        chartConfig={createChartConfig(
          "evolution-dual",
          undefined,
          <>
            Évolution de {getMetricLabel(selectedMetrics[0]).toLowerCase()} et{" "}
            {getMetricLabel(selectedMetrics[1]).toLowerCase()} sur la période{" "}
            {periodText}.
          </>
        )}
        xAxisField={xAxisField}
        showIPC={showIPC}
        onIPCChange={handleIPCChange}
        data={data}
      />
    );
  }

  if (selectedMetrics.length >= 2 && analysisConfig.showBase100) {
    return (
      <Base100EvolutionChart
        etablissementId={activeEtablissementId}
        selectedMetrics={selectedMetrics}
        baseMetrics={baseMetrics}
        comparisonConfig={createChartConfig(
          "evolution-comparison",
          undefined,
          <>Comparaison en base 100 sur la période {periodText}.</>
        )}
        createChartConfig={createChartConfig}
        getMetricLabel={getMetricLabel}
        xAxisField={xAxisField}
        data={data}
      />
    );
  }

  return null;
}
