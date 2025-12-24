import { useMemo, useState } from "react";
import { Button } from "@dataesr/dsfr-plus";
import ChartWrapper from "../../../../../../components/chart-wrapper";
import {
  createMultiEtablissementsChartOptions,
  createTauxCroissanceChartOptions,
} from "./options";
import { CHART_COLORS } from "../../../../constants/colors";

interface EvolutionData {
  annee: number;
  recettes_propres: number;
  scsp: number;
}

interface EtablissementEvolution {
  id: string;
  nom: string;
  series: EvolutionData[];
}

interface MultiEtablissementsChartProps {
  etablissements: EtablissementEvolution[];
}

export default function MultiEtablissementsChart({
  etablissements,
}: MultiEtablissementsChartProps) {
  const [selectedMetric, setSelectedMetric] = useState<
    "recettes_propres" | "scsp" | "total"
  >("total");
  const [viewMode, setViewMode] = useState<"evolution" | "croissance">(
    "evolution"
  );

  const colors = CHART_COLORS.palette;

  const etablissementsWithColors = useMemo(
    () =>
      etablissements.map((etab, idx) => ({
        ...etab,
        color: colors[idx % colors.length],
      })),
    [etablissements, colors]
  );

  const evolutionOptions = useMemo(
    () =>
      createMultiEtablissementsChartOptions(
        etablissementsWithColors,
        selectedMetric
      ),
    [etablissementsWithColors, selectedMetric]
  );

  const croissanceOptions = useMemo(
    () =>
      createTauxCroissanceChartOptions(
        etablissementsWithColors,
        selectedMetric
      ),
    [etablissementsWithColors, selectedMetric]
  );

  const metricLabel =
    selectedMetric === "recettes_propres"
      ? "Recettes propres"
      : selectedMetric === "scsp"
      ? "SCSP"
      : "Recettes totales";

  if (etablissements.length === 0) {
    return (
      <div
        className="fr-alert fr-alert--info fr-mb-3w"
        style={{ textAlign: "center" }}
      >
        <p>
          Sélectionnez au moins un établissement pour visualiser son évolution
        </p>
      </div>
    );
  }

  return (
    <div>
      <div
        className="fr-mb-3w"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "1rem",
        }}
      >
        <div>
          <h3
            className="fr-h5 fr-mb-0"
            style={{
              borderLeft: `4px solid ${CHART_COLORS.primary}`,
              paddingLeft: "1rem",
            }}
          >
            Comparaison des évolutions
          </h3>
          <p
            className="fr-text--xs fr-mb-0"
            style={{
              color: "var(--text-default-grey)",
              marginTop: "0.5rem",
              paddingLeft: "1rem",
            }}
          >
            {etablissements.length} établissement
            {etablissements.length > 1 ? "s" : ""} sélectionné
            {etablissements.length > 1 ? "s" : ""}
          </p>
        </div>

        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
          <div className="fr-btns-group fr-btns-group--sm fr-btns-group--inline">
            <Button
              size="sm"
              variant={viewMode === "evolution" ? "primary" : "secondary"}
              onClick={() => setViewMode("evolution")}
            >
              Évolution
            </Button>
            <Button
              size="sm"
              variant={viewMode === "croissance" ? "primary" : "secondary"}
              onClick={() => setViewMode("croissance")}
            >
              Taux de croissance
            </Button>
          </div>

          <div className="fr-btns-group fr-btns-group--sm fr-btns-group--inline">
            <Button
              key="metric-total"
              size="sm"
              variant={selectedMetric === "total" ? "primary" : "secondary"}
              onClick={() => setSelectedMetric("total")}
            >
              Total
            </Button>
            <Button
              key="metric-recettes"
              size="sm"
              variant={
                selectedMetric === "recettes_propres" ? "primary" : "secondary"
              }
              onClick={() => setSelectedMetric("recettes_propres")}
            >
              Recettes propres
            </Button>
            <Button
              key="metric-scsp"
              size="sm"
              variant={selectedMetric === "scsp" ? "primary" : "secondary"}
              onClick={() => setSelectedMetric("scsp")}
            >
              SCSP
            </Button>
          </div>
        </div>
      </div>

      {viewMode === "evolution" ? (
        <ChartWrapper
          config={{
            id: "multi-etablissements-evolution-chart",
            idQuery: "multi-etablissements-evolution",
            title: {
              className: "fr-mt-0w",
              look: "h5",
              size: "h3",
              fr: `Évolution ${metricLabel.toLowerCase()} — Comparaison`,
            },
            comment: {
              fr: (
                <>
                  Ce graphique compare l'évolution temporelle{" "}
                  {metricLabel.toLowerCase()} des établissements sélectionnés
                  sur l'ensemble de la période disponible.
                </>
              ),
            },
            readingKey: {
              fr: (
                <>
                  Chaque courbe représente l'évolution d'un établissement. Les
                  variations permettent d'identifier les tendances de croissance
                  ou de décroissance sur plusieurs années.
                </>
              ),
            },
            updateDate: new Date(),
            integrationURL: "/integration-url",
          }}
          options={evolutionOptions}
          legend={null}
        />
      ) : (
        <ChartWrapper
          config={{
            id: "multi-etablissements-croissance-chart",
            idQuery: "multi-etablissements-croissance",
            title: {
              className: "fr-mt-0w",
              look: "h5",
              size: "h3",
              fr: `Taux de croissance annuel ${metricLabel.toLowerCase()} — Comparaison`,
            },
            comment: {
              fr: (
                <>
                  Ce graphique présente le taux de croissance annuel (variation
                  en % par rapport à l'année précédente){" "}
                  {metricLabel.toLowerCase()} pour chaque établissement
                  sélectionné.
                </>
              ),
            },
            readingKey: {
              fr: (
                <>
                  Les barres au-dessus de 0 indiquent une croissance positive,
                  celles en dessous une décroissance. Ce graphique permet
                  d'identifier rapidement les années de forte variation.
                </>
              ),
            },
            updateDate: new Date(),
            integrationURL: "/integration-url",
          }}
          options={croissanceOptions}
          legend={null}
        />
      )}
    </div>
  );
}
