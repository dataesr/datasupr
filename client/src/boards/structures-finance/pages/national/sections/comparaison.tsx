import { Row, Col } from "@dataesr/dsfr-plus";
import ComparisonBarChart from "../charts/comparison-bar";

interface ComparaisonSectionProps {
  data: any[];
  selectedYear?: string;
  selectedType?: string;
  selectedTypologie?: string;
  selectedRegion?: string;
}

export function ComparaisonSection({
  data,
  selectedYear,
  selectedType,
  selectedTypologie,
  selectedRegion,
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
          />
        </Col>
      </Row>
    </section>
  );
}
