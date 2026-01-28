import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import Highcharts from "highcharts";
import { useFinanceEtablissementEvolution } from "../../../../../../api/api";
import { createEffectifsDegreesChartOptions } from "./options";
import { RenderDataDegrees } from "./render-data";
import ChartWrapper from "../../../../../../../../components/chart-wrapper";

interface EffectifsDegreesChartProps {
  data?: any;
  selectedYear?: string | number;
  etablissementName?: string;
}

export default function EffectifsDegreesChart({
  data: propData,
  selectedYear: propSelectedYear,
  etablissementName,
}: EffectifsDegreesChartProps) {
  const [searchParams] = useSearchParams();
  const etablissementId = searchParams.get("structureId") || "";
  const selectedYear = propSelectedYear || searchParams.get("year") || "";

  const { data: evolutionData } = useFinanceEtablissementEvolution(
    etablissementId,
    !!etablissementId
  );

  const data = useMemo(() => {
    if (propData) return propData;
    if (!evolutionData || !selectedYear) return null;
    return evolutionData.find(
      (item: any) => String(item.exercice) === String(selectedYear)
    );
  }, [propData, evolutionData, selectedYear]);

  const options = useMemo(() => {
    if (!data) return {} as Highcharts.Options;
    return createEffectifsDegreesChartOptions(data);
  }, [data]);

  const etabName = etablissementName || data?.etablissement_lib || "";

  const config = {
    id: "effectifs-degrees",
    integrationURL: `/integration?chart_id=effectifs-degrees&structureId=${etablissementId}&year=${selectedYear}`,
    title: `Effectifs - Degrés d'étude${etabName ? ` — ${etabName}` : ""}${selectedYear ? ` — ${selectedYear}` : ""}`,
  };

  if (!data) return null;

  return (
    <ChartWrapper
      config={config}
      options={options}
      renderData={() => <RenderDataDegrees data={data} />}
    />
  );
}
