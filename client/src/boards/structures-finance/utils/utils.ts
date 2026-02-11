// --- Shared types ---

export interface MetricConfig {
  label: string;
  format: "number" | "percent" | "decimal" | "euro";
  color: string;
  suffix?: string;
}

// --- Shared helpers ---

export function formatMetricValue(
  value: number | null | undefined,
  format: string
): string {
  if (value == null) return "—";
  if (format === "euro")
    return `${value.toLocaleString("fr-FR", { maximumFractionDigits: 0 })} €`;
  if (format === "percent") return `${value.toFixed(1)} %`;
  if (format === "decimal") return value.toFixed(2);
  return value.toLocaleString("fr-FR", { maximumFractionDigits: 0 });
}

export function deduplicateByPaysageId<T extends Record<string, any>>(
  data: T[]
): T[] {
  const seen = new Set<string>();
  return data.filter((item) => {
    const id = item.etablissement_id_paysage_actuel;
    if (!id || seen.has(id)) return false;
    seen.add(id);
    return true;
  });
}

export const normalizeString = (str: string): string => {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[-]/g, " ");
};
