export type MetricStatusType = "alerte" | "vigilance" | "normal";

const VALID_STATUSES = new Set<string>(["alerte", "vigilance", "normal"]);

export function getMetricStatus(
  dataItem: Record<string, any> | undefined | null,
  metric: string
): MetricStatusType | null {
  if (!dataItem || !metric) return null;

  const status = dataItem[`${metric}_etat`];

  if (typeof status === "string" && VALID_STATUSES.has(status)) {
    return status as MetricStatusType;
  }

  return null;
}

export const STATUS_BADGE_CONFIG: Record<
  MetricStatusType,
  { className: string; label: string }
> = {
  alerte: { className: "fr-badge--error", label: "Alerte" },
  vigilance: { className: "fr-badge--warning", label: "Vigilance" },
  normal: { className: "fr-badge--success", label: "Normal" },
};
