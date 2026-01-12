import { ScatterConfig } from "./options";

interface RenderDataProps {
  config: ScatterConfig;
  data: any[];
}

export function RenderData({ config, data }: RenderDataProps) {
  const tableData = data
    .filter(
      (item) => item[config.xMetric] != null && item[config.yMetric] != null
    )
    .map((item) => ({
      name: item.etablissement_lib || "Établissement inconnu",
      region: item.region || "Non spécifié",
      type: item.type || "Non spécifié",
      xValue: item[config.xMetric],
      yValue: item[config.yMetric],
    }))
    .sort((a, b) => b.yValue - a.yValue);

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
            <table id="scatter-table" style={{ width: "100%" }}>
              <thead>
                <tr>
                  <th style={{ width: "35%" }}>Établissement</th>
                  <th style={{ width: "15%" }}>Région</th>
                  <th style={{ width: "15%" }}>Type</th>
                  <th style={{ width: "17.5%" }}>{config.xLabel}</th>
                  <th style={{ width: "17.5%" }}>{config.yLabel}</th>
                </tr>
              </thead>
              <tbody>
                {tableData.map((item, index) => (
                  <tr key={index}>
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
