import { useMemo } from "react";

export type Predicate = (item: any) => boolean;

export interface OptionField {
  key: string;
  field: string;
  selected: string;
  predicate?: (selected: string) => Predicate;
  sort?: (a: string, b: string) => number;
}

const sortUniversitiesFirst = (a: string, b: string) => {
  const aIsUniv =
    a.toLowerCase().includes("université") ||
    a.toLowerCase().includes("universite");
  const bIsUniv =
    b.toLowerCase().includes("université") ||
    b.toLowerCase().includes("universite");
  if (aIsUniv && !bIsUniv) return -1;
  if (!aIsUniv && bIsUniv) return 1;
  return a.localeCompare(b, "fr", { sensitivity: "base" });
};

const sortLocale = (a: string, b: string) =>
  a.localeCompare(b, "fr", { sensitivity: "base" });

export { sortUniversitiesFirst, sortLocale };

export function useAvailableOptions(
  allItems: any[],
  fields: OptionField[]
): Record<string, string[]> {
  return useMemo(() => {
    const result: Record<string, string[]> = {};
    if (!allItems.length) {
      fields.forEach((f) => (result[f.key] = []));
      return result;
    }

    fields.forEach((target) => {
      const itemsToConsider = allItems.filter((item) =>
        fields.every((other) => {
          if (other.key === target.key || !other.selected) return true;
          if (other.predicate) return other.predicate(other.selected)(item);
          return item[other.field] === other.selected;
        })
      );

      const values = new Set<string>();
      itemsToConsider.forEach((item) => {
        if (item[target.field]) values.add(item[target.field]);
      });

      result[target.key] = Array.from(values).sort(
        target.sort ?? sortLocale
      );
    });

    return result;
  }, [allItems, ...fields.map((f) => f.selected)]);
}
