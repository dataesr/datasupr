import { Row, Col } from "@dataesr/dsfr-plus";
import { CHART_COLORS } from "../../../constants/colors";
import { useFinanceEtablissementEvolution } from "../../../api";
import { MetricCard } from "../components/metric-cards/metric-card";
import "./styles.scss";

interface MoyensHumainsTabProps {
  data: any;
  selectedYear?: string | number;
}

export function MoyensHumainsTab({
  data,
  selectedYear,
}: MoyensHumainsTabProps) {
  const { data: evolutionData } = useFinanceEtablissementEvolution(
    data?.etablissement_id_paysage
  );

  const getEvolutionData = (metricKey: string) => {
    if (!evolutionData || evolutionData.length === 0) return undefined;
    const yearNum = selectedYear ? Number(selectedYear) : null;
    return evolutionData
      .sort((a, b) => a.exercice - b.exercice)
      .filter((item) => !yearNum || item.exercice <= yearNum)
      .map((item) => item[metricKey])
      .filter((val): val is number => val != null && !isNaN(val));
  };
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
            <MetricCard
              title="Nombre d'emplois (ETPT)"
              value={
                data.emploi_etpt != null
                  ? data.emploi_etpt.toLocaleString("fr-FR", {
                      maximumFractionDigits: 1,
                    })
                  : "—"
              }
              detail="Équivalent temps plein travaillé"
              color={CHART_COLORS.palette[0]}
              sparklineData={getEvolutionData("emploi_etpt")}
            />
          </Col>
          <Col xs="12" md="6">
            <MetricCard
              title="Taux d'encadrement"
              value={
                data.taux_encadrement != null
                  ? `${data.taux_encadrement.toFixed(1)} %`
                  : "—"
              }
              detail={
                data.effectif_sans_cpge
                  ? `Pour ${data.effectif_sans_cpge.toLocaleString(
                      "fr-FR"
                    )} étudiants`
                  : "Enseignants permanents"
              }
              color={CHART_COLORS.palette[1]}
              sparklineData={getEvolutionData("taux_encadrement")}
            />
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
            <MetricCard
              title="Charges de personnel"
              value={
                data.charges_de_personnel != null
                  ? `${data.charges_de_personnel.toLocaleString("fr-FR", {
                      maximumFractionDigits: 0,
                    })} €`
                  : "—"
              }
              detail="Dépenses de masse salariale"
              color={CHART_COLORS.palette[2]}
              sparklineData={getEvolutionData("charges_de_personnel")}
            />
          </Col>
          <Col xs="12" sm="6" md="4">
            <MetricCard
              title="Poids sur produits"
              value={
                data.charges_de_personnel_produits_encaissables != null
                  ? `${data.charges_de_personnel_produits_encaissables.toFixed(
                      1
                    )} %`
                  : "—"
              }
              detail="Part des produits encaissables"
              color={CHART_COLORS.palette[3]}
              sparklineData={getEvolutionData(
                "charges_de_personnel_produits_encaissables"
              )}
            />
          </Col>
          <Col xs="12" md="4">
            <MetricCard
              title="Rémunération permanents"
              value={
                data.taux_de_remuneration_des_permanents != null
                  ? `${data.taux_de_remuneration_des_permanents.toFixed(1)} %`
                  : "—"
              }
              detail="Part des dépenses de personnel"
              color={CHART_COLORS.palette[4]}
              sparklineData={getEvolutionData(
                "taux_de_remuneration_des_permanents"
              )}
            />
          </Col>
        </Row>
      </div>
    </div>
  );
}
