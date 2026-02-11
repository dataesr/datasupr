import { useSearchParams } from "react-router-dom";
import { type PositioningFilters } from "../../../hooks";
import { type AnalysisKey } from "../../../../../config/config";
import { type ChartView } from "../charts";

export function usePositioningParams() {
  const [searchParams, setSearchParams] = useSearchParams();

  const getParam = (key: string, defaultValue = "") =>
    searchParams.get(key) || defaultValue;

  const setParam = (key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams);
    value ? params.set(key, value) : params.delete(key);
    setSearchParams(params, { replace: true });
  };

  const filters: PositioningFilters = {
    type: getParam("filterType"),
    typologie: getParam("filterTypologie"),
    region: getParam("filterRegion"),
    rce: getParam("filterRce"),
    devimmo: getParam("filterDevimmo"),
  };

  const setFilters = (newFilters: PositioningFilters) => {
    const params = new URLSearchParams(searchParams);
    Object.entries(newFilters).forEach(([key, value]) => {
      const paramKey = `filter${key.charAt(0).toUpperCase()}${key.slice(1)}`;
      value ? params.set(paramKey, value) : params.delete(paramKey);
    });
    setSearchParams(params, { replace: true });
  };

  const selectedAnalysis = getParam(
    "analysis",
    "ressources-total"
  ) as AnalysisKey;
  const activeChart = getParam("chart", "comparison") as ChartView;

  return {
    filters,
    setFilters,
    selectedAnalysis,
    setSelectedAnalysis: (a: string | null) => setParam("analysis", a),
    activeChart,
    setActiveChart: (c: string | null) => setParam("chart", c),
  };
}
