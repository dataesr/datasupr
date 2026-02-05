interface MetricConfig {
  label: string;
  format: "number" | "percent" | "decimal" | "euro";
  color: string;
  suffix?: string;
}

interface RenderDataProps {
  data: any[];
  metric: string;
  metricLabel: string;
  metricConfig: MetricConfig;
  currentStructureId?: string;
  currentStructureName?: string;
}

export function RenderData({
  data,
  metric,
  metricLabel,
  metricConfig,
  currentStructureId,
}: RenderDataProps) {
  const seenIds = new Set<string>();
  const uniqueData = data.filter((item) => {
    const itemId = item.etablissement_id_paysage_actuel;
    if (!itemId || seenIds.has(itemId)) return false;
    seenIds.add(itemId);
    return true;
  });

  const chartData = uniqueData
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
    })
    .sort((a, b) => b.value - a.value);

  if (chartData.length === 0) {
    return (
      <div className="fr-text--center fr-py-3w">
        Aucune donnée disponible pour le tableau.
      </div>
    );
  }

  const formatValue = (value: number) => {
    if (metricConfig.format === "euro") {
      return `${value.toLocaleString("fr-FR", { maximumFractionDigits: 0 })} €`;
    }
    if (metricConfig.format === "percent") {
      return `${value.toFixed(2)} %`;
    }
    if (metricConfig.format === "decimal") {
      return value.toFixed(2);
    }
    return value.toLocaleString("fr-FR", { maximumFractionDigits: 0 });
  };

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
                      {formatValue(item.value)}
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
