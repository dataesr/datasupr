import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { SegmentedControl, SegmentedElement } from "@dataesr/dsfr-plus";
import { useFinanceEtablissementEvolution } from "../../../../../../api/api";
import { createRessourcesFormationDecompositionChartOptions } from "./options";
import { RenderData } from "./render-data";
import ChartWrapper from "../../../../../../../../components/chart-wrapper";

interface RessourcesFormationDecompositionChartProps {
  etablissementId?: string;
  etablissementName?: string;
}

export default function RessourcesFormationDecompositionChart({
  etablissementId: propEtablissementId,
  etablissementName,
}: RessourcesFormationDecompositionChartProps) {
  const [searchParams] = useSearchParams();
  const etablissementId =
    propEtablissementId || searchParams.get("structureId") || "";
  const [viewMode, setViewMode] = useState<"value" | "percentage">("value");

  const { data: evolutionData } = useFinanceEtablissementEvolution(
    etablissementId,
    !!etablissementId
  );

  const options = useMemo(() => {
    if (!evolutionData || evolutionData.length === 0) return null;
    return createRessourcesFormationDecompositionChartOptions(
      evolutionData,
      viewMode
    );
  }, [evolutionData, viewMode]);

  const years = useMemo(() => {
    if (!evolutionData || evolutionData.length === 0) return [];
    return evolutionData
      .map((d: any) => d.exercice)
      .filter((y: any) => typeof y === "number")
      .sort((a: number, b: number) => a - b);
  }, [evolutionData]);

  const periodText =
    years.length === 0
      ? ""
      : years.length === 1
        ? String(years[0])
        : `${years[0]} - ${years[years.length - 1]}`;

  const etabName =
    etablissementName || evolutionData?.[0]?.etablissement_lib || "";

  const config = {
    id: "ressourcesFormationDecomposition",
    integrationURL: `/integration?chart_id=ressourcesFormationDecomposition&structureId=${etablissementId}`,
    title: `Décomposition des ressources formation${etabName ? ` — ${etabName}` : ""}`,
    comment: {
      fr: (
        <>
          Ce graphique présente la décomposition des ressources formation de
          l'établissement entre droits d'inscription, formation continue et taxe
          d'apprentissage sur la période {periodText}.
        </>
      ),
    },
    readingKey: {
      fr: (
        <>
          {viewMode === "value" ? (
            <>
              Le graphique montre l'évolution des montants en euros pour chaque
              composante des ressources formation. Les colonnes empilées
              permettent de visualiser la composition totale au fil des années.
            </>
          ) : (
            <>
              Le graphique montre la répartition en pourcentage de chaque
              composante des ressources formation.
            </>
          )}
        </>
      ),
    },
  };

  if (!evolutionData || evolutionData.length === 0 || !options) {
    return null;
  }

  return (
    <div>
      <div className="fr-mb-2w">
        <SegmentedControl
          className="fr-segmented--sm"
          name="ressources-formation-decomposition-view"
        >
          <SegmentedElement
            checked={viewMode === "value"}
            label="Valeurs"
            onClick={() => setViewMode("value")}
            value="value"
          />
          <SegmentedElement
            checked={viewMode === "percentage"}
            label="Parts (%)"
            onClick={() => setViewMode("percentage")}
            value="percentage"
          />
        </SegmentedControl>
      </div>

      <ChartWrapper
        config={config}
        options={options}
        renderData={() => <RenderData data={evolutionData} />}
      />
    </div>
  );
}
