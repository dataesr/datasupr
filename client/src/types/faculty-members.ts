export interface NavigationCardsProps {
  type: "fields" | "regions" | "structures";
  maxItems?: number;
}

export interface NavigationItem {
  id: string;
  name: string;
  total_count: number;
  region?: string;
}
