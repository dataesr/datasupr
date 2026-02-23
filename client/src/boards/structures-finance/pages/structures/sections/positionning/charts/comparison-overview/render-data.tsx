import { formatMetricValue } from "../../../../../../utils/utils";
import type { OverviewDataset, ComparisonOverviewConfig } from "./options";

interface RenderDataProps {
  config: ComparisonOverviewConfig;
  datasets: OverviewDataset[];
  currentStructureId?: string;
}

export function RenderData({
  config,
  datasets,
  currentStructureId,
}: RenderDataProps) {
  const rows = datasets.map((ds) => {
    const values = ds.data
      .map((item) => item[config.metric])
      .filter((v) => v != null && !isNaN(v))
      .sort((a, b) => a - b);

    const currentItem = ds.data.find(
      (item) => item.etablissement_id_paysage_actuel === currentStructureId
    );
    const currentValue = currentItem?.[config.metric];

    const min = values[0] ?? null;
    const max = values[values.length - 1] ?? null;
    const median = values.length ? values[Math.floor(values.length / 2)] : null;

    let rank: number | null = null;
    if (currentValue != null && values.length) {
      rank = values.filter((v) => v > currentValue).length + 1;
    }

    return {
      label: ds.label,
      count: values.length,
      min,
      max,
      median,
      currentValue,
      rank,
    };
  });

  return (
    <div className="fr-table fr-table--bordered">
      <div className="fr-table__wrapper">
        <div className="fr-table__container">
          <div className="fr-table__content">
            <table style={{ width: "100%" }}>
              <thead>
                <tr>
                  <th>Groupe</th>
                  <th style={{ textAlign: "right" }}>Effectif</th>
                  <th style={{ textAlign: "right" }}>Min</th>
                  <th style={{ textAlign: "right" }}>Médiane</th>
                  <th style={{ textAlign: "right" }}>Max</th>
                  <th style={{ textAlign: "right" }}>Valeur</th>
                  <th style={{ textAlign: "right" }}>Rang</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row.label}>
                    <td>{row.label}</td>
                    <td style={{ textAlign: "right" }}>{row.count}</td>
                    <td style={{ textAlign: "right" }}>
                      {row.min != null
                        ? formatMetricValue(row.min, config.format)
                        : "—"}
                    </td>
                    <td style={{ textAlign: "right" }}>
                      {row.median != null
                        ? formatMetricValue(row.median, config.format)
                        : "—"}
                    </td>
                    <td style={{ textAlign: "right" }}>
                      {row.max != null
                        ? formatMetricValue(row.max, config.format)
                        : "—"}
                    </td>
                    <td
                      style={{
                        textAlign: "right",
                        fontWeight: 700,
                        color: "var(--text-default-error)",
                      }}
                    >
                      {row.currentValue != null
                        ? formatMetricValue(row.currentValue, config.format)
                        : "—"}
                    </td>
                    <td style={{ textAlign: "right", fontWeight: 700 }}>
                      {row.rank != null ? `${row.rank} / ${row.count}` : "—"}
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
