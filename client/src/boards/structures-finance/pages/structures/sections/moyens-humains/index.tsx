import { Row, Col, Title } from "@dataesr/dsfr-plus";
import { SECTION_COLORS } from "../../../../constants/colors";
import { useMetricEvolution } from "../api";
import { MetricChartCard } from "../../../../../../components/metric-chart-card/metric-chart-card";
import MetricDefinitionsTable from "../analyses/components/metric-definitions-table";
import "../styles.scss";

const SECTION_COLOR = SECTION_COLORS.moyensHumains;

interface MoyensHumainsSectionProps {
  data: any;
}

export function MoyensHumainsSection({ data }: MoyensHumainsSectionProps) {
  return (
    <div id="section-moyens-humains" className="section-container">
      <div className="section-header fr-mb-5w">
        <Title as="h3" look="h5" className="section-header__title">
          Les enseignants permanents
        </Title>
      </div>

      <div className="fr-mb-5w">
        <Row gutters>
          <Col xs="12" md="6">
            <MetricChartCard
              title="Nombre d'emplois d’enseignants"
              value={
                data.emploi_etpt != null
                  ? data.emploi_etpt.toLocaleString("fr-FR", {
                      maximumFractionDigits: 1,
                    })
                  : "—"
              }
              detail="Équivalent temps plein travaillé (ETPT)"
              color={SECTION_COLOR}
              evolutionData={useMetricEvolution("emploi_etpt")}
            />
          </Col>
          <Col xs="12" md="6">
            <MetricChartCard
              title="Taux d'encadrement"
              value={
                data.taux_encadrement != null
                  ? `${data.taux_encadrement.toFixed(1)} étudiants par emploi d’enseignant`
                  : "—"
              }
              detail={
                data.effectif_sans_cpge
                  ? `Pour ${data.effectif_sans_cpge.toLocaleString(
                      "fr-FR"
                    )} étudiants`
                  : "Enseignants permanents"
              }
              color={SECTION_COLOR}
              evolutionData={useMetricEvolution("taux_encadrement")}
              unit="%"
            />
          </Col>
        </Row>
      </div>

      <div>
        <h3
          className="fr-h5 fr-mb-3w "
          style={{ borderLeftColor: SECTION_COLOR }}
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
              color={SECTION_COLOR}
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
              color={SECTION_COLOR}
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
              color={SECTION_COLOR}
              evolutionData={useMetricEvolution(
                "taux_de_remuneration_des_permanents"
              )}
              unit="%"
            />
          </Col>
        </Row>
      </div>

      <MetricDefinitionsTable
        metricKeys={[
          "emploi_etpt",
          "taux_encadrement",
          "charges_de_personnel",
          "charges_de_personnel_produits_encaissables",
          "taux_de_remuneration_des_permanents",
        ]}
      />
    </div>
  );
}
