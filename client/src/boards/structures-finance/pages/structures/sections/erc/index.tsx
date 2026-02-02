import { Row, Col, Title } from "@dataesr/dsfr-plus";
import { SECTION_COLORS } from "../../../../constants/colors";
import { MetricChartCard } from "../../../../../../components/metric-chart-card/metric-chart-card";
import { useMetricEvolution } from "../api";
import "../styles.scss";
import MetricDefinitionsTable from "../../../../components/layouts/metric-definitions-table";

const SECTION_COLOR = SECTION_COLORS.erc;

interface ErcSectionProps {
  data: any;
}

export function ErcSection({ data }: ErcSectionProps) {
  const exercice = data.exercice;

  return (
    <section
      id="section-erc"
      aria-labelledby="section-erc-title"
      className="section-container"
    >
      <div className="section-header fr-mb-5w">
        <Title
          as="h2"
          look="h5"
          id="section-erc-title"
          className="section-header__title"
        >
          Subvention des projets de recherche exploratoire d'excellence (ERC)
        </Title>
      </div>

      <div className="fr-mb-5w">
        <Row gutters>
          <Col xs="12" md="6">
            <MetricChartCard
              title="Nombre de projets lauréats"
              value={
                data.erc_nb != null
                  ? `${data.erc_nb.toLocaleString("fr-FR")} projet(s)`
                  : "—"
              }
              detail={`Pour les calls de l'année ${exercice}`}
              color={SECTION_COLOR}
              evolutionData={useMetricEvolution("erc_nb")}
              unit="projets"
            />
          </Col>
          <Col xs="12" md="6">
            <MetricChartCard
              title="Subvention obtenue"
              value={
                data.erc_sub != null
                  ? `${data.erc_sub.toLocaleString("fr-FR")} €`
                  : "—"
              }
              detail={`Pour les calls de l'année ${exercice}`}
              color={SECTION_COLOR}
              evolutionData={useMetricEvolution("erc_sub")}
              unit="€"
            />
          </Col>
        </Row>
      </div>

      <div>
        <Title as="h3" look="h5" className="fr-mb-3w">
          Types de projets
        </Title>
        <Row gutters>
          {data.erc_nb_stg != null && data.erc_nb_stg > 0 && (
            <Col xs="12" sm="6" md="4">
              <MetricChartCard
                title="Dont pour les jeunes chercheurs prometteurs"
                value={`${data.erc_nb_stg.toLocaleString("fr-FR")} projet(s)`}
                detail="Starting Grants"
                color={SECTION_COLOR}
              />
            </Col>
          )}
          {data.erc_nb_cog != null && data.erc_nb_cog > 0 && (
            <Col xs="12" sm="6" md="4">
              <MetricChartCard
                title="Dont pour les chercheurs confirmés souhaitant consolider leur équipe"
                value={`${data.erc_nb_cog.toLocaleString("fr-FR")} projet(s)`}
                detail="Consolidator Grants"
                color={SECTION_COLOR}
              />
            </Col>
          )}
          {data.erc_nb_adg != null && data.erc_nb_adg > 0 && (
            <Col xs="12" sm="6" md="4">
              <MetricChartCard
                title="Dont pour les chercheurs expérimentés"
                value={`${data.erc_nb_adg.toLocaleString("fr-FR")} projet(s)`}
                detail="Advanced Grants"
                color={SECTION_COLOR}
              />
            </Col>
          )}
          {data.erc_nb_syg != null && data.erc_nb_syg > 0 && (
            <Col xs="12" sm="6" md="4">
              <MetricChartCard
                title="Dont pour des projets collaboratifs ambitieux"
                value={`${data.erc_nb_syg.toLocaleString("fr-FR")} projet(s)`}
                detail="Synergy Grants"
                color={SECTION_COLOR}
              />
            </Col>
          )}
          {data.erc_nb_poc != null && data.erc_nb_poc > 0 && (
            <Col xs="12" sm="6" md="4">
              <MetricChartCard
                title="Dont pour aider à transformer des résultats de recherche en innovations"
                value={`${data.erc_nb_poc.toLocaleString("fr-FR")} projet(s)`}
                detail="Proof of Concept"
                color={SECTION_COLOR}
              />
            </Col>
          )}
        </Row>
        <Row>
          <Col>
            <MetricDefinitionsTable
              metricKeys={[
                "erc_nb",
                "erc_sub",
                "erc_nb_stg",
                "erc_nb_cog",
                "erc_nb_adg",
                "erc_nb_syg",
                "erc_nb_poc",
              ]}
            />
          </Col>
        </Row>
      </div>
    </section>
  );
}
