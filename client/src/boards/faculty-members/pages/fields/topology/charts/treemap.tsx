import { CreateChartOptions } from "../../../../components/chart-faculty-members";
import ChartWrapper from "../../../../components/chart-wrapper";

interface TreemapData {
  id: string;
  name: string;
  value: number;
  colorValue: number;
  maleCount: number;
  femaleCount: number;
}

interface TreemapChartProps {
  data: TreemapData[];
  title?: string;
  year: string;
  isLoading?: boolean;
}

export function TreemapChart({
  data,
  title = "Répartition des effectifs par discipline",
  year,
  isLoading = false,
}: TreemapChartProps) {
  if (isLoading) {
    return (
      <div className="fr-text--center fr-py-3w">Chargement des données...</div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="fr-text--center fr-py-3w">
        Aucune donnée disponible pour cette année
      </div>
    );
  }

  const treemapOptions = CreateChartOptions("treemap", {
    chart: {
      type: "treemap",
      height: 600,
    },
    title: {
      text: title,
    },
    subtitle: {
      text: `Année académique ${year}`,
    },
    tooltip: {
      formatter: function () {
        const point = this.point as unknown as TreemapData;
        const femalePercent = point.femaleCount
          ? Math.round(
              (point.femaleCount / (point.femaleCount + point.maleCount)) * 100
            )
          : 0;
        return `<b>${point.name}</b><br>
               Effectif total: <b>${point.value}</b> personnes<br>
               <span style="color:#EB7369">Femmes: ${
                 point.femaleCount
               } (${femalePercent}%)</span><br>
               <span style="color:#6E97CD">Hommes: ${point.maleCount} (${
          100 - femalePercent
        }%)</span>`;
      },
    },
    colorAxis: {
      minColor: "#6E97CD",
      maxColor: "#EB7369",
      stops: [
        [0, "#6E97CD"],
        [0.5, "#EFEFEF"],
        [1, "#EB7369"],
      ],
    },
    series: [
      {
        type: "treemap",
        layoutAlgorithm: "squarified",
        data: data,
        dataLabels: {
          enabled: true,
          crop: false,
          overflow: "allow",
          style: {
            textOutline: "1px contrast",
            fontSize: "13px",
            fontWeight: "bold",
          },
        },
      },
    ],
    credits: { enabled: false },
  });

  return (
    <>
      <ChartWrapper
        id="disciplines-treemap"
        options={treemapOptions}
        legend={null}
      />
      <div className="fr-text--xs fr-mt-2w fr-text--center">
        <span className="fr-mr-2w">
          <span
            style={{
              display: "inline-block",
              width: "10px",
              height: "10px",
              backgroundColor: "#6E97CD",
              marginRight: "5px",
            }}
          ></span>
          Majorité d'hommes
        </span>
        <span className="fr-mr-2w">
          <span
            style={{
              display: "inline-block",
              width: "10px",
              height: "10px",
              backgroundColor: "#EFEFEF",
              marginRight: "5px",
            }}
          ></span>
          Parité
        </span>
        <span>
          <span
            style={{
              display: "inline-block",
              width: "10px",
              height: "10px",
              backgroundColor: "#EB7369",
              marginRight: "5px",
            }}
          ></span>
          Majorité de femmes
        </span>
      </div>
    </>
  );
}
