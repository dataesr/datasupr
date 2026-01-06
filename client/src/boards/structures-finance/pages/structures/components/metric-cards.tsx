import { Row, Col } from "@dataesr/dsfr-plus";
import RessourcesPropresChart from "../charts/ressources-propres";
import EffectifsChart from "../charts/effectifs";
import { CARD_COLORS } from "../../../constants/colors";

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
  color = CARD_COLORS.effectifs.color,
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
        backgroundColor: "var(--background-default-grey-hover)",
      }}
    >
      <div className="fr-card__body fr-p-2w">
        <div className="fr-card__content">
          <p
            className="fr-text--sm fr-text--bold fr-mb-1v"
            style={{
              color: "var(--text-default-grey)",
              textTransform: "uppercase",
              letterSpacing: "0.5px",
            }}
          >
            {title}
          </p>
          <p
            className="fr-h5 fr-mb-1v"
            style={{ fontWeight: 700, color: "var(--text-action-high-grey)" }}
          >
            {value}
          </p>
          {detail && (
            <p
              className="fr-text--sm"
              style={{ color: "var(--text-default-grey)", margin: 0 }}
            >
              {detail}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

interface MetricCardsProps {
  data: any;
  selectedYear?: string | number;
  etablissementName?: string;
}

export default function MetricCards({
  data,
  selectedYear,
  etablissementName,
}: MetricCardsProps) {
  if (!data) return null;

  const scspCards = [
    {
      title: "SCSP",
      value: `${euro(data.scsp)} €`,
      detail: "Subvention pour charges de service public",
      color: CARD_COLORS.effectifs.color,
    },
    {
      title: "Étudiants (SCSP)",
      value: num(data.scsp_etudiants),
      detail: "Effectif de référence pour le SCSP",
      color: CARD_COLORS.effectifs.color,
    },
    {
      title: "SCSP par étudiant",
      value: `${euro(data.scsp_par_etudiants)} €`,
      detail: "Ratio SCSP / étudiants",
      color: CARD_COLORS.effectifs.color,
    },
  ];

  const emploiCards = [
    {
      title: "Emplois (ETPT)",
      value: num(data.emploi_etpt),
      detail: "Équivalent temps plein travaillé",
      color: CARD_COLORS.finances.color,
    },
    {
      title: "Étudiants",
      value: num(data.emploi_etpt_etudiants),
      detail: "Effectif de référence pour les emplois",
      color: CARD_COLORS.finances.color,
    },
    {
      title: "Taux d'encadrement",
      value: pct(data.taux_encadrement),
      detail: "Ratio emplois / étudiants",
      color: CARD_COLORS.finances.color,
    },
  ];

  const masseSalarialeCards = [
    {
      title: "Charges de personnel",
      value: `${euro(data.charges_de_personnel)} €`,
      detail: "Masse salariale totale",
      color: CARD_COLORS.personnel.color,
    },
    {
      title: "Charges / Produits encaissables",
      value: pct(data.charges_de_personnel_produits_encaissables),
      detail: "Part des charges dans les produits",
      color: CARD_COLORS.personnel.color,
    },
    {
      title: "Taux rémunération permanents",
      value: pct(data.taux_de_remuneration_des_permanents),
      detail: "Ratio rémunération des permanents",
      color: CARD_COLORS.personnel.color,
    },
  ];

  return (
    <div>
      <div className="fr-mb-4w">
        <h3
          className="fr-h5 fr-mb-3w"
          style={{
            borderLeft: `4px solid ${CARD_COLORS.effectifs.color}`,
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
            borderLeft: `4px solid ${CARD_COLORS.finances.color}`,
            paddingLeft: "1rem",
          }}
        >
          Emplois et encadrement
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
            borderLeft: `4px solid ${CARD_COLORS.personnel.color}`,
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

      <div className="fr-mb-3w">
        <h3
          className="fr-h5 fr-mb-3w"
          style={{
            borderLeft: `4px solid ${CARD_COLORS.recherche.color}`,
            paddingLeft: "1rem",
          }}
        >
          📊 Analyses détaillées
        </h3>
      </div>

      <RessourcesPropresChart
        data={data}
        selectedYear={selectedYear}
        etablissementName={etablissementName}
      />

      <EffectifsChart
        data={data}
        selectedYear={selectedYear}
        etablissementName={etablissementName}
      />
    </div>
  );
}
