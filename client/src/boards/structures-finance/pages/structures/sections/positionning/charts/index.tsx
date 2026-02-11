import { Row, Col } from "@dataesr/dsfr-plus";
import ComparisonBarChart from "./comparison-bar";
import ScatterChart from "./scatter";
import AnalysisFilter from "../components/analysis-filter";
import { type AnalysisKey } from "../../../../../config/config";

export type ChartView = "comparison" | "scatter-1" | "scatter-2" | "scatter-3";

interface PositioningChartsProps {
  activeChart: ChartView;
  data: any[];
  allData?: any[];
  currentStructure?: any;
  selectedYear?: string | number;
  selectedAnalysis: AnalysisKey | null;
  onSelectAnalysis?: (analysis: string | null) => void;
  activeFilters?: {
    type?: string;
    typologie?: string;
    region?: string;
    rce?: string;
    devimmo?: string;
  };
}

export default function PositioningCharts({
  activeChart,
  data,
  allData = [],
  currentStructure,
  selectedYear,
  selectedAnalysis,
  onSelectAnalysis,
  activeFilters = {},
}: PositioningChartsProps) {
  const structureName =
    currentStructure?.etablissement_actuel_lib ||
    currentStructure?.etablissement_lib ||
    "l'établissement";

  const structureId = currentStructure?.etablissement_id_paysage_actuel;

  if (activeChart === "comparison") {
    return (
      <Row gutters>
        <Col xs="12" md="4">
          <AnalysisFilter
            data={data}
            selectedAnalysis={selectedAnalysis || "ressources-total"}
            onSelectAnalysis={onSelectAnalysis || (() => {})}
          />
        </Col>
        <Col xs="12" md="8">
          <ComparisonBarChart
            data={data}
            allData={allData}
            currentStructure={currentStructure}
            currentStructureId={structureId}
            currentStructureName={structureName}
            selectedYear={String(selectedYear)}
            selectedAnalysis={selectedAnalysis}
            activeFilters={activeFilters}
          />
        </Col>
      </Row>
    );
  }

  if (activeChart.startsWith("scatter-")) {
    return (
      <ScatterChart
        chartType={activeChart as "scatter-1" | "scatter-2" | "scatter-3"}
        data={data}
        currentStructureId={structureId}
        currentStructureName={structureName}
        selectedYear={selectedYear}
      />
    );
  }

  return null;
}
