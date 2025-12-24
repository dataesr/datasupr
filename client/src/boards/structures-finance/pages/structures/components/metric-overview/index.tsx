import { Row, Col, Badge } from "@dataesr/dsfr-plus";
import { CHART_COLORS, DSFR_COLORS } from "../../../../constants/colors";

const euro = (n?: number) =>
  n != null ? n.toLocaleString("fr-FR", { maximumFractionDigits: 0 }) : "—";
const pct = (n?: number) => (n != null ? `${n.toFixed(2)} %` : "—");
const num = (n?: number) =>
  n != null ? n.toLocaleString("fr-FR", { maximumFractionDigits: 2 }) : "—";

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
      title: "SCSP",
      value: `${euro(data.scsp)} €`,
      detail: "Subvention pour charges de service public",
      color: CHART_COLORS.primary,
    },
    {
      title: "Étudiants (SCSP)",
      value: num(data.scsp_etudiants),
      detail: "Effectif de référence pour le SCSP",
      color: CHART_COLORS.primary,
    },
    {
      title: "SCSP par étudiant",
      value: `${euro(data.scsp_par_etudiants)} €`,
      detail: "Ratio SCSP / étudiants",
      color: CHART_COLORS.primary,
    },
  ];

  const emploiCards = [
    {
      title: "Emplois (ETPT)",
      value: num(data.emploi_etpt),
      detail: "Équivalent temps plein travaillé",
      color: CHART_COLORS.secondary,
    },
    {
      title: "Étudiants",
      value: num(data.emploi_etpt_etudiants),
      detail: "Effectif de référence pour les emplois",
      color: CHART_COLORS.secondary,
    },
    {
      title: "Taux d'encadrement",
      value: pct(data.taux_encadrement),
      detail: "Ratio emplois / étudiants",
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
      {/* Encart RCE et niveaux d'études */}
      <div className="fr-mb-4w">
        <div
          className="fr-p-3w"
          style={{
            backgroundColor: "var(--background-contrast-info)",
            borderRadius: "8px",
            borderLeft: `4px solid ${CHART_COLORS.primary}`,
          }}
        >
          <Row>
            <Col md="6">
              <h4
                className="fr-h6 fr-mb-2w"
                style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
              >
                🏛️ Responsabilités et Compétences Élargies (RCE)
              </h4>
              <p className="fr-text--sm" style={{ marginBottom: "0.5rem" }}>
                <strong style={{ color: DSFR_COLORS.textDefault }}>
                  Statut RCE :
                </strong>{" "}
                {data.rce ? (
                  <Badge color="success">Oui</Badge>
                ) : (
                  <Badge color="warning">Non</Badge>
                )}
              </p>
              {data.date_passage_rce && (
                <p className="fr-text--sm fr-mb-0">
                  <strong style={{ color: DSFR_COLORS.textDefault }}>
                    Date de passage :
                  </strong>{" "}
                  {new Date(data.date_passage_rce).toLocaleDateString("fr-FR")}
                </p>
              )}
            </Col>
            <Col md="6">
              <h4
                className="fr-h6 fr-mb-2w"
                style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
              >
                🎓 Niveaux d'études disponibles
              </h4>
              {niveauxDisponibles.length > 0 ? (
                <div
                  style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}
                >
                  {niveauxDisponibles.map((niveau) => (
                    <Badge key={niveau.key} color="info">
                      {niveau.niveau}
                    </Badge>
                  ))}
                </div>
              ) : (
                <p
                  className="fr-text--sm fr-mb-0"
                  style={{ color: DSFR_COLORS.textDefault }}
                >
                  Aucune donnée disponible
                </p>
              )}
            </Col>
          </Row>
        </div>
      </div>

      {/* Section SCSP */}
      <div className="fr-mb-4w">
        <h3
          className="fr-h5 fr-mb-3w"
          style={{
            borderLeft: `4px solid ${CHART_COLORS.primary}`,
            paddingLeft: "1rem",
          }}
        >
          💰 SCSP (Subvention pour charges de service public)
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
          👥 Emplois et encadrement
        </h3>
        <Row gutters>
          {emploiCards.map((card) => (
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
            borderLeft: `4px solid ${CHART_COLORS.tertiary}`,
            paddingLeft: "1rem",
          }}
        >
          💵 Masse salariale
        </h3>
        <Row gutters>
          {masseSalarialeCards.map((card) => (
            <Col key={card.title} md="4">
              <MetricCard {...card} />
            </Col>
          ))}
        </Row>
      </div>
    </div>
  );
}
