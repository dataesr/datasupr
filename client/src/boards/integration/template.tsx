import { Container, Row, Col, Title, Badge } from "@dataesr/dsfr-plus";
import { chartsRegistry } from "./charts-registry";

export default function Template() {
  const availableCharts = Object.keys(chartsRegistry);

  return (
    <Container className="fr-mt-5w">
      <Row>
        <Col>
          <Title as="h1">Intégration de graphiques</Title>
          <p className="fr-text--lead">Partagez et intégrez facilement des graphiques dans vos applications et sites web.</p>
        </Col>
      </Row>

      <Row className="fr-mt-4w">
        <Col>
          <Title as="h2" look="h4">
            Graphiques disponibles
          </Title>
          <p>
            <Badge color="blue-ecume">
              {availableCharts.length} graphique{availableCharts.length > 1 ? "s" : ""} disponible{availableCharts.length > 1 ? "s" : ""}
            </Badge>
          </p>
        </Col>
      </Row>

      <Row className="fr-mt-3w" gutters>
        {availableCharts.map((chartId) => {
          const baseUrl = `${window.location.origin}/integration?chart_id=${chartId}`;

          // Exemples avec paramètres pour certains graphiques
          const examples =
            chartId === "ep-countries-collaborations-bubble"
              ? [
                  {
                    label: "Par défaut",
                    url: baseUrl,
                  },
                  {
                    label: "Avec filtres",
                    url: `${baseUrl}&pillarId=HORIZON.4&country_code=FRA&language=fr`,
                  },
                ]
              : [{ label: "Par défaut", url: baseUrl }];

          return (
            <Col md={6} key={chartId}>
              <div className="fr-card fr-mb-3w">
                <div className="fr-card__body">
                  <div className="fr-card__content">
                    <Title as="h3" look="h6">
                      {chartId}
                    </Title>

                    {examples.map((example, idx) => (
                      <div key={idx} className={idx > 0 ? "fr-mt-3w" : "fr-mt-2w"}>
                        <p className="fr-text--sm fr-mb-1w">
                          <strong>{example.label} :</strong>
                        </p>
                        <code
                          className="fr-text--xs"
                          style={{
                            display: "block",
                            padding: "0.5rem",
                            background: "#f6f6f6",
                            borderRadius: "4px",
                            overflow: "auto",
                            wordBreak: "break-all",
                          }}
                        >
                          {example.url}
                        </code>
                        {idx === 0 && (
                          <div className="fr-mt-1w">
                            <a href={example.url} target="_blank" rel="noopener noreferrer" className="fr-btn fr-btn--sm">
                              Prévisualiser
                            </a>
                          </div>
                        )}
                      </div>
                    ))}

                    <div className="fr-mt-2w">
                      <p className="fr-text--sm fr-mb-1w">
                        <strong>Code iframe :</strong>
                      </p>
                      <code
                        className="fr-text--xs"
                        style={{
                          display: "block",
                          padding: "0.5rem",
                          background: "#f6f6f6",
                          borderRadius: "4px",
                          overflow: "auto",
                          wordBreak: "break-all",
                        }}
                      >
                        {`<iframe src="${baseUrl}&language=fr" width="100%" height="600" frameborder="0"></iframe>`}
                      </code>
                    </div>
                  </div>
                </div>
              </div>
            </Col>
          );
        })}
      </Row>

      {availableCharts.length === 0 && (
        <Row className="fr-mt-3w">
          <Col>
            <div className="fr-callout">
              <p className="fr-callout__text">
                Aucun graphique n'est actuellement disponible pour l'intégration. Ajoutez des graphiques dans le fichier{" "}
                <code>charts-registry.tsx</code>.
              </p>
            </div>
          </Col>
        </Row>
      )}

      <Row className="fr-mt-5w">
        <Col>
          <Title as="h2" look="h5">
            Comment utiliser l'intégration
          </Title>
          <ol>
            <li>Copiez l'URL d'intégration ou le code iframe du graphique souhaité</li>
            <li>Intégrez-le dans votre site web ou application</li>
            <li>
              Personnalisez l'apparence avec le paramètre <code>theme=light</code> ou <code>theme=dark</code>
            </li>
          </ol>

          <div className="fr-callout fr-callout--blue-ecume fr-mt-3w">
            <h3 className="fr-callout__title">Paramètres disponibles</h3>
            <p className="fr-callout__text">
              <strong>chart_id</strong> (requis) : Identifiant du graphique à afficher
              <br />
              <strong>theme</strong> (optionnel) : <code>light</code> ou <code>dark</code> (défaut: light)
              <br />
              <strong>language</strong> (optionnel) : <code>fr</code> ou <code>en</code>
            </p>
          </div>

          <div className="fr-callout fr-mt-3w">
            <h3 className="fr-callout__title">Paramètres spécifiques aux graphiques</h3>
            <p className="fr-callout__text">
              <strong>Pour ep-countries-collaborations-bubble :</strong>
              <br />• <code>country_code</code> : Code du pays (ex: FRA, DEU, ITA)
              <br />• <code>pillarId</code> : ID du pilier Horizon (ex: HORIZON.4)
              <br />• <code>programId</code> : ID du programme
              <br />• <code>thematicIds</code> : IDs des thématiques
              <br />• <code>destinationIds</code> : IDs des destinations
              <br />
              <br />
              <strong>Exemple complet :</strong>
              <br />
              <code
                style={{ display: "block", marginTop: "0.5rem", padding: "0.5rem", background: "#f6f6f6", borderRadius: "4px", fontSize: "0.75rem" }}
              >
                /integration?chart_id=ep-countries-collaborations-bubble&amp;pillarId=HORIZON.4&amp;country_code=FRA&amp;language=fr
              </code>
            </p>
          </div>

          <div className="fr-notice fr-notice--info fr-mt-3w">
            <div className="fr-container">
              <div className="fr-notice__body">
                <p className="fr-notice__title">
                  ⚠️ Important : Les paramètres doivent être séparés par <code>&amp;</code> et non par <code>?</code>
                </p>
              </div>
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  );
}
