import { useMemo } from "react";
import DefaultSkeleton from "../../../../../../../components/charts-skeletons/default";
import {
  useFinanceAdvancedComparison,
  useFinanceYears,
} from "../../../../../api";
import { MetricKey } from "../../../../../config/metrics-config";
import ColumnRangeChart from "../../../../national/sections/analyse/charts/column-range";

interface PositioningColumnRangeProps {
  metricKey: MetricKey;
  currentStructureId?: string;
  currentStructure?: any;
  activeFilters?: {
    type?: string;
    typologie?: string;
    region?: string;
    rce?: string;
    devimmo?: string;
  };
}

export default function PositioningColumnRange({
  metricKey,
  currentStructureId,
  currentStructure,
  activeFilters = {},
}: PositioningColumnRangeProps) {
  const resolvedType =
    activeFilters.type === "same-type"
      ? currentStructure?.etablissement_actuel_type ||
      currentStructure?.type ||
      undefined
      : undefined;
  const resolvedTypologie =
    activeFilters.typologie === "same-typologie"
      ? currentStructure?.etablissement_actuel_typologie ||
      currentStructure?.typologie ||
      undefined
      : undefined;
  const resolvedRegion =
    activeFilters.region === "same-region"
      ? currentStructure?.etablissement_actuel_region ||
      currentStructure?.region ||
      undefined
      : undefined;

  const { data: yearsData, isLoading: yearsLoading } = useFinanceYears();

  const { data: allYearsData, isLoading: dataLoading } =
    useFinanceAdvancedComparison({
      type: resolvedType,
      typologie: resolvedTypologie,
      region: resolvedRegion,
    });

  const isLoading = yearsLoading || dataLoading;
  const availableYears: number[] = yearsData?.years ?? [];
  const rawItems: any[] = allYearsData?.items ?? [];

  const items = useMemo(() => {
    return rawItems.filter((item) => {
      const id = item.etablissement_id_paysage_actuel;
      if (currentStructureId && id === currentStructureId) return true;
      if (activeFilters.rce === "rce" && item.is_rce !== true) return false;
      if (activeFilters.rce === "non-rce" && item.is_rce === true) return false;
      if (activeFilters.devimmo === "devimmo" && item.is_devimmo !== true)
        return false;
      if (activeFilters.devimmo === "non-devimmo" && item.is_devimmo === true)
        return false;
      return true;
    });
  }, [rawItems, activeFilters.rce, activeFilters.devimmo, currentStructureId]);

  if (isLoading) return <DefaultSkeleton />;

  return (
    <ColumnRangeChart
      allYearsData={items}
      metricKey={metricKey}
      availableYears={availableYears}
      isLoading={false}
      currentStructureId={currentStructureId}
      initialTopN={null}
    />
  );
}
