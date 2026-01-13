import { Row, Col } from "@dataesr/dsfr-plus";
import ScatterChart from "../charts/scatter";

interface ScspRessourcesSectionProps {
  data: any[];
  selectedYear?: string | number;
}

export function ScspRessourcesSection({
  data,
  selectedYear,
}: ScspRessourcesSectionProps) {
  const scatterConfig = {
    title: `SCSP vs Ressources propres${
      selectedYear ? ` — ${selectedYear}` : ""
    }`,
    xMetric: "scsp",
    yMetric: "ressources_propres",
    xLabel: "SCSP (€)",
    yLabel: "Ressources propres (€)",
  };

  return (
    <section
      id="section-scsp-vs-ressources-propres"
      role="region"
      className="fr-mb-3w section-container"
    >
      <Row>
        <Col xs="12">
          <div className="fr-sr-only">
            Graphique de corrélation entre le SCSP et les ressources propres
            pour {data.length} établissement
            {data.length > 1 ? "s" : ""}
          </div>
          <ScatterChart config={scatterConfig} data={data} />
        </Col>
      </Row>
    </section>
  );
}
