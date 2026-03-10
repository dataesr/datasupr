import type { ColumnRangePoint } from "./options";

interface MetricConfig {
  label: string;
  format: "number" | "percent" | "decimal" | "euro";
}

interface RenderDataVariationProps {
  points: ColumnRangePoint[];
  metricLabel: string;
  metricConfig: MetricConfig;
  yearFrom: string;
  yearTo: string;
}

const formatValue = (
  value: number,
  format: "number" | "percent" | "decimal" | "euro"
): string => {
  if (format === "euro") {
    return `${value.toLocaleString("fr-FR", { maximumFractionDigits: 0 })} €`;
  }
  if (format === "percent") {
    return `${value.toFixed(2)} %`;
  }
  if (format === "decimal") {
    return value.toFixed(2);
  }
  return value.toLocaleString("fr-FR", { maximumFractionDigits: 0 });
};

export function RenderDataVariation({
  points,
  metricLabel,
  metricConfig,
  yearFrom,
  yearTo,
}: RenderDataVariationProps) {
  if (points.length === 0) {
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
            <table style={{ width: "100%" }}>
              <thead>
                <tr>
                  <th style={{ width: "40%" }}>Établissement</th>
                  <th style={{ textAlign: "right" }}>
                    {metricLabel} ({yearFrom})
                  </th>
                  <th style={{ textAlign: "right" }}>
                    {metricLabel} ({yearTo})
                  </th>
                  <th style={{ textAlign: "right" }}>Variation</th>
                  <th style={{ textAlign: "right" }}>Variation (%)</th>
                </tr>
              </thead>
              <tbody>
                {points.map((p, index) => (
                  <tr key={index}>
                    <td>{p.name}</td>
                    <td style={{ textAlign: "right" }}>
                      {formatValue(p.valueFrom, metricConfig.format)}
                    </td>
                    <td style={{ textAlign: "right" }}>
                      {formatValue(p.valueTo, metricConfig.format)}
                    </td>
                    <td
                      style={{
                        textAlign: "right",
                        fontWeight: 700,
                        color:
                          p.variation >= 0
                            ? "var(--text-default-success)"
                            : "var(--text-default-error)",
                      }}
                    >
                      {p.variation >= 0 ? "+" : ""}
                      {formatValue(p.variation, metricConfig.format)}
                    </td>
                    <td
                      style={{
                        textAlign: "right",
                        fontWeight: 700,
                        color:
                          p.variation >= 0
                            ? "var(--text-default-success)"
                            : "var(--text-default-error)",
                      }}
                    >
                      {p.variation >= 0 ? "+" : ""}
                      {p.variationPct.toFixed(1)} %
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
