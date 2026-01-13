import { Row, Col } from "@dataesr/dsfr-plus";
import ScatterChart from "../charts/scatter";

interface ScspEncadrementSectionProps {
  data: any[];
  selectedYear?: string | number;
}

export function ScspEncadrementSection({
  data,
  selectedYear,
}: ScspEncadrementSectionProps) {
  const scatterConfig = {
    title: `SCSP par étudiant vs Taux d'encadrement${
      selectedYear ? ` — ${selectedYear}` : ""
    }`,
    xMetric: "scsp_par_etudiants",
    yMetric: "taux_encadrement",
    xLabel: "SCSP par étudiant (€)",
    yLabel: "Taux d'encadrement (%)",
  };

  return (
    <section
      id="section-scsp-vs-encadrement"
      role="region"
      className="fr-mb-3w section-container"
    >
      <Row>
        <Col xs="12">
          <div className="fr-sr-only">
            Graphique de corrélation entre le SCSP par étudiant et le taux
            d'encadrement pour {data.length} établissement
            {data.length > 1 ? "s" : ""}
          </div>
          <ScatterChart config={scatterConfig} data={data} />
        </Col>
      </Row>
    </section>
  );
}
