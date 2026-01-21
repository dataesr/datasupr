import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { SegmentedControl, SegmentedElement } from "@dataesr/dsfr-plus";
import { useFinanceEtablissementEvolution } from "./api";
import { createRessourcesPropresEvolutionChartOptions } from "./options";
import { RenderData } from "./render-data";
import ChartWrapper from "../../../../../../../../components/chart-wrapper";

interface RessourcesPropresEvolutionChartProps {
  etablissementId?: string;
  etablissementName?: string;
}

export default function RessourcesPropresEvolutionChart({
  etablissementId: propEtablissementId,
  etablissementName,
}: RessourcesPropresEvolutionChartProps) {
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
    return createRessourcesPropresEvolutionChartOptions(
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
    id: "ressourcesPropresEvolution",
    integrationURL: `/integration?chart_id=ressourcesPropresEvolution&structureId=${etablissementId}`,
    title: `Évolution des ressources propres${etabName ? ` — ${etabName}` : ""}`,
    comment: {
      fr: (
        <>
          Ce graphique présente l'évolution de la répartition des ressources
          propres de l'établissement sur la période {periodText}. Les barres
          empilées permettent de visualiser la contribution de chaque source de
          financement au fil des années.
        </>
      ),
    },
    readingKey: {
      fr: (
        <>
          {viewMode === "value" ? (
            <>
              Le graphique montre l'évolution des montants en euros pour chaque
              composante des ressources propres. Les colonnes empilées
              permettent de visualiser la composition totale et l'évolution de
              chaque source de financement dans le temps.
            </>
          ) : (
            <>
              Le graphique montre la répartition en pourcentage de chaque
              composante des ressources propres. Cette vue permet d'identifier
              les changements dans la structure des ressources de
              l'établissement au fil des années.
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
        <SegmentedControl name="ressources-propres-evolution-view">
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
