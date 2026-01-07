interface MetricConfig {
  label: string;
  format: "number" | "percent" | "decimal" | "euro";
  color: string;
  suffix?: string;
}

interface EvolutionData {
  exercice: number;
  [key: string]: any;
}

const formatValue = (value: any, format: string): string => {
  if (value == null) return "—";
  const numValue = typeof value === "number" ? value : parseFloat(value);
  if (isNaN(numValue)) return "—";

  switch (format) {
    case "euro":
      return `${numValue.toLocaleString("fr-FR", {
        maximumFractionDigits: 0,
      })} €`;
    case "percent":
      return `${numValue.toFixed(2)} %`;
    case "decimal":
      return numValue.toFixed(2);
    case "number":
    default:
      return numValue.toLocaleString("fr-FR", { maximumFractionDigits: 0 });
  }
};

interface RenderDataSingleProps {
  data: EvolutionData[];
  metricKey: string;
  metricConfig: MetricConfig;
}

export function RenderDataSingle({
  data,
  metricKey,
  metricConfig,
}: RenderDataSingleProps) {
  const sortedData = [...data].sort((a, b) => a.exercice - b.exercice);

  if (sortedData.length === 0) {
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
            <table id="evolution-single-table" style={{ width: "100%" }}>
              <thead>
                <tr>
                  <th style={{ width: "70%" }}>Année</th>
                  <th style={{ width: "30%" }}>{metricConfig.label}</th>
                </tr>
              </thead>
              <tbody>
                {sortedData.map((item, index) => (
                  <tr key={index}>
                    <td>{item.exercice}</td>
                    <td style={{ textAlign: "right" }}>
                      {formatValue(item[metricKey], metricConfig.format)}
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

interface RenderDataComparisonProps {
  data: EvolutionData[];
  metric1Key: string;
  metric1Config: MetricConfig;
  metric2Key: string;
  metric2Config: MetricConfig;
}

export function RenderDataComparison({
  data,
  metric1Key,
  metric1Config,
  metric2Key,
  metric2Config,
}: RenderDataComparisonProps) {
  const sortedData = [...data].sort((a, b) => a.exercice - b.exercice);

  if (sortedData.length === 0) {
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
            <table id="evolution-comparison-table" style={{ width: "100%" }}>
              <thead>
                <tr>
                  <th>Année</th>
                  <th>{metric1Config.label}</th>
                  <th>{metric2Config.label}</th>
                </tr>
              </thead>
              <tbody>
                {sortedData.map((item, index) => (
                  <tr key={index}>
                    <td>{item.exercice}</td>
                    <td>
                      {formatValue(item[metric1Key], metric1Config.format)}
                    </td>
                    <td>
                      {formatValue(item[metric2Key], metric2Config.format)}
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

interface RenderDataBase100Props {
  data: EvolutionData[];
  metric1Key: string;
  metric1Config: MetricConfig;
  metric2Key: string;
  metric2Config: MetricConfig;
}

export function RenderDataBase100({
  data,
  metric1Key,
  metric1Config,
  metric2Key,
  metric2Config,
}: RenderDataBase100Props) {
  const sortedData = [...data].sort((a, b) => a.exercice - b.exercice);

  if (sortedData.length === 0) {
    return (
      <div className="fr-text--center fr-py-3w">
        Aucune donnée disponible pour le tableau.
      </div>
    );
  }

  const baseValue1 = sortedData[0][metric1Key];
  const baseValue2 = sortedData[0][metric2Key];

  const tableData = sortedData.map((item) => {
    const value1 = item[metric1Key];
    const value2 = item[metric2Key];

    return {
      exercice: item.exercice,
      value1Original: value1,
      value2Original: value2,
      value1Base100:
        baseValue1 && typeof value1 === "number"
          ? (value1 / baseValue1) * 100
          : null,
      value2Base100:
        baseValue2 && typeof value2 === "number"
          ? (value2 / baseValue2) * 100
          : null,
    };
  });

  return (
    <div className="fr-table--sm fr-table fr-table--bordered">
      <div className="fr-table__wrapper">
        <div className="fr-table__container">
          <div className="fr-table__content">
            <table id="evolution-base100-table" style={{ width: "100%" }}>
              <thead>
                <tr>
                  <th rowSpan={2}>Année</th>
                  <th colSpan={2} style={{ textAlign: "center" }}>
                    {metric1Config.label}
                  </th>
                  <th colSpan={2} style={{ textAlign: "center" }}>
                    {metric2Config.label}
                  </th>
                </tr>
                <tr>
                  <th style={{ width: "20%" }}>Valeur</th>
                  <th style={{ width: "10%" }}>Base 100</th>
                  <th style={{ width: "20%" }}>Valeur</th>
                  <th style={{ width: "10%" }}>Base 100</th>
                </tr>
              </thead>
              <tbody>
                {tableData.map((item, index) => (
                  <tr key={index}>
                    <td>{item.exercice}</td>
                    <td>
                      {formatValue(item.value1Original, metric1Config.format)}
                    </td>
                    <td>
                      {item.value1Base100 != null
                        ? item.value1Base100.toFixed(1)
                        : "—"}
                    </td>
                    <td>
                      {formatValue(item.value2Original, metric2Config.format)}
                    </td>
                    <td>
                      {item.value2Base100 != null
                        ? item.value2Base100.toFixed(1)
                        : "—"}
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
