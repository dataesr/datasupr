import { useMemo, useState } from "react";
import Highcharts from "highcharts";
import { Row, Col, Button } from "@dataesr/dsfr-plus";
import { createRessourcesPropresChartOptions } from "./options";
import ChartWrapper from "../../../../../../components/chart-wrapper";
import { CHART_COLORS, DSFR_COLORS } from "../../../../constants/colors";

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

interface RessourcesPropresChartProps {
  data: any;
  selectedYear?: string | number;
  etablissementName?: string;
}

export default function RessourcesPropresChart({
  data,
  selectedYear,
  etablissementName,
}: RessourcesPropresChartProps) {
  const [viewMode, setViewMode] = useState<"chart" | "cards">("chart");

  const options = useMemo(() => {
    if (!data) return {} as Highcharts.Options;
    return createRessourcesPropresChartOptions(data);
  }, [data]);

  const ressourcesPropresDecomposition = useMemo(
    () => [
      {
        label: "Droits d'inscription",
        value: data?.droits_d_inscription,
        part: data?.part_droits_d_inscription,
        color: CHART_COLORS.palette[0],
      },
      {
        label: "Formation continue",
        value: data?.formation_continue_diplomes_propres_et_vae,
        part: data?.part_formation_continue_diplomes_propres_et_vae,
        color: CHART_COLORS.palette[1],
      },
      {
        label: "Taxe d'apprentissage",
        value: data?.taxe_d_apprentissage,
        part: data?.part_taxe_d_apprentissage,
        color: CHART_COLORS.palette[2],
      },
      {
        label: "Valorisation",
        value: data?.valorisation,
        part: data?.part_valorisation,
        color: CHART_COLORS.palette[3],
      },
      {
        label: "ANR hors investissements",
        value: data?.anr_hors_investissements_d_avenir,
        part: data?.part_anr_hors_investissements_d_avenir,
        color: CHART_COLORS.palette[4],
      },
      {
        label: "ANR investissements",
        value: data?.anr_investissements_d_avenir,
        part: data?.part_anr_investissements_d_avenir,
        color: CHART_COLORS.palette[5],
      },
      {
        label: "Contrats & prestations",
        value: data?.contrats_et_prestations_de_recherche_hors_anr,
        part: data?.part_contrats_et_prestations_de_recherche_hors_anr,
        color: CHART_COLORS.palette[6],
      },
      {
        label: "Subventions région",
        value: data?.subventions_de_la_region,
        part: data?.part_subventions_de_la_region,
        color: CHART_COLORS.palette[7],
      },
      {
        label: "Subventions UE",
        value: data?.subventions_union_europeenne,
        part: data?.part_subventions_union_europeenne,
        color: CHART_COLORS.palette[8],
      },
      {
        label: "Autres ressources",
        value: data?.autres_ressources_propres,
        part: data?.part_autres_ressources_propres,
        color: CHART_COLORS.palette[9],
      },
      {
        label: "Autres subventions",
        value: data?.autres_subventions,
        part: data?.part_autres_subventions,
        color: CHART_COLORS.palette[10],
      },
    ],
    [data]
  );

  const totalRessources = data?.ressources_propres || 0;

  if (!data) return null;

  const renderCards = () => (
    <Row gutters className="fr-mb-3w">
      {ressourcesPropresDecomposition.map((item) => (
        <Col key={item.label} md="3" sm="6" xs="12">
          <MetricCard
            title={item.label}
            value={`${euro(item.value)} €`}
            detail={pct(item.part)}
            color={item.color}
          />
        </Col>
      ))}
      <Col md="3" sm="6" xs="12">
        <MetricCard
          title="Total ressources propres"
          value={`${euro(totalRessources)} €`}
          detail="Somme des ressources propres"
          color={CHART_COLORS.secondary}
        />
      </Col>
    </Row>
  );

  const renderChart = () => (
    <ChartWrapper
      config={{
        id: "ressources-propres-chart",
        idQuery: "ressources-propres",
        title: {
          className: "fr-mt-0w",
          look: "h5",
          size: "h3",
          fr: (
            <>
              Décomposition des ressources propres
              {etablissementName && ` — ${etablissementName}`}
            </>
          ),
        },
        comment: {
          fr: (
            <>
              Ce graphique présente la répartition détaillée des ressources
              propres de l'établissement pour l'exercice {selectedYear}. Les
              ressources propres comprennent notamment les droits d'inscription,
              la formation continue, les contrats de recherche, les subventions
              régionales et européennes.
            </>
          ),
        },
        readingKey: {
          fr: (
            <>
              En {selectedYear}, le total des ressources propres s'élève à{" "}
              <strong>{euro(totalRessources)} €</strong>. La principale source
              est{" "}
              {ressourcesPropresDecomposition
                .sort((a, b) => (b.value || 0) - (a.value || 0))[0]
                ?.label.toLowerCase()}{" "}
              avec{" "}
              <strong>
                {euro(
                  ressourcesPropresDecomposition.sort(
                    (a, b) => (b.value || 0) - (a.value || 0)
                  )[0]?.value
                )}{" "}
                €
              </strong>{" "}
              (
              {pct(
                ressourcesPropresDecomposition.sort(
                  (a, b) => (b.value || 0) - (a.value || 0)
                )[0]?.part
              )}
              ).
            </>
          ),
        },
        updateDate: new Date(),
        integrationURL: "/integration-url",
      }}
      options={options}
      legend={null}
    />
  );

  return (
    <div>
      {data.is_rce && data.rce && (
        <div
          className="fr-alert fr-alert--info fr-mb-3w"
          style={{
            backgroundColor: "var(--background-contrast-info)",
            border: `1px solid ${CHART_COLORS.primary}`,
            borderLeft: `4px solid ${CHART_COLORS.primary}`,
          }}
        >
          <h4 className="fr-alert__title" style={{ fontSize: "14px" }}>
            🏛️ Responsabilités et Compétences Élargies (RCE)
          </h4>
          <p className="fr-text--sm" style={{ marginBottom: "0.5rem" }}>
            Cet établissement a obtenu la <strong>RCE en {data.rce}</strong>.
            Depuis cette date, il gère de manière autonome le paiement de son
            personnel, une responsabilité auparavant assumée directement par
            l'État.
          </p>
          <p
            className="fr-text--xs"
            style={{ color: DSFR_COLORS.textDefault, marginBottom: 0 }}
          >
            Cette autonomie de gestion influence la structure des charges de
            personnel et la répartition des ressources financières.
          </p>
        </div>
      )}

      <div
        className="fr-mb-2w"
        style={{ display: "flex", gap: "1rem", alignItems: "center" }}
      >
        <h3
          className="fr-h5 fr-mb-0"
          style={{
            borderLeft: `4px solid ${CHART_COLORS.tertiary}`,
            paddingLeft: "1rem",
            flex: 1,
          }}
        >
          Ressources propres — Analyse détaillée
        </h3>
        <div className="fr-btns-group fr-btns-group--sm fr-btns-group--inline">
          <Button
            size="sm"
            variant={viewMode === "chart" ? "primary" : "secondary"}
            onClick={() => setViewMode("chart")}
          >
            Graphique
          </Button>
          <Button
            size="sm"
            variant={viewMode === "cards" ? "primary" : "secondary"}
            onClick={() => setViewMode("cards")}
          >
            Cartes
          </Button>
        </div>
      </div>

      {viewMode === "chart" ? renderChart() : renderCards()}
    </div>
  );
}
