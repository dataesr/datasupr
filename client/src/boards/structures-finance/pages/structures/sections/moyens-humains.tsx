import { Row, Col } from "@dataesr/dsfr-plus";
import { CHART_COLORS } from "../../../constants/colors";
import { useMetricEvolution } from "./api";
import { MetricChartCard } from "../../../../../components/metric-chart-card/metric-chart-card";
import "./styles.scss";

interface MoyensHumainsSectionProps {
  data: any;
}

export function MoyensHumainsSection({ data }: MoyensHumainsSectionProps) {
  return (
    <div
      id="section-moyens-humains"
      role="region"
      aria-labelledby="section-moyens-humains"
      className="section-container"
    >
      <div className="section-header fr-mb-5w">
        <h3 className="fr-h5 section-header__title">
          Les enseignants permanents
        </h3>
        <label
          className="fr-label"
          htmlFor="select-year-moyens-humains"
        ></label>
      </div>

      <div className="fr-mb-5w">
        <Row gutters>
          <Col xs="12" md="6">
            <MetricChartCard
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
              evolutionData={useMetricEvolution("emploi_etpt")}
            />
          </Col>
          <Col xs="12" md="6">
            <MetricChartCard
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
              evolutionData={useMetricEvolution("taux_encadrement")}
              unit="%"
            />
          </Col>
        </Row>
      </div>

      <div>
        <h3
          className="fr-h5 fr-mb-3w "
          style={{ borderLeftColor: CHART_COLORS.secondary }}
        >
          La masse salariale
        </h3>
        <Row gutters>
          <Col xs="12" sm="6" md="4">
            <MetricChartCard
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
              evolutionData={useMetricEvolution("charges_de_personnel")}
              unit="€"
            />
          </Col>
          <Col xs="12" sm="6" md="4">
            <MetricChartCard
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
              evolutionData={useMetricEvolution(
                "charges_de_personnel_produits_encaissables"
              )}
              unit="%"
            />
          </Col>
          <Col xs="12" md="4">
            <MetricChartCard
              title="Rémunération permanents"
              value={
                data.taux_de_remuneration_des_permanents != null
                  ? `${data.taux_de_remuneration_des_permanents.toFixed(1)} %`
                  : "—"
              }
              detail="Part des dépenses de personnel"
              color={CHART_COLORS.palette[4]}
              evolutionData={useMetricEvolution(
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
