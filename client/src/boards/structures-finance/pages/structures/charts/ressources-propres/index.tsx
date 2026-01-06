import { useMemo, useState } from "react";
import Highcharts from "highcharts";
import "highcharts/modules/treemap";
import { Button } from "@dataesr/dsfr-plus";
import { createRessourcesPropresChartOptions } from "./options";
import ChartWrapper from "../../../../../../components/chart-wrapper";
import { CHART_COLORS } from "../../../../constants/colors";

const euro = (n?: number) =>
  n != null ? n.toLocaleString("fr-FR", { maximumFractionDigits: 0 }) : "—";
const pct = (n?: number) => (n != null ? `${n.toFixed(1)} %` : "—");

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
  const [viewMode, setViewMode] = useState<"chart" | "table">("chart");

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

  const renderTable = () => (
    <div className="fr-table fr-table--bordered fr-mb-3w">
      <div className="fr-table__wrapper">
        <div className="fr-table__container">
          <div className="fr-table__content">
            <table>
              <thead>
                <tr>
                  <th style={{ width: "50%" }}>Catégorie</th>
                  <th style={{ width: "30%", textAlign: "right" }}>Montant</th>
                  <th style={{ width: "20%", textAlign: "right" }}>Part</th>
                </tr>
              </thead>
              <tbody>
                {ressourcesPropresDecomposition
                  .sort((a, b) => (b.value || 0) - (a.value || 0))
                  .map((item) => (
                    <tr key={item.label}>
                      <td>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                          }}
                        >
                          <div
                            style={{
                              width: "12px",
                              height: "12px",
                              backgroundColor: item.color,
                              borderRadius: "2px",
                            }}
                          />
                          <span>{item.label}</span>
                        </div>
                      </td>
                      <td style={{ textAlign: "right", fontWeight: 600 }}>
                        {euro(item.value)} €
                      </td>
                      <td style={{ textAlign: "right" }}>{pct(item.part)}</td>
                    </tr>
                  ))}
                <tr
                  style={{
                    backgroundColor: "var(--background-contrast-grey)",
                    fontWeight: 700,
                  }}
                >
                  <td>
                    <strong>Total ressources propres</strong>
                  </td>
                  <td style={{ textAlign: "right" }}>
                    <strong>{euro(totalRessources)} €</strong>
                  </td>
                  <td style={{ textAlign: "right" }}>
                    <strong>100 %</strong>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
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
    <>
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
        ></h3>
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
            variant={viewMode === "table" ? "primary" : "secondary"}
            onClick={() => setViewMode("table")}
          >
            Tableau
          </Button>
        </div>
      </div>

      {viewMode === "chart" ? renderChart() : renderTable()}
    </>
  );
}
