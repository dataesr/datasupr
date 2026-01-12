interface RenderDataProps {
  data: any[];
  metric: string;
  metricLabel: string;
  topN: number;
  format?: (value: number) => string;
}

export function RenderData({
  data,
  metric,
  metricLabel,
  topN,
  format,
}: RenderDataProps) {
  const chartData = data
    .filter((item: any) => {
      const value = item[metric];
      return value != null && !isNaN(value) && value > 0;
    })
    .map((item: any) => ({
      name: item.etablissement_lib || "Sans nom",
      value: item[metric],
    }))
    .sort((a, b) => b.value - a.value)
    .slice(0, topN);

  if (chartData.length === 0) {
    return (
      <div className="fr-text--center fr-py-3w">
        Aucune donnée disponible pour le tableau.
      </div>
    );
  }

  const formatValue = (value: number) => {
    if (format) {
      return format(value);
    }
    return value.toLocaleString("fr-FR");
  };

  return (
    <div className="fr-table--sm fr-table fr-table--bordered">
      <div className="fr-table__wrapper">
        <div className="fr-table__container">
          <div className="fr-table__content">
            <table id="comparison-bar-table" style={{ width: "100%" }}>
              <thead>
                <tr>
                  <th style={{ width: "10%" }}>Rang</th>
                  <th style={{ width: "60%" }}>Établissement</th>
                  <th style={{ width: "30%" }}>{metricLabel}</th>
                </tr>
              </thead>
              <tbody>
                {chartData.map((item, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{item.name}</td>
                    <td>{formatValue(item.value)}</td>
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
