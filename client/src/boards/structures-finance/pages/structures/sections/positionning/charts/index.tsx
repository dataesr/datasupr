import { useMemo } from "react";
import ComparisonBarChart from "./comparison-bar";
import ScatterChart from "./scatter";
import { type AnalysisKey } from "../../../../../config/config";
import MetricDefinitionsTable from "../../../../../components/metric-definitions/metric-definitions-table";

export type ChartView = "comparison" | "scatter-1" | "scatter-2" | "scatter-3";

export interface ScatterConfig {
  title: string;
  xMetric: string;
  yMetric: string;
  xLabel: string;
  yLabel: string;
}

interface PositioningChartsProps {
  activeChart: ChartView;
  data: any[];
  currentStructureId?: string;
  currentStructureName: string;
  selectedYear?: string | number;
  selectedAnalysis: AnalysisKey | null;
}

const SCATTER_CONFIGS: Record<string, ScatterConfig> = {
  "scatter-1": {
    title: "Produits de fonctionnement encaissables vs Effectifs d'étudiants",
    xMetric: "produits_de_fonctionnement_encaissables",
    yMetric: "effectif_sans_cpge",
    xLabel: "Produits de fonctionnement encaissables (€)",
    yLabel: "Effectif étudiants (sans CPGE)",
  },
  "scatter-2": {
    title: "SCSP par étudiant vs Taux d'encadrement",
    xMetric: "scsp_par_etudiants",
    yMetric: "taux_encadrement",
    xLabel: "SCSP par étudiant (€)",
    yLabel: "Taux d'encadrement (ETPT/étudiant)",
  },
  "scatter-3": {
    title: "SCSP vs Ressources propres",
    xMetric: "scsp",
    yMetric: "ressources_propres",
    xLabel: "SCSP (€)",
    yLabel: "Ressources propres (€)",
  },
};

export default function PositioningCharts({
  activeChart,
  data,
  currentStructureId,
  currentStructureName,
  selectedYear,
  selectedAnalysis,
}: PositioningChartsProps) {
  const metricKeys = useMemo(() => {
    if (activeChart === "scatter-1") {
      return ["produits_de_fonctionnement_encaissables", "effectif_sans_cpge"];
    } else if (activeChart === "scatter-2") {
      return ["scsp_par_etudiants", "taux_encadrement"];
    } else if (activeChart === "scatter-3") {
      return ["scsp", "ressources_propres"];
    }
    return [];
  }, [activeChart]);

  if (activeChart === "comparison") {
    return (
      <ComparisonBarChart
        data={data}
        currentStructureId={currentStructureId}
        currentStructureName={currentStructureName}
        selectedYear={String(selectedYear)}
        selectedAnalysis={selectedAnalysis}
      />
    );
  }

  const scatterConfig = SCATTER_CONFIGS[activeChart];
  if (!scatterConfig) return null;

  const configWithYear = {
    ...scatterConfig,
    title: `${scatterConfig.title}${selectedYear ? ` — ${selectedYear}` : ""}`,
  };

  return (
    <>
      <ScatterChart
        config={configWithYear}
        data={data}
        currentStructureId={currentStructureId}
        currentStructureName={currentStructureName}
        selectedYear={selectedYear}
      />
      <MetricDefinitionsTable metricKeys={metricKeys} />
    </>
  );
}
