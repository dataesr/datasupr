interface RecettesEvolutionData {
  exercice: number;
  droits_d_inscription?: number;
  formation_continue_diplomes_propres_et_vae?: number;
  taxe_d_apprentissage?: number;
  valorisation?: number;
  anr_hors_investissements_d_avenir?: number;
  anr_investissements_d_avenir?: number;
  contrats_et_prestations_de_recherche_hors_anr?: number;
  subventions_de_la_region?: number;
  subventions_union_europeenne?: number;
  autres_ressources_propres?: number;
  autres_subventions?: number;
  ressources_propres?: number;
}

const formatEuro = (value: number): string => {
  return `${value.toLocaleString("fr-FR", { maximumFractionDigits: 0 })} €`;
};

const formatPercent = (value: number): string => {
  return `${value.toFixed(2)} %`;
};

interface RenderDataProps {
  data: RecettesEvolutionData[];
  mode: "value" | "percentage";
}

export function RenderData({ data, mode }: RenderDataProps) {
  const sortedData = [...data].sort((a, b) => a.exercice - b.exercice);

  if (sortedData.length === 0) {
    return (
      <div className="fr-text--center fr-py-3w">
        Aucune donnée disponible pour le tableau.
      </div>
    );
  }

  const metrics = [
    { key: "droits_d_inscription", label: "Droits d'inscription" },
    {
      key: "formation_continue_diplomes_propres_et_vae",
      label: "Formation continue",
    },
    { key: "taxe_d_apprentissage", label: "Taxe d'apprentissage" },
    { key: "valorisation", label: "Valorisation" },
    { key: "anr_hors_investissements_d_avenir", label: "ANR hors IA" },
    {
      key: "anr_investissements_d_avenir",
      label: "ANR Investissements d'avenir",
    },
    {
      key: "contrats_et_prestations_de_recherche_hors_anr",
      label: "Contrats recherche hors ANR",
    },
    { key: "subventions_de_la_region", label: "Subventions région" },
    { key: "subventions_union_europeenne", label: "Subventions UE" },
    { key: "autres_ressources_propres", label: "Autres ressources propres" },
    { key: "autres_subventions", label: "Autres subventions" },
  ];

  return (
    <div className="fr-table--sm fr-table fr-table--bordered">
      <div className="fr-table__wrapper">
        <div className="fr-table__container">
          <div className="fr-table__content">
            <table id="recettes-evolution-table" style={{ width: "100%" }}>
              <thead>
                <tr>
                  <th>Année</th>
                  {metrics.map((metric) => (
                    <th key={metric.key}>{metric.label}</th>
                  ))}
                  <th style={{ fontWeight: "bold" }}>
                    Total ressources propres
                  </th>
                </tr>
              </thead>
              <tbody>
                {sortedData.map((item, index) => {
                  const total = item.ressources_propres || 0;

                  return (
                    <tr key={index}>
                      <td style={{ fontWeight: "bold" }}>{item.exercice}</td>
                      {metrics.map((metric) => {
                        const value =
                          (item[
                            metric.key as keyof RecettesEvolutionData
                          ] as number) || 0;

                        if (mode === "value") {
                          return <td key={metric.key}>{formatEuro(value)}</td>;
                        } else {
                          const percentage =
                            total > 0 ? (value / total) * 100 : 0;
                          return (
                            <td key={metric.key} title={formatEuro(value)}>
                              {formatPercent(percentage)}
                            </td>
                          );
                        }
                      })}
                      <td style={{ fontWeight: "bold" }}>
                        {mode === "value"
                          ? formatEuro(total)
                          : formatPercent(100)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
