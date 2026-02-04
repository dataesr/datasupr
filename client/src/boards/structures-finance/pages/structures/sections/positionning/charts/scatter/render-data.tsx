import { ScatterConfig } from "./options";
import "./render-data.scss";

interface RenderDataProps {
  config: ScatterConfig;
  data: any[];
  currentStructureId?: string;
  currentStructureName?: string;
}

export function RenderData({
  config,
  data,
  currentStructureId,
}: RenderDataProps) {
  const tableData = data
    .filter(
      (item) => item[config.xMetric] != null && item[config.yMetric] != null
    )
    .map((item) => {
      const itemId =
        item.etablissement_id_paysage_actuel || item.etablissement_id_paysage;
      const isCurrentStructure =
        currentStructureId &&
        (itemId === currentStructureId ||
          item.etablissement_id_paysage === currentStructureId);

      return {
        name:
          item.etablissement_actuel_lib ||
          item.etablissement_lib ||
          "Établissement inconnu",
        region:
          item.etablissement_actuel_region || item.region || "Non spécifié",
        type: item.etablissement_actuel_type || item.type || "Non spécifié",
        xValue: item[config.xMetric],
        yValue: item[config.yMetric],
        isCurrentStructure,
      };
    })
    .sort((a, b) => {
      if (a.isCurrentStructure && !b.isCurrentStructure) return -1;
      if (!a.isCurrentStructure && b.isCurrentStructure) return 1;
      return b.yValue - a.yValue;
    });

  if (tableData.length === 0) {
    return (
      <div className="fr-text--center fr-py-3w">
        Aucune donnée disponible pour le tableau.
      </div>
    );
  }

  const formatNumber = (value: number) => {
    return value.toLocaleString("fr-FR", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    });
  };

  return (
    <div className="fr-table--sm fr-table fr-table--bordered">
      <div className="fr-table__wrapper">
        <div className="fr-table__container">
          <div className="fr-table__content">
            <table id="positioning-scatter-table">
              <thead>
                <tr>
                  <th>Établissement</th>
                  <th>Région</th>
                  <th>Type</th>
                  <th>{config.xLabel}</th>
                  <th>{config.yLabel}</th>
                </tr>
              </thead>
              <tbody>
                {tableData.map((item, index) => (
                  <tr
                    key={index}
                    className={item.isCurrentStructure ? "highlighted-row" : ""}
                  >
                    <td>{item.name}</td>
                    <td>{item.region}</td>
                    <td>{item.type}</td>
                    <td>{formatNumber(item.xValue)}</td>
                    <td>{formatNumber(item.yValue)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
