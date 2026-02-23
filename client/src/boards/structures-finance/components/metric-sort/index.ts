export type MetricSens = "augmentation" | "diminution" | null;

export function sortByMetricSens<T extends { value: number }>(
  data: T[],
  sens: MetricSens
): T[] {
  return [...data].sort((a, b) => {
    if (sens === "augmentation") return a.value - b.value;
    if (sens === "diminution") return b.value - a.value;
    return b.value - a.value; // défaut : descendant
  });
}

export function calculateRank(
  values: number[],
  currentValue: number,
  sens: MetricSens
): number {
  const sortDesc = sens !== "diminution";
  const sorted = [...values].sort((a, b) => (sortDesc ? b - a : a - b));
  return sorted.indexOf(currentValue) + 1 || values.length;
}
