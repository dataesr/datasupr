import RessourcesPropresChart from "../../charts/ressources-propres";
import EffectifsChart from "../../charts/effectifs";

interface DetailedChartsProps {
  data: any;
  selectedYear?: string | number;
  etablissementName?: string;
}

export default function DetailedCharts({
  data,
  selectedYear,
  etablissementName,
}: DetailedChartsProps) {
  if (!data) return null;

  return (
    <div>
      <RessourcesPropresChart
        data={data}
        selectedYear={selectedYear}
        etablissementName={etablissementName}
      />

      <EffectifsChart
        data={data}
        selectedYear={selectedYear}
        etablissementName={etablissementName}
      />
    </div>
  );
}
