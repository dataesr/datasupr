import { Row, Col } from "@dataesr/dsfr-plus";
import EffectifsChart from "./charts/effectifs";
import EffectifsEvolutionChart from "./charts/effectifs-evolution";
import { MetricChartCard } from "../../../../../../components/metric-chart-card/metric-chart-card";
import { SECTION_COLORS } from "../../../../constants/colors";
import { useMetricEvolution } from "../api";
import "../styles.scss";

const SECTION_COLOR = SECTION_COLORS.diplomesFormations;

interface EtudiantsSectionProps {
  data: any;
  selectedYear?: string | number;
}

const num = (n?: number) =>
  n != null ? n.toLocaleString("fr-FR", { maximumFractionDigits: 0 }) : "—";

export function EtudiantsSection({
  data,
  selectedYear,
}: EtudiantsSectionProps) {
  const effectifEvolution = useMetricEvolution("effectif_sans_cpge");
  const effectifDnEvolution = useMetricEvolution("effectif_sans_cpge_dn");
  const effectifDuEvolution = useMetricEvolution("effectif_sans_cpge_du");

  return (
    <div
      id="section-etudiants"
      role="region"
      aria-labelledby="section-etudiants"
      className="section-container"
    >
      <div className="section-header fr-mb-4w">
        <h3 className="fr-h5 section-header__title">
          Les étudiants inscrits en {`${data.anuniv}`}
        </h3>
      </div>

      <div className="fr-mb-4w">
        <Row gutters>
          <Col xs="12" md="4">
            <MetricChartCard
              title="Total des étudiants"
              value={`${num(data.effectif_sans_cpge)} étudiants inscrits`}
              detail="Hors doubles inscriptions CPGE"
              color={SECTION_COLOR}
              evolutionData={effectifEvolution}
            />
          </Col>
          <Col xs="12" md="4">
            <MetricChartCard
              title="Dont dans les diplômes nationaux"
              value={num(data.effectif_sans_cpge_dn)}
              detail={`${data.effectif_sans_cpge ? ((data.effectif_sans_cpge_dn / data.effectif_sans_cpge) * 100).toFixed(1) : 0}% du total des étudiants inscrits`}
              color={SECTION_COLOR}
              evolutionData={effectifDnEvolution}
            />
          </Col>
          <Col xs="12" md="4">
            <MetricChartCard
              title="Dont dans les diplômes d'établissement"
              value={num(data.effectif_sans_cpge_du)}
              detail={`${data.effectif_sans_cpge ? ((data.effectif_sans_cpge_du / data.effectif_sans_cpge) * 100).toFixed(1) : 0}% du total des étudiants inscrits`}
              color={SECTION_COLOR}
              evolutionData={effectifDuEvolution}
            />
          </Col>
        </Row>
      </div>

      <div className="fr-mb-4w">
        <EffectifsChart data={data} selectedYear={selectedYear} />
      </div>

      <div className="fr-mb-4w">
        <EffectifsEvolutionChart
          etablissementId={data?.etablissement_id_paysage_actuel}
          etablissementName={data?.etablissement_lib}
        />
      </div>
    </div>
  );
}
