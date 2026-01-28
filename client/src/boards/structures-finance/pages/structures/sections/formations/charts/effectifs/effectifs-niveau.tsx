import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import Highcharts from "highcharts";
import { useFinanceEtablissementEvolution } from "../../../../../../api/api";
import { createEffectifsNiveauChartOptions } from "./options";
import { RenderDataNiveau } from "./render-data";
import ChartWrapper from "../../../../../../../../components/chart-wrapper";

interface EffectifsNiveauChartProps {
  data?: any;
  selectedYear?: string | number;
  etablissementName?: string;
}

export default function EffectifsNiveauChart({
  data: propData,
  selectedYear: propSelectedYear,
  etablissementName,
}: EffectifsNiveauChartProps) {
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
    return createEffectifsNiveauChartOptions(data);
  }, [data]);

  const etabName = etablissementName || data?.etablissement_lib || "";

  const config = {
    id: "effectifs-niveau",
    integrationURL: `/integration?chart_id=effectifs-niveau&structureId=${etablissementId}&year=${selectedYear}`,
    title: `Effectifs par cursus${etabName ? ` — ${etabName}` : ""}${selectedYear ? ` — ${selectedYear}` : ""}`,
  };

  if (!data) return null;

  return (
    <ChartWrapper
      config={config}
      options={options}
      renderData={() => <RenderDataNiveau data={data} />}
    />
  );
}
