import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { SegmentedControl, SegmentedElement } from "@dataesr/dsfr-plus";
import { useFinanceEtablissementEvolution } from "../../../../../../api/api";
import { createRessourcesRechercheDecompositionChartOptions } from "./options";
import { RenderData } from "./render-data";
import ChartWrapper from "../../../../../../../../components/chart-wrapper";

interface RessourcesRechercheDecompositionChartProps {
  etablissementId?: string;
  etablissementName?: string;
}

export default function RessourcesRechercheDecompositionChart({
  etablissementId: propEtablissementId,
  etablissementName,
}: RessourcesRechercheDecompositionChartProps) {
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
    return createRessourcesRechercheDecompositionChartOptions(
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
    id: "ressourcesRechercheDecomposition",
    integrationURL: `/integration?chart_id=ressourcesRechercheDecomposition&structureId=${etablissementId}`,
    title: `Décomposition des ressources recherche${etabName ? ` — ${etabName}` : ""}`,
    comment: {
      fr: (
        <>
          Ce graphique présente la décomposition des ressources recherche de
          l'établissement entre valorisation, ANR et contrats de recherche sur
          la période {periodText}.
        </>
      ),
    },
    readingKey: {
      fr: (
        <>
          {viewMode === "value" ? (
            <>
              Le graphique montre l'évolution des montants en euros pour chaque
              composante des ressources recherche.
            </>
          ) : (
            <>
              Le graphique montre la répartition en pourcentage de chaque
              composante des ressources recherche.
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
          name="ressources-recherche-decomposition-view"
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
