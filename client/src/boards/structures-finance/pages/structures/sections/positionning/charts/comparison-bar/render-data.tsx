import {
  formatMetricValue,
  deduplicateByPaysageId,
  type MetricConfig,
} from "../../../../../../utils/utils";
import {
  sortByMetricSens,
  type MetricSens,
} from "../../../../../../components/metric-sort";

interface RenderDataProps {
  data: any[];
  metric: string;
  metricLabel: string;
  metricConfig: MetricConfig;
  metricSens?: MetricSens;
  currentStructureId?: string;
  currentStructureName?: string;
}

export function RenderData({
  data,
  metric,
  metricLabel,
  metricConfig,
  metricSens,
  currentStructureId,
}: RenderDataProps) {
  const uniqueData = deduplicateByPaysageId(data);

  const filtered = uniqueData
    .map((item: any) => {
      const itemId = item.etablissement_id_paysage_actuel;
      const isCurrentStructure =
        currentStructureId && itemId === currentStructureId;

      return {
        name:
          item.etablissement_actuel_lib || item.etablissement_lib || "Sans nom",
        value: item[metric] || 0,
        isCurrentStructure,
      };
    })
    .filter((d) => {
      const value = d.value;
      return value != null && !isNaN(value);
    });

  const chartData = sortByMetricSens(filtered, metricSens ?? null);

  if (chartData.length === 0) {
    return (
      <div className="fr-text--center fr-py-3w">
        Aucune donnée disponible pour le tableau.
      </div>
    );
  }

  return (
    <div className="fr-table--sm fr-table fr-table--bordered">
      <div className="fr-table__wrapper">
        <div className="fr-table__container">
          <div className="fr-table__content">
            <table
              id="positioning-comparison-bar-table"
              style={{ width: "100%" }}
            >
              <thead>
                <tr>
                  <th style={{ width: "10%" }}>Rang</th>
                  <th style={{ width: "60%" }}>Établissement</th>
                  <th style={{ width: "30%" }}>{metricLabel}</th>
                </tr>
              </thead>
              <tbody>
                {chartData.map((item, index) => (
                  <tr
                    key={index}
                    className={
                      item.isCurrentStructure
                        ? "positioning-comparison-bar__highlighted-row"
                        : ""
                    }
                  >
                    <td>{index + 1}</td>
                    <td>{item.name}</td>
                    <td style={{ textAlign: "right" }}>
                      {formatMetricValue(item.value, metricConfig.format)}
                    </td>
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
