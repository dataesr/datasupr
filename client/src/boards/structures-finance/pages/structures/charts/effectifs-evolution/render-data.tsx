interface EvolutionData {
  exercice: number;
  [key: string]: any;
}

interface CategoryConfig {
  label: string;
  color: string;
}

const formatValue = (value: any): string => {
  if (value == null) return "—";
  const numValue = typeof value === "number" ? value : parseFloat(value);
  if (isNaN(numValue)) return "—";
  return numValue.toLocaleString("fr-FR", { maximumFractionDigits: 0 });
};

interface RenderDataStackedProps {
  data: EvolutionData[];
  metrics: string[];
  categories: Record<string, CategoryConfig>;
}

export function RenderDataStacked({
  data,
  metrics,
  categories,
}: RenderDataStackedProps) {
  const sortedData = [...data].sort((a, b) => a.exercice - b.exercice);

  // Filtrer les métriques qui ont des données
  const activeMetrics = metrics.filter((metricKey) =>
    sortedData.some((item) => {
      const value = item[metricKey];
      return value != null && value !== 0;
    })
  );

  if (sortedData.length === 0 || activeMetrics.length === 0) {
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
            <table id="effectifs-evolution-table" style={{ width: "100%" }}>
              <thead>
                <tr>
                  <th>Année</th>
                  {activeMetrics.map((metricKey) => (
                    <th key={metricKey} style={{ textAlign: "right" }}>
                      {categories[metricKey]?.label || metricKey}
                    </th>
                  ))}
                  <th style={{ textAlign: "right" }}>Total</th>
                </tr>
              </thead>
              <tbody>
                {sortedData.map((item, index) => {
                  const total = activeMetrics.reduce((acc, metricKey) => {
                    const value = item[metricKey];
                    return (
                      acc + (typeof value === "number" && value > 0 ? value : 0)
                    );
                  }, 0);

                  return (
                    <tr key={index}>
                      <td>{item.exercice}</td>
                      {activeMetrics.map((metricKey) => (
                        <td key={metricKey} style={{ textAlign: "right" }}>
                          {formatValue(item[metricKey])}
                        </td>
                      ))}
                      <td style={{ textAlign: "right", fontWeight: "bold" }}>
                        {formatValue(total)}
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
