import { Row, Col } from "@dataesr/dsfr-plus";
import ComparisonBarChart from "../charts/comparison-bar";

interface ComparaisonTabProps {
  data: any[];
}

export function ComparaisonTab({ data }: ComparaisonTabProps) {
  return (
    <section
      id="tabpanel-comparison"
      role="tabpanel"
      aria-labelledby="tab-comparison"
      tabIndex={0}
      className="fr-mb-3w"
    >
      <div className="fr-callout fr-mb-3w">
        <p className="fr-callout__text">
          Ce graphique permet de comparer différentes métriques entre les
          établissements sélectionnés. Pour les composantes des ressources
          propres (droits d'inscription, formation continue, ANR, contrats de
          recherche, etc.), les valeurs affichées correspondent à leur{" "}
          <strong>part sur le total des ressources propres</strong> de chaque
          établissement.
        </p>
      </div>

      <Row>
        <Col xs="12">
          <ComparisonBarChart data={data} />
        </Col>
      </Row>
    </section>
  );
}
