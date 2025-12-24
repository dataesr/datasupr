import { useMemo, useState } from "react";
import Highcharts from "highcharts";
import { Row, Col, Button } from "@dataesr/dsfr-plus";
import {
  createEffectifsNiveauChartOptions,
  createEffectifsFiliereChartOptions,
} from "./options";
import ChartWrapper from "../../../../../../components/chart-wrapper";
import { CHART_COLORS, DSFR_COLORS } from "../../../../constants/colors";

const num = (n?: number) =>
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

interface EffectifsChartProps {
  data: any;
  selectedYear?: string | number;
  etablissementName?: string;
}

export default function EffectifsChart({
  data,
  selectedYear,
  etablissementName,
}: EffectifsChartProps) {
  const [viewMode, setViewMode] = useState<"niveau" | "filiere" | "cards">(
    "niveau"
  );

  const niveauOptions = useMemo(() => {
    if (!data) return {} as Highcharts.Options;
    return createEffectifsNiveauChartOptions(data);
  }, [data]);

  const filiereOptions = useMemo(() => {
    if (!data) return {} as Highcharts.Options;
    return createEffectifsFiliereChartOptions(data);
  }, [data]);

  const effectifsCards = useMemo(
    () => [
      {
        title: "Total étudiants",
        value: num(data?.effectif_sans_cpge),
        detail: "Effectif sans CPGE",
        color: CHART_COLORS.primary,
      },
      {
        title: "Licence",
        value: num(data?.effectif_sans_cpge_l),
        detail: pct(data?.part_effectif_sans_cpge_l),
        color: CHART_COLORS.primary,
        show: data?.has_effectif_l,
      },
      {
        title: "Master",
        value: num(data?.effectif_sans_cpge_m),
        detail: pct(data?.part_effectif_sans_cpge_m),
        color: CHART_COLORS.secondary,
        show: data?.has_effectif_m,
      },
      {
        title: "Doctorat",
        value: num(data?.effectif_sans_cpge_d),
        detail: pct(data?.part_effectif_sans_cpge_d),
        color: CHART_COLORS.tertiary,
        show: data?.has_effectif_d,
      },
      {
        title: "IUT",
        value: num(data?.effectif_sans_cpge_iut),
        detail: pct(data?.part_effectif_sans_cpge_iut),
        color: CHART_COLORS.palette[3],
        show: data?.has_effectif_iut && data?.effectif_sans_cpge_iut > 0,
      },
      {
        title: "Ingénieur",
        value: num(data?.effectif_sans_cpge_ing),
        detail: pct(data?.part_effectif_sans_cpge_ing),
        color: CHART_COLORS.quaternary,
        show: data?.has_effectif_ing && data?.effectif_sans_cpge_ing > 0,
      },
      {
        title: "DSA",
        value: num(data?.effectif_sans_cpge_dsa),
        detail: pct(data?.part_effectif_sans_cpge_dsa),
        color: CHART_COLORS.palette[1],
        show: data?.has_effectif_dsa && data?.effectif_sans_cpge_dsa > 0,
      },
      {
        title: "LLSH",
        value: num(data?.effectif_sans_cpge_llsh),
        detail: pct(data?.part_effectif_sans_cpge_llsh),
        color: CHART_COLORS.palette[2],
        show: data?.has_effectif_llsh && data?.effectif_sans_cpge_llsh > 0,
      },
      {
        title: "Sciences",
        value: num(data?.effectif_sans_cpge_si),
        detail: pct(data?.part_effectif_sans_cpge_si),
        color: CHART_COLORS.palette[5],
        show: data?.has_effectif_si && data?.effectif_sans_cpge_si > 0,
      },
      {
        title: "STAPS",
        value: num(data?.effectif_sans_cpge_staps),
        detail: pct(data?.part_effectif_sans_cpge_staps),
        color: CHART_COLORS.palette[6],
        show: data?.has_effectif_staps && data?.effectif_sans_cpge_staps > 0,
      },
      {
        title: "Santé",
        value: num(data?.effectif_sans_cpge_sante),
        detail: pct(data?.part_effectif_sans_cpge_sante),
        color: CHART_COLORS.palette[7],
        show: data?.has_effectif_sante && data?.effectif_sans_cpge_sante > 0,
      },
      {
        title: "Vétérinaire",
        value: num(data?.effectif_sans_cpge_veto),
        detail: pct(data?.part_effectif_sans_cpge_veto),
        color: CHART_COLORS.palette[8],
        show: data?.has_effectif_veto && data?.effectif_sans_cpge_veto > 0,
      },
      {
        title: "Théologie",
        value: num(data?.effectif_sans_cpge_theo),
        detail: pct(data?.part_effectif_sans_cpge_theo),
        color: CHART_COLORS.palette[4],
        show: data?.has_effectif_theo && data?.effectif_sans_cpge_theo > 0,
      },
      {
        title: "Interdisciplinaire",
        value: num(data?.effectif_sans_cpge_interd),
        detail: pct(data?.part_effectif_sans_cpge_interd),
        color: CHART_COLORS.palette[9],
        show: data?.has_effectif_interd && data?.effectif_sans_cpge_interd > 0,
      },
      {
        title: "Emplois ETPT",
        value: num(data?.emploi_etpt),
        detail: "Équivalent temps plein travaillé",
        color: CHART_COLORS.palette[10],
      },
      {
        title: "Taux d'encadrement",
        value: pct(data?.taux_encadrement),
        detail: "Ratio emplois / étudiants",
        color: CHART_COLORS.palette[11],
      },
    ],
    [data]
  );

  if (!data) return null;

  const renderCards = () => (
    <Row gutters className="fr-mb-3w">
      {effectifsCards
        .filter((card) => card.show !== false)
        .map((card) => (
          <Col key={card.title} md="3" sm="6" xs="12">
            <MetricCard
              title={card.title}
              value={card.value}
              detail={card.detail}
              color={card.color}
            />
          </Col>
        ))}
    </Row>
  );

  const renderNiveauChart = () => (
    <ChartWrapper
      config={{
        id: "effectifs-niveau-chart",
        idQuery: "effectifs-niveau",
        title: {
          className: "fr-mt-0w",
          look: "h5",
          size: "h3",
          fr: (
            <>
              Répartition des effectifs par niveau
              {etablissementName && ` — ${etablissementName}`}
            </>
          ),
        },
        comment: {
          fr: (
            <>
              Ce graphique présente la répartition des étudiants par niveau de
              formation (Licence, Master, Doctorat) pour l'exercice{" "}
              {selectedYear}. Les données excluent les effectifs de CPGE.
            </>
          ),
        },
        readingKey: {
          fr: (
            <>
              En {selectedYear}, l'établissement compte{" "}
              <strong>{num(data.effectif_sans_cpge)} étudiants</strong> au
              total.
              {data.has_effectif_m && data.effectif_sans_cpge_m && (
                <>
                  {" "}
                  Le niveau Master représente la plus grande part avec{" "}
                  <strong>{num(data.effectif_sans_cpge_m)} étudiants</strong> (
                  {pct(data.part_effectif_sans_cpge_m)}).
                </>
              )}
            </>
          ),
        },
        updateDate: new Date(),
        integrationURL: "/integration-url",
      }}
      options={niveauOptions}
      legend={null}
    />
  );

  const renderFiliereChart = () => (
    <ChartWrapper
      config={{
        id: "effectifs-filiere-chart",
        idQuery: "effectifs-filiere",
        title: {
          className: "fr-mt-0w",
          look: "h5",
          size: "h3",
          fr: (
            <>
              Répartition des effectifs par filière
              {etablissementName && ` — ${etablissementName}`}
            </>
          ),
        },
        comment: {
          fr: (
            <>
              Ce graphique détaille la répartition des étudiants par filière de
              formation (IUT, Ingénieur, DSA, LLSH, Sciences, STAPS, Santé,
              Vétérinaire, Théologie, Interdisciplinaire) pour l'exercice{" "}
              {selectedYear}.
            </>
          ),
        },
        readingKey: {
          fr: (
            <>
              L'établissement propose{" "}
              {
                effectifsCards.filter(
                  (c) =>
                    c.show !== false &&
                    ![
                      "Total étudiants",
                      "Licence",
                      "Master",
                      "Doctorat",
                      "Emplois ETPT",
                      "Taux d'encadrement",
                    ].includes(c.title)
                ).length
              }{" "}
              filières différentes avec un effectif total de{" "}
              <strong>{num(data.effectif_sans_cpge)} étudiants</strong>.
            </>
          ),
        },
        updateDate: new Date(),
        integrationURL: "/integration-url",
      }}
      options={filiereOptions}
      legend={null}
    />
  );

  return (
    <div>
      <div
        className="fr-mb-2w"
        style={{ display: "flex", gap: "1rem", alignItems: "center" }}
      >
        <h3
          className="fr-h5 fr-mb-0"
          style={{
            borderLeft: "4px solid #9b59b6",
            paddingLeft: "1rem",
            flex: 1,
          }}
        ></h3>
        <div className="fr-btns-group fr-btns-group--sm fr-btns-group--inline">
          <Button
            size="sm"
            variant={viewMode === "niveau" ? "primary" : "secondary"}
            onClick={() => setViewMode("niveau")}
          >
            Par niveau
          </Button>
          <Button
            size="sm"
            variant={viewMode === "filiere" ? "primary" : "secondary"}
            onClick={() => setViewMode("filiere")}
          >
            Par filière
          </Button>
          <Button
            size="sm"
            variant={viewMode === "cards" ? "primary" : "secondary"}
            onClick={() => setViewMode("cards")}
          >
            Détails
          </Button>
        </div>
      </div>

      {viewMode === "niveau" && renderNiveauChart()}
      {viewMode === "filiere" && renderFiliereChart()}
      {viewMode === "cards" && renderCards()}
    </div>
  );
}
