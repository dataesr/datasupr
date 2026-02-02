import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import ChartWrapper from "../../../../../../../../components/chart-wrapper";
import { createPositioningScatterOptions, ScatterConfig } from "./options";
import { RenderData } from "./render-data";
import { useFinanceAdvancedComparison } from "../../../../../../api/api";
import { usePositioningFilteredData } from "../../hooks/usePositioningFilteredData";
import DefaultSkeleton from "../../../../../../../../components/charts-skeletons/default";

interface PositioningScatterChartProps {
  config?: ScatterConfig;
  data?: any[];
  currentStructureId?: string;
  currentStructureName?: string;
}

export default function PositioningScatterChart({
  config: propConfig,
  data: propData,
  currentStructureId: propCurrentStructureId,
  currentStructureName: propCurrentStructureName,
}: PositioningScatterChartProps) {
  const [searchParams] = useSearchParams();
  const structureId = searchParams.get("structureId") || "";
  const selectedYear = searchParams.get("year") || "";
  const positioningChart = searchParams.get("positioningChart") || "comparison";
  const xMetricParam = searchParams.get("xMetric") || "";
  const yMetricParam = searchParams.get("yMetric") || "";

  const filterParams = new URLSearchParams();
  const positioningType = searchParams.get("positioningType");
  const positioningTypologie = searchParams.get("positioningTypologie");
  const positioningRegion = searchParams.get("positioningRegion");
  const positioningRce = searchParams.get("positioningRce");
  const positioningDevimmo = searchParams.get("positioningDevimmo");

  if (positioningType) filterParams.set("positioningType", positioningType);
  if (positioningTypologie)
    filterParams.set("positioningTypologie", positioningTypologie);
  if (positioningRegion)
    filterParams.set("positioningRegion", positioningRegion);
  if (positioningRce) filterParams.set("positioningRce", positioningRce);
  if (positioningDevimmo)
    filterParams.set("positioningDevimmo", positioningDevimmo);

  const defaultConfig: ScatterConfig = {
    title: `Graphique de positionnement${selectedYear ? ` — ${selectedYear}` : ""}`,
    xMetric: xMetricParam || "produits_de_fonctionnement_encaissables",
    yMetric: yMetricParam || "effectif_sans_cpge",
    xLabel: "Axe X",
    yLabel: "Axe Y",
  };
  const config = propConfig || defaultConfig;

  const { data: apiData, isLoading } = useFinanceAdvancedComparison(
    {
      annee: selectedYear,
      type: "",
      typologie: "",
      region: "",
    },
    !propData && !!selectedYear
  );

  const allItems = useMemo(() => {
    if (propData) return propData;
    if (!apiData || !apiData.items) return [];
    return apiData.items;
  }, [propData, apiData]);

  const filters = useMemo(
    () => ({
      type: positioningType || "",
      typologie: positioningTypologie || "",
      region: positioningRegion || "",
      rce: positioningRce || "",
      devimmo: positioningDevimmo || "",
    }),
    [
      positioningType,
      positioningTypologie,
      positioningRegion,
      positioningRce,
      positioningDevimmo,
    ]
  );

  const data = usePositioningFilteredData(allItems, null, filters);

  const currentStructureId = propCurrentStructureId || structureId;
  const currentStructureName = propCurrentStructureName || "";

  const chartOptions = useMemo(() => {
    if (!data || !Array.isArray(data)) {
      return {};
    }
    return createPositioningScatterOptions(
      config,
      data,
      currentStructureId,
      currentStructureName
    );
  }, [config, data, currentStructureId, currentStructureName]);

  const chartKey = useMemo(() => {
    if (!data || !Array.isArray(data))
      return `${config.xMetric}-${config.yMetric}`;
    const dataIds = data
      .map((d) => d?.etablissement_id_paysage_actuel)
      .sort()
      .join(",");
    return `${config.xMetric}-${config.yMetric}-${currentStructureId}-${dataIds}`;
  }, [config.xMetric, config.yMetric, currentStructureId, data]);

  if (isLoading) {
    return (
      <div>
        <DefaultSkeleton />
      </div>
    );
  }

  if (!data || !Array.isArray(data) || data.length === 0) {
    return (
      <div className="fr-alert fr-alert--warning">
        <p className="fr-alert__title">Aucune donnée disponible</p>
        <p>Aucune donnée n'est disponible pour ce graphique.</p>
      </div>
    );
  }

  const chartConfig = {
    id: `positioning-scatter-${config.xMetric}-${config.yMetric}`,
    integrationURL: `/integration?chart_id=positioning-scatter&structureId=${structureId}&year=${selectedYear}&xMetric=${config.xMetric}&yMetric=${config.yMetric}&chart=${positioningChart}&${filterParams.toString()}`,
    title: `${config.title}${currentStructureName ? ` — ${currentStructureName}` : ""}`,
  };

  return (
    <ChartWrapper
      key={chartKey}
      config={chartConfig}
      options={chartOptions}
      renderData={() => (
        <RenderData
          config={config}
          data={data}
          currentStructureId={currentStructureId}
          currentStructureName={currentStructureName}
        />
      )}
    />
  );
}
