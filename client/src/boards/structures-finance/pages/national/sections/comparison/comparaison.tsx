import { Row, Col } from "@dataesr/dsfr-plus";
import ComparisonBarChart from "./chart/comparison-bar";
import MetricDefinitionsTable from "../../../structures/sections/analyses/components/metric-definitions-table";

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
      <p
        className="fr-text--sm fr-mb-3w"
        style={{ color: "var(--text-mention-grey)" }}
      >
        <span className="ri-information-line fr-mr-1w" aria-hidden="true" />
        Pour les composantes des ressources propres, les valeurs correspondent à
        leur part sur le total des ressources propres de chaque établissement.
      </p>

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
