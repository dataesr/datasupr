import { Row, Col } from "@dataesr/dsfr-plus";
import ScatterChart from "../charts/scatter";

interface ScspRessourcesTabProps {
  data: any[];
  selectedYear?: string | number;
}

export function ScspRessourcesTab({
  data,
  selectedYear,
}: ScspRessourcesTabProps) {
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
      id="tabpanel-scsp-vs-ressources-propres"
      role="tabpanel"
      aria-labelledby="tab-scsp-vs-ressources-propres"
      tabIndex={0}
      className="fr-mb-3w"
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
