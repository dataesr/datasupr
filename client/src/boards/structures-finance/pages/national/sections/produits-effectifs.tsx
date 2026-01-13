import { Row, Col } from "@dataesr/dsfr-plus";
import ScatterChart from "../charts/scatter";

interface ProduitsEffectifsSectionProps {
  data: any[];
  selectedYear?: string | number;
}

export function ProduitsEffectifsSection({
  data,
  selectedYear,
}: ProduitsEffectifsSectionProps) {
  const scatterConfig = {
    title: `Total des ressources hors opérations en capital vs Effectifs d'étudiants${
      selectedYear ? ` — ${selectedYear}` : ""
    }`,
    xMetric: "produits_de_fonctionnement_encaissables",
    yMetric: "effectif_sans_cpge",
    xLabel: "Produits de fonctionnement encaissables (€)",
    yLabel: "Effectif étudiants (sans CPGE)",
  };

  return (
    <section
      id="section-produits-vs-etudiants"
      role="region"
      className="fr-mb-3w section-container"
    >
      <Row>
        <Col xs="12">
          <div className="fr-sr-only">
            Graphique de corrélation entre les produits de fonctionnement
            encaissables et les effectifs étudiants pour {data.length}{" "}
            établissement
            {data.length > 1 ? "s" : ""}
          </div>
          <ScatterChart config={scatterConfig} data={data} />
        </Col>
      </Row>
    </section>
  );
}
