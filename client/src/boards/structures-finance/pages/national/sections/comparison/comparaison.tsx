import { Row, Col, Text } from "@dataesr/dsfr-plus";
import ComparisonBarChart from "./chart/comparison-bar";
import MetricDefinitionsTable from "../../../../components/layouts/metric-definitions-table";

interface ComparaisonSectionProps {
  data: any[];
  selectedYear?: string;
  selectedType?: string;
  selectedTypologie?: string;
  selectedRegion?: string;
  selectedMetric?: string;
  onMetricChange?: (metric: string) => void;
}

export function ComparaisonSection({
  data,
  selectedYear,
  selectedType,
  selectedTypologie,
  selectedRegion,
  selectedMetric,
  onMetricChange,
}: ComparaisonSectionProps) {
  return (
    <section
      id="section-comparison"
      role="region"
      className="fr-mb-3w section-container"
    >
      <Text size="sm" className="fr-mb-3w fr-text-mention--grey">
        <span className="ri-information-line fr-mr-1w" aria-hidden="true" />
        Pour les composantes des ressources propres, les valeurs correspondent à
        leur part sur le total des ressources propres de chaque établissement.
      </Text>

      <Row>
        <Col xs="12">
          <ComparisonBarChart
            data={data}
            selectedYear={selectedYear}
            selectedType={selectedType}
            selectedTypologie={selectedTypologie}
            selectedRegion={selectedRegion}
            selectedMetric={selectedMetric}
            onMetricChange={onMetricChange}
          />
        </Col>
      </Row>

      {selectedMetric && (
        <Row>
          <Col xs="12">
            <MetricDefinitionsTable metricKeys={[selectedMetric]} />
          </Col>
        </Row>
      )}
    </section>
  );
}
