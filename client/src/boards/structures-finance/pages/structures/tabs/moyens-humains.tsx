import { Row, Col } from "@dataesr/dsfr-plus";
import { CHART_COLORS, DSFR_COLORS } from "../../../constants/colors";
import { useFinanceEtablissementEvolution } from "../../../api";
import "./styles.scss";

interface MetricCardProps {
  title: string;
  value: string;
  detail?: string;
  color?: string;
  sparklineData?: number[];
  ariaLabel?: string;
}

function MetricCard({
  title,
  value,
  detail,
  color = CHART_COLORS.primary,
  sparklineData,
  ariaLabel,
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

  const gradientId = `gradient-${title.replace(
    /[^a-zA-Z0-9]/g,
    "-"
  )}-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <div
      className="fr-card fr-enlarge-link metric-card"
      style={{
        borderTopColor: color,
        position: "relative",
        overflow: "hidden",
        backgroundColor: DSFR_COLORS.backgroundAlt,
      }}
      tabIndex={0}
      role="article"
      aria-label={
        ariaLabel || `${title}: ${value}${detail ? `, ${detail}` : ""}`
      }
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
          <p className="fr-text--sm fr-text--bold fr-mb-1v metric-label">
            {title}
          </p>
          <p className="fr-h4 fr-mb-1v metric-value">{value}</p>
          {detail && <p className="fr-text--sm metric-description">{detail}</p>}
        </div>
      </div>
    </div>
  );
}

interface MoyensHumainsTabProps {
  data: any;
}

export function MoyensHumainsTab({ data }: MoyensHumainsTabProps) {
  const { data: evolutionData } = useFinanceEtablissementEvolution(
    data?.etablissement_id_paysage
  );

  const getEvolutionData = (metricKey: string) => {
    if (!evolutionData || evolutionData.length === 0) return undefined;
    return evolutionData
      .sort((a, b) => a.exercice - b.exercice)
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
              ariaLabel={`Nombre d'emplois: ${
                data.emploi_etpt != null
                  ? data.emploi_etpt.toLocaleString("fr-FR", {
                      maximumFractionDigits: 1,
                    })
                  : "—"
              } ETPT, Équivalent temps plein travaillé`}
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
              ariaLabel={`Taux d'encadrement: ${
                data.taux_encadrement != null
                  ? `${data.taux_encadrement.toFixed(1)} %`
                  : "—"
              }, ${
                data.effectif_sans_cpge
                  ? `Pour ${data.effectif_sans_cpge.toLocaleString(
                      "fr-FR"
                    )} étudiants`
                  : "Enseignants permanents"
              }`}
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
              ariaLabel={`Charges de personnel: ${
                data.charges_de_personnel != null
                  ? `${data.charges_de_personnel.toLocaleString("fr-FR", {
                      maximumFractionDigits: 0,
                    })} €`
                  : "—"
              }, Dépenses de masse salariale`}
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
              ariaLabel={`Poids sur produits: ${
                data.charges_de_personnel_produits_encaissables != null
                  ? `${data.charges_de_personnel_produits_encaissables.toFixed(
                      1
                    )} %`
                  : "—"
              }, Part des produits encaissables`}
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
              ariaLabel={`Rémunération permanents: ${
                data.taux_de_remuneration_des_permanents != null
                  ? `${data.taux_de_remuneration_des_permanents.toFixed(1)} %`
                  : "—"
              }, Part des dépenses de personnel`}
            />
          </Col>
        </Row>
      </div>
    </div>
  );
}
