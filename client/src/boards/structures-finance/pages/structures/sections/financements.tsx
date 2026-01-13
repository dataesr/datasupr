import { Row, Col } from "@dataesr/dsfr-plus";
import { useFinanceEtablissementEvolution } from "../../../api";
import { MetricChartCard } from "../components/metric-cards/metric-chart-card";
import { CHART_COLORS } from "../../../constants/colors";
import "./styles.scss";

const euro = (n?: number) =>
  n != null ? n.toLocaleString("fr-FR", { maximumFractionDigits: 0 }) : "—";

interface FinancementsSectionProps {
  data: any;
  selectedYear?: string | number;
}

export function FinancementsSection({
  data,
  selectedYear,
}: FinancementsSectionProps) {
  const { data: evolutionData } = useFinanceEtablissementEvolution(
    data?.etablissement_id_paysage
  );

  const getEvolutionData = (metricKey: string) => {
    if (!evolutionData || evolutionData.length === 0) return undefined;
    const yearNum = selectedYear ? Number(selectedYear) : null;
    return evolutionData
      .sort((a, b) => a.exercice - b.exercice)
      .filter((item) => !yearNum || item.exercice <= yearNum)
      .map((item) => ({ exercice: item.exercice, value: item[metricKey] }))
      .filter((item) => item.value != null && !isNaN(item.value));
  };

  return (
    <div
      id="section-financements"
      role="region"
      aria-labelledby="section-financements"
      className="fr-p-3w section-container"
    >
      <div className="fr-mb-4w">
        <h3
          className="fr-h5 fr-mb-3w"
          style={{
            borderLeft: `4px solid ${CHART_COLORS.primary}`,
            paddingLeft: "1rem",
          }}
        >
          Les ressources de l'établissement
        </h3>
        <Row gutters>
          <Col xs="12" md="4">
            <MetricChartCard
              title="Total des ressources"
              value={`${euro(data.produits_de_fonctionnement_encaissables)} €`}
              detail="Hors opérations en capital"
              color={CHART_COLORS.primary}
              evolutionData={getEvolutionData(
                "produits_de_fonctionnement_encaissables"
              )}
              unit="€"
            />
          </Col>
          <Col xs="12" md="4">
            <MetricChartCard
              title="Subvention pour charge de service public"
              value={`${euro(data.scsp)} €`}
              detail={
                data.produits_de_fonctionnement_encaissables && data.scsp
                  ? `${(
                      (data.scsp /
                        data.produits_de_fonctionnement_encaissables) *
                      100
                    ).toFixed(1)} % des ressources`
                  : "Part des ressources"
              }
              color={CHART_COLORS.primary}
              evolutionData={getEvolutionData("scsp")}
              unit="€"
            />
          </Col>
          <Col xs="12" md="4">
            <MetricChartCard
              title="Ressources propres"
              value={`${euro(data.recettes_propres)} €`}
              detail={
                data.produits_de_fonctionnement_encaissables &&
                data.recettes_propres
                  ? `${(
                      (data.recettes_propres /
                        data.produits_de_fonctionnement_encaissables) *
                      100
                    ).toFixed(1)} % des ressources`
                  : "Part des ressources"
              }
              color={CHART_COLORS.primary}
              evolutionData={getEvolutionData("recettes_propres")}
              unit="€"
            />
          </Col>
        </Row>
      </div>

      <div className="fr-mb-4w">
        <h3
          className="fr-h5 fr-mb-3w"
          style={{
            borderLeft: `4px solid ${CHART_COLORS.secondary}`,
            paddingLeft: "1rem",
          }}
        >
          Subvention pour charges de service public
        </h3>
        <Row gutters>
          <Col xs="12" md="6">
            <MetricChartCard
              title="SCSP"
              value={`${euro(data.scsp)} €`}
              detail="Subvention pour charges de service public"
              color={CHART_COLORS.secondary}
              evolutionData={getEvolutionData("scsp")}
              unit="€"
            />
          </Col>
          <Col xs="12" md="6">
            <MetricChartCard
              title="SCSP par étudiant"
              value={`${euro(data.scsp_par_etudiants)} €`}
              detail={
                data.scsp_etudiants
                  ? `Pour ${data.scsp_etudiants.toLocaleString(
                      "fr-FR"
                    )} étudiants`
                  : "Ratio SCSP / étudiants"
              }
              color={CHART_COLORS.secondary}
              evolutionData={getEvolutionData("scsp_par_etudiants")}
              unit="€"
            />
          </Col>
        </Row>
      </div>

      <div className="fr-mb-4w">
        <h3
          className="fr-h5 fr-mb-3w"
          style={{
            borderLeft: `4px solid ${CHART_COLORS.tertiary}`,
            paddingLeft: "1rem",
          }}
        >
          Masse salariale
        </h3>
        <Row gutters>
          <Col xs="12" md="4">
            <MetricChartCard
              title="Charges de personnel"
              value={`${euro(data.charges_de_personnel)} €`}
              detail="Masse salariale totale"
              color={CHART_COLORS.tertiary}
              evolutionData={getEvolutionData("charges_de_personnel")}
              unit="€"
            />
          </Col>
          <Col xs="12" md="4">
            <MetricChartCard
              title="Charges / Produits encaissables"
              value={
                data.charges_de_personnel_produits_encaissables != null
                  ? `${data.charges_de_personnel_produits_encaissables.toFixed(
                      1
                    )} %`
                  : "—"
              }
              detail="Part des charges de personnel dans les produits"
              color={CHART_COLORS.tertiary}
              evolutionData={getEvolutionData(
                "charges_de_personnel_produits_encaissables"
              )}
              unit="%"
            />
          </Col>
          <Col xs="12" md="4">
            <MetricChartCard
              title="Taux rémunération permanents"
              value={
                data.taux_de_remuneration_des_permanents != null
                  ? `${data.taux_de_remuneration_des_permanents.toFixed(1)} %`
                  : "—"
              }
              detail="Ratio rémunération des permanents"
              color={CHART_COLORS.tertiary}
              evolutionData={getEvolutionData(
                "taux_de_remuneration_des_permanents"
              )}
              unit="%"
            />
          </Col>
        </Row>
      </div>
    </div>
  );
}
