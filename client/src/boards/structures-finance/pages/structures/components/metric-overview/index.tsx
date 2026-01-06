import { Row, Col } from "@dataesr/dsfr-plus";
import { CHART_COLORS, DSFR_COLORS } from "../../../../constants/colors";
import RessourcesPropresChart from "../../charts/ressources-propres";

const euro = (n?: number) =>
  n != null ? n.toLocaleString("fr-FR", { maximumFractionDigits: 0 }) : "—";
const pct = (n?: number) => (n != null ? `${n.toFixed(2)} %` : "—");

interface MetricCardProps {
  title: string;
  value: string;
  detail?: string;
  color?: string;
}

function MetricCard({
  title,
  value,
  detail,
  color = CHART_COLORS.primary,
}: MetricCardProps) {
  return (
    <div
      className="fr-card fr-enlarge-link"
      style={{
        height: "100%",
        borderTop: `4px solid ${color}`,
        borderLeft: "none",
        borderRight: "none",
        borderBottom: "none",
        backgroundColor: DSFR_COLORS.backgroundAlt,
      }}
    >
      <div className="fr-card__body fr-p-2w">
        <div className="fr-card__content">
          <p
            className="fr-text--sm fr-text--bold fr-mb-1v"
            style={{
              color: DSFR_COLORS.textDefault,
              textTransform: "uppercase",
              letterSpacing: "0.5px",
            }}
          >
            {title}
          </p>
          <p
            className="fr-h5 fr-mb-1v"
            style={{ fontWeight: 700, color: "#000" }}
          >
            {value}
          </p>
          {detail && (
            <p
              className="fr-text--sm"
              style={{ color: DSFR_COLORS.textDefault, margin: 0 }}
            >
              {detail}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

interface MetricOverviewProps {
  data: any;
}

export default function MetricOverview({ data }: MetricOverviewProps) {
  if (!data) return null;

  const niveauxDisponibles: Array<{ niveau: string; key: string }> = [];
  if (data.effectif_sans_cpge_l && data.effectif_sans_cpge_l > 0) {
    niveauxDisponibles.push({ niveau: "Licence", key: "l" });
  }
  if (data.effectif_sans_cpge_m && data.effectif_sans_cpge_m > 0) {
    niveauxDisponibles.push({ niveau: "Master", key: "m" });
  }
  if (data.effectif_sans_cpge_d && data.effectif_sans_cpge_d > 0) {
    niveauxDisponibles.push({ niveau: "Doctorat", key: "d" });
  }
  if (data.effectif_sans_cpge_iut && data.effectif_sans_cpge_iut > 0) {
    niveauxDisponibles.push({ niveau: "IUT", key: "iut" });
  }
  if (data.effectif_sans_cpge_ing && data.effectif_sans_cpge_ing > 0) {
    niveauxDisponibles.push({ niveau: "Ingénieur", key: "ing" });
  }

  const scspCards = [
    {
      title: "Ressources hors opérations en capital",
      value: `${euro(data.produits_de_fonctionnement_encaissables)} €`,
      detail: "Produits de fonctionnement encaissables",
      color: CHART_COLORS.primary,
    },
    {
      title: "Subvention pour charge de service public",
      value: `${euro(data.scsp)} €`,
      detail:
        data.produits_de_fonctionnement_encaissables && data.scsp
          ? `${(
              (data.scsp / data.produits_de_fonctionnement_encaissables) *
              100
            ).toFixed(1)} % des ressources`
          : "Part des ressources",
      color: CHART_COLORS.primary,
    },
    {
      title: "Ressources propres",
      value: `${euro(data.recettes_propres)} €`,
      detail:
        data.produits_de_fonctionnement_encaissables && data.recettes_propres
          ? `${(
              (data.recettes_propres /
                data.produits_de_fonctionnement_encaissables) *
              100
            ).toFixed(1)} % des ressources`
          : "Part des ressources",
      color: CHART_COLORS.primary,
    },
  ];

  const emploiCards = [
    {
      title: "SCSP",
      value: `${euro(data.scsp)} €`,
      detail: "Subvention pour charges de service public",
      color: CHART_COLORS.secondary,
    },
    {
      title: "SCSP par étudiant",
      value: `${euro(data.scsp_par_etudiants)} €`,
      detail: data.scsp_etudiants
        ? `Pour ${data.scsp_etudiants.toLocaleString("fr-FR")} étudiants`
        : "Ratio SCSP / étudiants",
      color: CHART_COLORS.secondary,
    },
  ];

  const masseSalarialeCards = [
    {
      title: "Charges de personnel",
      value: `${euro(data.charges_de_personnel)} €`,
      detail: "Masse salariale totale",
      color: CHART_COLORS.tertiary,
    },
    {
      title: "Charges / Produits encaissables",
      value: pct(data.charges_de_personnel_produits_encaissables),
      detail: "Part des charges dans les produits",
      color: CHART_COLORS.tertiary,
    },
    {
      title: "Taux rémunération permanents",
      value: pct(data.taux_de_remuneration_des_permanents),
      detail: "Ratio rémunération des permanents",
      color: CHART_COLORS.tertiary,
    },
  ];

  return (
    <div>
      <div className="fr-mb-4w">
        <h3
          className="fr-h5 fr-mb-3w"
          style={{
            borderLeft: `4px solid ${CHART_COLORS.primary}`,
            paddingLeft: "1rem",
          }}
        >
          SCSP (Subvention pour charges de service public)
        </h3>
        <Row gutters>
          {scspCards.map((card) => (
            <Col key={card.title} md="4">
              <MetricCard {...card} />
            </Col>
          ))}
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
          {emploiCards.map((card) => (
            <Col key={card.title} md="6">
              <MetricCard {...card} />
            </Col>
          ))}
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
          {masseSalarialeCards.map((card) => (
            <Col key={card.title} md="4">
              <MetricCard {...card} />
            </Col>
          ))}
        </Row>
      </div>

      <div className="fr-mb-4w">
        <RessourcesPropresChart data={data} />
      </div>
    </div>
  );
}
