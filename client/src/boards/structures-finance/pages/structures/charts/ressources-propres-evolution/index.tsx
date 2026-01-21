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

  const filteredData = useMemo(() => {
    if (!evolutionData) return [];
    return evolutionData.filter(
      (item: any) =>
        item.droits_d_inscription != null ||
        item.formation_continue_diplomes_propres_et_vae != null ||
        item.taxe_d_apprentissage != null ||
        item.valorisation != null ||
        item.anr_hors_investissements_d_avenir != null ||
        item.anr_investissements_d_avenir != null ||
        item.contrats_et_prestations_de_recherche_hors_anr != null ||
        item.subventions_de_la_region != null ||
        item.subventions_union_europeenne != null ||
        item.autres_ressources_propres != null ||
        item.autres_subventions != null
    );
  }, [evolutionData]);

  const options = useMemo(() => {
    if (!filteredData || filteredData.length === 0) return null;
    return createRessourcesPropresEvolutionChartOptions(filteredData);
  }, [filteredData]);

  const years = useMemo(() => {
    if (!filteredData || filteredData.length === 0) return [];
    return filteredData
      .map((d: any) => d.exercice)
      .sort((a: number, b: number) => a - b);
  }, [filteredData]);

  const periodText = useMemo(() => {
    if (years.length === 0) return "";
    if (years.length === 1) return String(years[0]);
    return `${years[0]} - ${years[years.length - 1]}`;
  }, [years]);

  if (!filteredData || filteredData.length === 0 || !options) {
    return null;
  }

  return (
    <ChartWrapper
      config={{
        id: "ressources-propres-evolution-chart",
        idQuery: "ressources-propres-evolution",
        title: {
          className: "fr-mt-0w",
          look: "h5",
          size: "h3",
          fr: (
            <>
              Évolution des ressources propres
              {etablissementName && ` — ${etablissementName}`}
            </>
          ),
        },
        comment: {
          fr: (
            <>
              Ce graphique présente l'évolution de la répartition des ressources
              propres de l'établissement sur la période {periodText}. Les barres
              empilées permettent de visualiser la contribution de chaque source
              de financement au fil des années.
            </>
          ),
        },
        integrationURL: "/integration-url",
      }}
      options={options}
      renderData={() => <RenderData data={filteredData} />}
    />
  );
}
