import { useMemo, useState } from "react";
import { Button } from "@dataesr/dsfr-plus";
import ChartWrapper from "../../../../../../components/chart-wrapper";
import { useFinanceComparisonData } from "../../../../api";
import {
  createAutonomieFinanciereChartOptions,
  createEfficienceChartOptions,
} from "./options";
import { CHART_COLORS } from "../../../../constants/colors";

interface AutonomieChartProps {
  selectedYear: string;
}

export default function AutonomieChart({ selectedYear }: AutonomieChartProps) {
  const [viewMode, setViewMode] = useState<"autonomie" | "efficience">(
    "autonomie"
  );
  const [groupBy, setGroupBy] = useState<"type" | "region">("type");

  const { data, isLoading } = useFinanceComparisonData({
    annee: selectedYear,
  });

  const etablissements = useMemo(() => {
    if (!data || !data.items) return [];

    console.log("Total items from API:", data.items.length);
    if (data.items.length > 0) {
      console.log("Sample item:", data.items[0]);
    }

    const filtered = data.items.filter(
      (item: any) =>
        item.part_ressources_propres != null &&
        item.charges_de_personnel_produits_encaissables != null &&
        item.scsp_par_etudiants != null &&
        item.taux_encadrement != null &&
        item.effectif_sans_cpge > 0
    );

    console.log("Filtered items:", filtered.length);
    return filtered;
  }, [data]);

  const autonomieOptions = useMemo(
    () => createAutonomieFinanciereChartOptions(etablissements, groupBy),
    [etablissements, groupBy]
  );

  const efficienceOptions = useMemo(
    () => createEfficienceChartOptions(etablissements, groupBy),
    [etablissements, groupBy]
  );

  if (isLoading) {
    return (
      <div className="fr-py-12v" style={{ textAlign: "center" }}>
        Chargement des données...
      </div>
    );
  }

  if (!etablissements.length) {
    return (
      <div className="fr-py-12v" style={{ textAlign: "center" }}>
        Aucune donnée disponible pour l'année {selectedYear}
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
            Analyse comparative
          </h3>
          <p
            className="fr-text--xs fr-mb-0"
            style={{
              color: "var(--text-default-grey)",
              marginTop: "0.5rem",
              paddingLeft: "1rem",
            }}
          >
            {etablissements.length} établissements analysés
          </p>
        </div>

        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
          <div className="fr-btns-group fr-btns-group--sm fr-btns-group--inline">
            <Button
              key="view-autonomie"
              size="sm"
              variant={viewMode === "autonomie" ? "primary" : "secondary"}
              onClick={() => setViewMode("autonomie")}
            >
              Autonomie financière
            </Button>
            <Button
              key="view-efficience"
              size="sm"
              variant={viewMode === "efficience" ? "primary" : "secondary"}
              onClick={() => setViewMode("efficience")}
            >
              Efficience
            </Button>
          </div>

          <div className="fr-btns-group fr-btns-group--sm fr-btns-group--inline">
            <Button
              key="group-type"
              size="sm"
              variant={groupBy === "type" ? "primary" : "secondary"}
              onClick={() => setGroupBy("type")}
            >
              Par type
            </Button>
            <Button
              key="group-region"
              size="sm"
              variant={groupBy === "region" ? "primary" : "secondary"}
              onClick={() => setGroupBy("region")}
            >
              Par région
            </Button>
          </div>
        </div>
      </div>

      {viewMode === "autonomie" ? (
        <ChartWrapper
          config={{
            id: "autonomie-financiere-chart",
            idQuery: "autonomie-financiere",
            title: {
              className: "fr-mt-0w",
              look: "h5",
              size: "h3",
              fr: `Autonomie financière vs Charges de personnel — ${selectedYear}`,
            },
            comment: {
              fr: (
                <>
                  Ce graphique analyse la relation entre l'autonomie financière
                  des établissements (part des ressources propres dans le total
                  des recettes) et le poids des charges de personnel par rapport
                  aux produits encaissables. Les établissements sont groupés par{" "}
                  {groupBy === "type" ? "type" : "région"}.
                </>
              ),
            },
            readingKey: {
              fr: (
                <>
                  L'autonomie financière mesure la part des ressources propres
                  dans le total des recettes. Le poids des charges de personnel
                  est exprimé par rapport aux produits encaissables.
                </>
              ),
            },
            updateDate: new Date(),
            integrationURL: "/integration-url",
          }}
          options={autonomieOptions}
          legend={null}
        />
      ) : (
        <ChartWrapper
          config={{
            id: "efficience-chart",
            idQuery: "efficience",
            title: {
              className: "fr-mt-0w",
              look: "h5",
              size: "h3",
              fr: `Efficience : SCSP par étudiant vs Taux d'encadrement — ${selectedYear}`,
            },
            comment: {
              fr: (
                <>
                  Ce graphique analyse l'efficience des établissements en
                  croisant le SCSP par étudiant (financement public) avec le
                  taux d'encadrement (ratio emplois/étudiants). Les
                  établissements sont groupés par{" "}
                  {groupBy === "type" ? "type" : "région"}.
                </>
              ),
            },
            readingKey: {
              fr: (
                <>
                  Ce graphique analyse l'efficience des établissements en
                  croisant le SCSP par étudiant (financement public) avec le
                  taux d'encadrement (ratio emplois/étudiants).
                </>
              ),
            },
            updateDate: new Date(),
            integrationURL: "/integration-url",
          }}
          options={efficienceOptions}
          legend={null}
        />
      )}
    </div>
  );
}
