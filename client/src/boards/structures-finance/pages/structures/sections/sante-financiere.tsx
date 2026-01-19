import { Row, Col } from "@dataesr/dsfr-plus";
import { useMetricEvolution } from "./api";
import { MetricChartCard } from "../../../../../components/metric-chart-card/metric-chart-card";
import { CHART_COLORS } from "../../../constants/colors";
import "./styles.scss";

const euro = (n?: number) =>
  n != null ? n.toLocaleString("fr-FR", { maximumFractionDigits: 0 }) : "—";

interface SanteFinancierSectionProps {
  data: any;
}

export function SanteFinancierSection({ data }: SanteFinancierSectionProps) {
  const showResultatHorsSie =
    data?.resultat_net_comptable != null &&
    data?.resultat_net_comptable_hors_sie != null &&
    data.resultat_net_comptable !== data.resultat_net_comptable_hors_sie;

  return (
    <div
      id="section-sante-financier"
      role="region"
      aria-labelledby="section-sante-financier"
      className="section-container"
    >
      <div className="section-header fr-mb-4w">
        <h3 className="fr-h5 section-header__title">
          Equilibre financier
          <label
            className="fr-label"
            htmlFor="select-year-sante-financier"
          ></label>
        </h3>
      </div>

      <div className="fr-mb-4w">
        <Row gutters>
          <Col xs="12" md={showResultatHorsSie ? "6" : "4"}>
            <MetricChartCard
              title="Résultat net comptable"
              value={`${euro(data.resultat_net_comptable)} €`}
              detail="Le résultat net comptable mesure les ressources nettes restant à l'établissement à l'issue de l'exercice. Indique la performance financière globale de l'établissement."
              color={CHART_COLORS.primary}
              evolutionData={useMetricEvolution("resultat_net_comptable")}
              unit="€"
            />
          </Col>

          {showResultatHorsSie && (
            <Col xs="12" md="6">
              <MetricChartCard
                title="Résultat net comptable hors SIE"
                value={`${euro(data.resultat_net_comptable_hors_sie)} €`}
                detail="Le résultat net comptable hors services inter-établissements mesure les ressources nettes restant à l'établissement à l'issue de l'exercice sans prendre en compte les services communs à plusieurs établissements (service de documentation par exemple). Indique la performance financière globale de l'établissement."
                color={CHART_COLORS.primary}
                evolutionData={useMetricEvolution(
                  "resultat_net_comptable_hors_sie"
                )}
                unit="€"
              />
            </Col>
          )}

          <Col xs="12" md={showResultatHorsSie ? "6" : "4"}>
            <MetricChartCard
              title="Capacité d'autofinancement"
              value={`${euro(data.capacite_d_autofinancement)} €`}
              detail="Épargne dégagée pendant l'exercice qui permettra d'assurer tout ou partie de l'investissement de l'année et d'augmenter le fonds de roulement."
              color={CHART_COLORS.primary}
              evolutionData={useMetricEvolution("capacite_d_autofinancement")}
              unit="€"
            />
          </Col>

          <Col xs="12" md={showResultatHorsSie ? "6" : "4"}>
            <MetricChartCard
              title="CAF / Produits encaissables"
              value={
                data.caf_produits_encaissables != null
                  ? `${data.caf_produits_encaissables.toFixed(1)} %`
                  : "—"
              }
              color={CHART_COLORS.primary}
              evolutionData={useMetricEvolution("caf_produits_encaissables")}
              unit="%"
            />
          </Col>
        </Row>
      </div>

      <div className="fr-mb-4w">
        <h3 className="fr-h5 fr-mb-3w">Cycle d'exploitation</h3>
        <Row gutters>
          <Col xs="12" sm="6" md="4">
            <MetricChartCard
              title="Fonds de roulement net global"
              value={`${euro(data.fonds_de_roulement_net_global)} €`}
              detail="Ressource durable ou structurelle mise à disposition de l'établissement pour financer des emplois (investissements) liés au cycle d'exploitation. Il constitue une marge de sécurité financière destinée à financer une partie de l'actif circulant."
              color={CHART_COLORS.secondary}
              evolutionData={useMetricEvolution(
                "fonds_de_roulement_net_global"
              )}
              unit="€"
            />
          </Col>

          <Col xs="12" sm="6" md="4">
            <MetricChartCard
              title="Besoin en fonds de roulement"
              value={`${euro(data.besoin_en_fonds_de_roulement)} €`}
              detail="Le besoin en fonds de roulement mesure le décalage entre les encaissements et les décaissements du cycle d'activité."
              color={CHART_COLORS.secondary}
              evolutionData={useMetricEvolution("besoin_en_fonds_de_roulement")}
              unit="€"
            />
          </Col>

          <Col xs="12" sm="6" md="4">
            <MetricChartCard
              title="Trésorerie"
              value={`${euro(data.tresorerie)} €`}
              detail="Liquidités immédiatement disponibles (caisse, banque, VMP)."
              color={CHART_COLORS.secondary}
              evolutionData={useMetricEvolution("tresorerie")}
              unit="€"
            />
          </Col>

          <Col xs="12" sm="6" md="4">
            <MetricChartCard
              title="Fonds de roulement en jours de fonctionnement"
              value={
                data.fonds_de_roulement_en_jours_de_fonctionnement != null
                  ? `${euro(
                      data.fonds_de_roulement_en_jours_de_fonctionnement
                    )} jour${
                      Math.abs(
                        data.fonds_de_roulement_en_jours_de_fonctionnement
                      ) > 1
                        ? "s"
                        : ""
                    }`
                  : "—"
              }
              detail="Expression du fonds de roulement en nombre de jours de fonctionnement. Un fonds de roulement net global de 30 jours signifie que l'établissement peut couvrir 30 jours de dépenses courantes."
              color={CHART_COLORS.secondary}
              evolutionData={useMetricEvolution(
                "fonds_de_roulement_en_jours_de_fonctionnement"
              )}
              unit="jours"
            />
          </Col>

          <Col xs="12" sm="6" md="4">
            <MetricChartCard
              title="Trésorerie en jours de fonctionnement"
              value={
                data.tresorerie_en_jours_de_fonctionnement != null
                  ? `${euro(data.tresorerie_en_jours_de_fonctionnement)} jour${
                      Math.abs(data.tresorerie_en_jours_de_fonctionnement) > 1
                        ? "s"
                        : ""
                    }`
                  : "—"
              }
              detail="Expression de la trésorerie en nombre de jours de fonctionnement. Indique la durée pendant laquelle l'établissement peut fonctionner sans nouvel encaissement."
              color={CHART_COLORS.secondary}
              evolutionData={useMetricEvolution(
                "tresorerie_en_jours_de_fonctionnement"
              )}
              unit="jours"
            />
          </Col>
        </Row>
      </div>

      <div className="fr-mb-4w">
        <h3 className="fr-h5 fr-mb-3w">Financement de l'activité</h3>
        <Row gutters>
          <Col xs="12" sm="6" md="3">
            <MetricChartCard
              title="Charges décaissables / Produits encaissables"
              value={
                data.charges_decaissables_produits_encaissables != null
                  ? `${data.charges_decaissables_produits_encaissables.toFixed(
                      1
                    )} %`
                  : "—"
              }
              detail="Ratio mesurant l'équilibre entre les dépenses réelles (décaissables) et les recettes réelles (encaissables)."
              color={CHART_COLORS.tertiary}
              evolutionData={useMetricEvolution(
                "charges_decaissables_produits_encaissables"
              )}
              unit="%"
            />
          </Col>

          <Col xs="12" sm="6" md="3">
            <MetricChartCard
              title="Taux de rémunération des permanents"
              value={
                data.taux_de_remuneration_des_permanents != null
                  ? `${data.taux_de_remuneration_des_permanents.toFixed(1)} %`
                  : "—"
              }
              detail="Indique la part des recettes consacrée à la rémunération du personnel titulaire."
              color={CHART_COLORS.tertiary}
              evolutionData={useMetricEvolution(
                "taux_de_remuneration_des_permanents"
              )}
              unit="%"
            />
          </Col>

          <Col xs="12" sm="6" md="3">
            <MetricChartCard
              title="Ressources propres / Produits encaissables"
              value={
                data.ressources_propres_produits_encaissables != null
                  ? `${data.ressources_propres_produits_encaissables.toFixed(
                      1
                    )} %`
                  : "—"
              }
              detail="Part des ressources propres (hors subventions pour charges de service public) dans les produits totaux. Mesure l'autonomie financière."
              color={CHART_COLORS.tertiary}
              evolutionData={useMetricEvolution(
                "ressources_propres_produits_encaissables"
              )}
              unit="%"
            />
          </Col>

          <Col xs="12" sm="6" md="3">
            <MetricChartCard
              title="Charges de personnel / Produits encaissables"
              value={
                data.charges_de_personnel_produits_encaissables != null
                  ? `${data.charges_de_personnel_produits_encaissables.toFixed(
                      1
                    )} %`
                  : "—"
              }
              detail="Ratio entre la masse salariale et les produits. Évalue le poids des coûts salariaux."
              color={CHART_COLORS.tertiary}
              evolutionData={useMetricEvolution(
                "charges_de_personnel_produits_encaissables"
              )}
              unit="%"
            />
          </Col>
        </Row>
      </div>

      <div className="fr-mb-4w">
        <Row gutters>
          <Col xs="12" md="6">
            <MetricChartCard
              title="CAF / Acquisitions d'immobilisations"
              value={
                data.caf_acquisitions_d_immobilisations != null
                  ? `${data.caf_acquisitions_d_immobilisations.toFixed(1)} %`
                  : "—"
              }
              detail="Ratio entre la CAF et les investissements en immobilisations. Indique si l'activité génère suffisamment de ressources pour financer les investissements."
              color={CHART_COLORS.primary}
              evolutionData={useMetricEvolution(
                "caf_acquisitions_d_immobilisations"
              )}
              unit="%"
            />
          </Col>

          <Col xs="12" md="6">
            <MetricChartCard
              title="Solde budgétaire"
              value={`${euro(data.solde_budgetaire)} €`}
              detail="Le solde budgétaire est un solde intermédiaire de trésorerie, reflétant le flux de trésorerie généré par l'activité de l'organisme au cours d'un exercice."
              color={CHART_COLORS.secondary}
              evolutionData={useMetricEvolution("solde_budgetaire")}
              unit="€"
            />
          </Col>
        </Row>
      </div>
    </div>
  );
}
