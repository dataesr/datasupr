import { Row, Col } from "@dataesr/dsfr-plus";
import { CHART_COLORS } from "../../../constants/colors";
import "./styles.scss";

interface MoyensHumainsTabProps {
  data: any;
}

export function MoyensHumainsTab({ data }: MoyensHumainsTabProps) {
  return (
    <div
      id="tabpanel-moyens-humains"
      role="tabpanel"
      aria-labelledby="tab-moyens-humains"
      className="fr-p-3w tab-container"
    >
      <div className="fr-mb-5w">
        <h3
          className="fr-h5 fr-mb-3w section-title"
          style={{ borderLeftColor: CHART_COLORS.tertiary }}
        >
          Les enseignants permanents
        </h3>
        <Row gutters>
          <Col xs="12" md="6">
            <div
              className="fr-card fr-enlarge-link metric-card"
              style={{ borderTopColor: CHART_COLORS.palette[0] }}
              tabIndex={0}
              role="article"
              aria-label={`Nombre d'emplois: ${
                data.emploi_etpt != null
                  ? data.emploi_etpt.toLocaleString("fr-FR", {
                      maximumFractionDigits: 1,
                    })
                  : "—"
              } ETPT, Équivalent temps plein travaillé`}
            >
              <div className="fr-card__body fr-p-2w">
                <div className="fr-card__content">
                  <p className="fr-text--sm fr-text--bold fr-mb-1v metric-label">
                    Nombre d'emplois (ETPT)
                  </p>
                  <p className="fr-h4 fr-mb-1v metric-value">
                    {data.emploi_etpt != null
                      ? data.emploi_etpt.toLocaleString("fr-FR", {
                          maximumFractionDigits: 1,
                        })
                      : "—"}
                  </p>
                  <p className="fr-text--sm metric-description">
                    Équivalent temps plein travaillé
                  </p>
                </div>
              </div>
            </div>
          </Col>
          <Col xs="12" md="6">
            <div
              className="fr-card fr-enlarge-link metric-card"
              style={{ borderTopColor: CHART_COLORS.palette[1] }}
              tabIndex={0}
              role="article"
              aria-label={`Taux d'encadrement: ${
                data.taux_encadrement != null
                  ? `${data.taux_encadrement.toFixed(1)} %`
                  : "—"
              }, ${
                data.effectif_sans_cpge
                  ? `Pour ${data.effectif_sans_cpge.toLocaleString(
                      "fr-FR"
                    )} étudiants`
                  : "Enseignants permanents"
              }`}
            >
              <div className="fr-card__body fr-p-2w">
                <div className="fr-card__content">
                  <p className="fr-text--sm fr-text--bold fr-mb-1v metric-label">
                    Taux d'encadrement
                  </p>
                  <p className="fr-h4 fr-mb-1v metric-value">
                    {data.taux_encadrement != null
                      ? `${data.taux_encadrement.toFixed(1)} %`
                      : "—"}
                  </p>
                  <p className="fr-text--sm metric-description">
                    {data.effectif_sans_cpge
                      ? `Pour ${data.effectif_sans_cpge.toLocaleString(
                          "fr-FR"
                        )} étudiants`
                      : "Enseignants permanents"}
                  </p>
                </div>
              </div>
            </div>
          </Col>
        </Row>
      </div>

      <div>
        <h3
          className="fr-h5 fr-mb-3w section-title"
          style={{ borderLeftColor: CHART_COLORS.secondary }}
        >
          La masse salariale
        </h3>
        <Row gutters>
          <Col xs="12" sm="6" md="4">
            <div
              className="fr-card fr-enlarge-link metric-card"
              style={{ borderTopColor: CHART_COLORS.palette[2] }}
              tabIndex={0}
              role="article"
              aria-label={`Charges de personnel: ${
                data.charges_de_personnel != null
                  ? `${data.charges_de_personnel.toLocaleString("fr-FR", {
                      maximumFractionDigits: 0,
                    })} €`
                  : "—"
              }, Dépenses de masse salariale`}
            >
              <div className="fr-card__body fr-p-2w">
                <div className="fr-card__content">
                  <p className="fr-text--sm fr-text--bold fr-mb-1v metric-label">
                    Charges de personnel
                  </p>
                  <p className="fr-h4 fr-mb-1v metric-value">
                    {data.charges_de_personnel != null
                      ? `${data.charges_de_personnel.toLocaleString("fr-FR", {
                          maximumFractionDigits: 0,
                        })} €`
                      : "—"}
                  </p>
                  <p className="fr-text--sm metric-description">
                    Dépenses de masse salariale
                  </p>
                </div>
              </div>
            </div>
          </Col>
          <Col xs="12" sm="6" md="4">
            <div
              className="fr-card fr-enlarge-link metric-card"
              style={{ borderTopColor: CHART_COLORS.palette[3] }}
              tabIndex={0}
              role="article"
              aria-label={`Poids sur produits: ${
                data.charges_de_personnel_produits_encaissables != null
                  ? `${data.charges_de_personnel_produits_encaissables.toFixed(
                      1
                    )} %`
                  : "—"
              }, Part des produits encaissables`}
            >
              <div className="fr-card__body fr-p-2w">
                <div className="fr-card__content">
                  <p className="fr-text--sm fr-text--bold fr-mb-1v metric-label">
                    Poids sur produits
                  </p>
                  <p className="fr-h4 fr-mb-1v metric-value">
                    {data.charges_de_personnel_produits_encaissables != null
                      ? `${data.charges_de_personnel_produits_encaissables.toFixed(
                          1
                        )} %`
                      : "—"}
                  </p>
                  <p className="fr-text--sm metric-description">
                    Part des produits encaissables
                  </p>
                </div>
              </div>
            </div>
          </Col>
          <Col xs="12" md="4">
            <div
              className="fr-card fr-enlarge-link metric-card"
              style={{ borderTopColor: CHART_COLORS.palette[4] }}
              tabIndex={0}
              role="article"
              aria-label={`Rémunération permanents: ${
                data.taux_de_remuneration_des_permanents != null
                  ? `${data.taux_de_remuneration_des_permanents.toFixed(1)} %`
                  : "—"
              }, Part des dépenses de personnel`}
            >
              <div className="fr-card__body fr-p-2w">
                <div className="fr-card__content">
                  <p className="fr-text--sm fr-text--bold fr-mb-1v metric-label">
                    Rémunération permanents
                  </p>
                  <p className="fr-h4 fr-mb-1v metric-value">
                    {data.taux_de_remuneration_des_permanents != null
                      ? `${data.taux_de_remuneration_des_permanents.toFixed(
                          1
                        )} %`
                      : "—"}
                  </p>
                  <p className="fr-text--sm metric-description">
                    Part des dépenses de personnel
                  </p>
                </div>
              </div>
            </div>
          </Col>
        </Row>
      </div>
    </div>
  );
}
