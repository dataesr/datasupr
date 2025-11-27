import { Suspense } from "react";
import { useSearchParams } from "react-router-dom";
import { Container, Row, Col } from "@dataesr/dsfr-plus";

import Template from "./template";
import { getChart, isValidChartId } from "./charts-registry";

export default function Integration() {
  const [searchParams] = useSearchParams();
  const chartId = searchParams.get("chart_id") || null;
  const theme = searchParams.get("theme") || "light";
  document.documentElement.setAttribute("data-fr-theme", theme);

  if (!chartId) return <Template />;

  // Vérification de la validité du chart_id
  if (!isValidChartId(chartId)) {
    return (
      <Container className="fr-mt-5w">
        <Row>
          <Col>
            <div className="fr-alert fr-alert--error">
              <h3 className="fr-alert__title">Graphique non trouvé</h3>
              <p>Le graphique avec l'ID "{chartId}" n'existe pas ou n'est pas disponible pour l'intégration.</p>
            </div>
            <p className="fr-mt-2w">
              <a href="/integration">Retour à la liste des graphiques disponibles</a>
            </p>
          </Col>
        </Row>
      </Container>
    );
  }

  const LazyComponent = getChart(chartId);

  // Extraction de tous les paramètres URL (sauf chart_id et theme) pour les passer au composant
  const componentProps: Record<string, string> = {};
  searchParams.forEach((value, key) => {
    if (key !== "chart_id" && key !== "theme") {
      componentProps[key] = value;
    }
  });

  return (
    <Container className="fr-mt-5w">
      <Row>
        <Col>
          <Suspense
            fallback={
              <div className="fr-callout">
                <p className="fr-callout__text">Chargement du graphique...</p>
              </div>
            }
          >
            <LazyComponent {...componentProps} />
          </Suspense>
        </Col>
      </Row>
    </Container>
  );
}
