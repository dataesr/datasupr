import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { useFinanceEtablissementEvolution } from "./api";
import { createRessourcesPropresEvolutionChartOptions } from "./options";
import { RenderData } from "./render-data";
import ChartWrapper from "../../../../../../components/chart-wrapper";

interface RessourcesPropresEvolutionChartProps {
  etablissementName?: string;
}

export default function RessourcesPropresEvolutionChart({
  etablissementName,
}: RessourcesPropresEvolutionChartProps) {
  const [searchParams] = useSearchParams();
  const etablissementId = searchParams.get("structureId") || "";

  const { data: evolutionData } =
    useFinanceEtablissementEvolution(etablissementId);

  const options = useMemo(() => {
    if (!evolutionData || evolutionData.length === 0) return null;
    return createRessourcesPropresEvolutionChartOptions(evolutionData);
  }, [evolutionData]);

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

  const config = {
    id: "ressourcesPropresEvolution",
    integrationURL: `/integration?chart_id=ressourcesPropresEvolution&structureId=${etablissementId}`,
    title: `Évolution des ressources propres${etablissementName ? ` — ${etablissementName}` : ""}`,
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
  };

  if (!evolutionData || evolutionData.length === 0 || !options) {
    return null;
  }

  return (
    <ChartWrapper
      config={config}
      options={options}
      renderData={() => <RenderData data={evolutionData} />}
    />
  );
}
