import { useMemo, useState } from "react";
import { Button } from "@dataesr/dsfr-plus";
import { useFinanceEtablissementEvolution } from "../../../../api";
import ChartWrapper from "../../../../../../components/chart-wrapper";
import { createRecettesEvolutionChartOptions } from "./options";
import { RenderData } from "./render-data";
import { CHART_COLORS } from "../../../../constants/colors";

interface RecettesEvolutionChartProps {
  etablissementId: string;
  etablissementName: string;
}

export default function RecettesEvolutionChart({
  etablissementId,
  etablissementName,
}: RecettesEvolutionChartProps) {
  const [viewMode, setViewMode] = useState<"value" | "percentage">("value");

  const { data: evolutionData, isLoading } = useFinanceEtablissementEvolution(
    etablissementId,
    !!etablissementId
  );

  const recettesData = useMemo(() => {
    if (!evolutionData || !Array.isArray(evolutionData)) return [];

    return evolutionData.map((item: any) => ({
      exercice: item.exercice,
      droits_d_inscription: item.droits_d_inscription || 0,
      formation_continue_diplomes_propres_et_vae:
        item.formation_continue_diplomes_propres_et_vae || 0,
      taxe_d_apprentissage: item.taxe_d_apprentissage || 0,
      valorisation: item.valorisation || 0,
      anr_hors_investissements_d_avenir:
        item.anr_hors_investissements_d_avenir || 0,
      anr_investissements_d_avenir: item.anr_investissements_d_avenir || 0,
      contrats_et_prestations_de_recherche_hors_anr:
        item.contrats_et_prestations_de_recherche_hors_anr || 0,
      subventions_de_la_region: item.subventions_de_la_region || 0,
      subventions_union_europeenne: item.subventions_union_europeenne || 0,
      autres_ressources_propres: item.autres_ressources_propres || 0,
      autres_subventions: item.autres_subventions || 0,
      ressources_propres: item.ressources_propres || 0,
    }));
  }, [evolutionData]);

  const chartOptions = useMemo(() => {
    if (!recettesData.length) return {} as any;
    return createRecettesEvolutionChartOptions(recettesData, viewMode);
  }, [recettesData, viewMode]);

  if (isLoading) {
    return (
      <div className="fr-alert fr-alert--info">
        <p>Chargement des données d'évolution...</p>
      </div>
    );
  }

  if (!recettesData.length) {
    return (
      <div className="fr-alert fr-alert--warning">
        <p>Aucune donnée d'évolution disponible pour cet établissement.</p>
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
        <h3
          className="fr-h5 fr-mb-0"
          style={{
            borderLeft: `4px solid ${CHART_COLORS.primary}`,
            paddingLeft: "1rem",
          }}
        ></h3>
        <div className="fr-btns-group fr-btns-group--sm fr-btns-group--inline">
          <Button size="sm" variant={viewMode === "value" ? "primary" : "secondary"} onClick={() => setViewMode("value")}>
            Valeurs
          </Button>
          <Button size="sm" variant={viewMode === "percentage" ? "primary" : "secondary"} onClick={() => setViewMode("percentage")}>
            Parts (%)
          </Button>
        </div>
      </div>

      <ChartWrapper
        config={{
          id: "recettes-evolution-chart",
          idQuery: "recettes-evolution",
          title: {
            className: "fr-mt-0w",
            look: "h5",
            size: "h3",
            fr: (
              <>
                Évolution temporelle des ressources propres
                {etablissementName && ` — ${etablissementName}`}
              </>
            ),
          },
          comment: {
            fr: (
              <>
                Ce graphique présente l'évolution de la décomposition des ressources propres de l'établissement au fil des exercices. Les ressources
                propres comprennent les droits d'inscription, la formation continue, la taxe d'apprentissage, la valorisation, les financements ANR,
                les contrats de recherche, les subventions européennes et régionales, et autres.
              </>
            ),
          },
          readingKey: {
            fr: (
              <>
                {viewMode === "value" ? (
                  <>
                    Le graphique montre l'évolution des montants en euros pour chaque composante des ressources propres. Les colonnes empilées
                    permettent de visualiser la composition totale et l'évolution de chaque source de financement dans le temps.
                  </>
                ) : (
                  <>
                    Le graphique montre la répartition en pourcentage de chaque composante des ressources propres. Cette vue permet d'identifier les
                    changements dans la structure des ressources propres de l'établissement au fil des années.
                  </>
                )}
              </>
            ),
          },
          updateDate: new Date(),
          integrationURL: "/integration-url",
        }}
        options={chartOptions}
        renderData={() => <RenderData data={recettesData} mode={viewMode} />}
      />
    </div>
  );
}
