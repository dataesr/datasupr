import { Row, Col } from "@dataesr/dsfr-plus";
import { CHART_COLORS, DSFR_COLORS } from "../../../../constants/colors";

const euro = (n?: number) =>
  n != null ? n.toLocaleString("fr-FR", { maximumFractionDigits: 0 }) : "—";
const pct = (n?: number) => (n != null ? `${n.toFixed(1)} %` : "—");

interface MetricCardProps {
  title: string;
  value: string;
  detail?: string;
  color?: string;
  sparklineData?: number[];
}

export function MetricCard({
  title,
  value,
  detail,
  color = CHART_COLORS.primary,
  sparklineData,
}: MetricCardProps) {
  const createSparklinePath = (data: number[]) => {
    if (!data || data.length < 2) return "";

    const width = 200;
    const height = 80;
    const padding = 5;

    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = max - min || 1;

    const points = data.map((value, index) => {
      const x = padding + (index / (data.length - 1)) * (width - 2 * padding);
      const y =
        height - padding - ((value - min) / range) * (height - 2 * padding);
      return { x, y };
    });

    let path = `M ${points[0].x},${points[0].y}`;

    for (let i = 0; i < points.length - 1; i++) {
      const current = points[i];
      const next = points[i + 1];

      const tension = 0.3;
      const cp1x = current.x + (next.x - current.x) * tension;
      const cp1y = current.y;
      const cp2x = next.x - (next.x - current.x) * tension;
      const cp2y = next.y;

      path += ` C ${cp1x},${cp1y} ${cp2x},${cp2y} ${next.x},${next.y}`;
    }

    return path;
  };

  const sparklinePath = sparklineData ? createSparklinePath(sparklineData) : "";

  const trend =
    sparklineData && sparklineData.length >= 2 && sparklineData[0] !== 0
      ? ((sparklineData[sparklineData.length - 1] - sparklineData[0]) /
          sparklineData[0]) *
        100
      : null;

  const trendFormatted =
    trend !== null && isFinite(trend)
      ? `${trend > 0 ? "+" : ""}${trend.toFixed(1)}%`
      : null;

  const gradientId = `gradient-${title.replace(
    /[^a-zA-Z0-9]/g,
    "-"
  )}-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <div
      className="fr-card fr-enlarge-link"
      tabIndex={0}
      role="article"
      aria-label={`${title}: ${value}${detail ? `, ${detail}` : ""}`}
      style={{
        height: "100%",
        borderTop: `4px solid ${color}`,
        borderLeft: "none",
        borderRight: "none",
        borderBottom: "none",
        backgroundColor: DSFR_COLORS.backgroundAlt,
        position: "relative",
        overflow: "hidden",
      }}
    >
      {sparklineData && sparklineData.length > 1 && (
        <svg
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            width: "100%",
            height: "90px",
            pointerEvents: "none",
          }}
          viewBox="0 0 200 80"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id={gradientId} x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor={color} stopOpacity="0.8" />
              <stop offset="40%" stopColor={color} stopOpacity="0.15" />
              <stop offset="100%" stopColor={color} stopOpacity="0.02" />
            </linearGradient>
          </defs>
          <path
            d={`${sparklinePath} L 200,80 L 0,80 Z`}
            fill={`url(#${gradientId})`}
            stroke="none"
          />
          <path
            d={sparklinePath}
            fill="none"
            stroke={color}
            strokeWidth="3"
            strokeOpacity="0.8"
          />
        </svg>
      )}

      <div
        className="fr-card__body fr-p-2w"
        style={{ position: "relative", zIndex: 1 }}
      >
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
          <p className="fr-h5 fr-mb-1v">{value}</p>
          {detail && (
            <p
              className="fr-text--sm"
              style={{ color: DSFR_COLORS.textDefault, margin: 0 }}
            >
              {detail}
            </p>
          )}
        </div>
        {trendFormatted && (
          <div
            style={{
              position: "absolute",
              bottom: "0.5rem",
              right: "0.5rem",
              fontSize: "0.875rem",
              fontWeight: 600,
              color:
                trend && trend > 0
                  ? "var(--green-archipel-sun-391)"
                  : trend && trend < 0
                  ? "var(--pink-tuile-sun-425)"
                  : "var(--text-mention-grey)",
              display: "flex",
              alignItems: "center",
              gap: "3px",
            }}
          >
            {trend && trend > 0 ? "↗" : trend && trend < 0 ? "↘" : "→"}
            {trendFormatted}
          </div>
        )}
      </div>
    </div>
  );
}

interface MetricOverviewProps {
  data: any;
  evolutionData?: any[];
  selectedYear?: string | number;
}

export default function MetricOverview({
  data,
  evolutionData,
  selectedYear,
}: MetricOverviewProps) {
  if (!data) return null;

  const getEvolutionData = (metricKey: string) => {
    if (!evolutionData || evolutionData.length === 0) return undefined;
    const yearNum = selectedYear ? Number(selectedYear) : null;
    return evolutionData
      .sort((a, b) => a.exercice - b.exercice)
      .filter((item) => !yearNum || item.exercice <= yearNum)
      .map((item) => item[metricKey])
      .filter((val): val is number => val != null && !isNaN(val));
  };

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
      title: "Total des ressources",
      value: `${euro(data.produits_de_fonctionnement_encaissables)} €`,
      detail: "Hors opérations en capital",
      color: CHART_COLORS.primary,
      sparklineData: getEvolutionData(
        "produits_de_fonctionnement_encaissables"
      ),
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
      sparklineData: getEvolutionData("scsp"),
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
      sparklineData: getEvolutionData("recettes_propres"),
    },
  ];

  const emploiCards = [
    {
      title: "SCSP",
      value: `${euro(data.scsp)} €`,
      detail: "Subvention pour charges de service public",
      color: CHART_COLORS.secondary,
      sparklineData: getEvolutionData("scsp"),
    },
    {
      title: "SCSP par étudiant",
      value: `${euro(data.scsp_par_etudiants)} €`,
      detail: data.scsp_etudiants
        ? `Pour ${data.scsp_etudiants.toLocaleString("fr-FR")} étudiants`
        : "Ratio SCSP / étudiants",
      color: CHART_COLORS.secondary,
      sparklineData: getEvolutionData("scsp_par_etudiants"),
    },
  ];

  const masseSalarialeCards = [
    {
      title: "Charges de personnel",
      value: `${euro(data.charges_de_personnel)} €`,
      detail: "Masse salariale totale",
      color: CHART_COLORS.tertiary,
      sparklineData: getEvolutionData("charges_de_personnel"),
    },
    {
      title: "Charges / Produits encaissables",
      value: pct(data.charges_de_personnel_produits_encaissables),
      detail: "Part des charges de personnel dans les produits",
      color: CHART_COLORS.tertiary,
      sparklineData: getEvolutionData(
        "charges_de_personnel_produits_encaissables"
      ),
    },
    {
      title: "Taux rémunération permanents",
      value: pct(data.taux_de_remuneration_des_permanents),
      detail: "Ratio rémunération des permanents",
      color: CHART_COLORS.tertiary,
      sparklineData: getEvolutionData("taux_de_remuneration_des_permanents"),
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
          Les ressources de l'établissement
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
    </div>
  );
}
