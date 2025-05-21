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
      marginLeft: 0,
      style: {
        fontFamily: "Marianne, sans-serif",
      },
    },
    title: {
      text: title,
      style: {
        color: "#000000",
        fontSize: "18px",
        fontWeight: "bold",
      },
      align: "left",
    },
    subtitle: {
      text: `Année universitaire ${year}`,
      style: {
        color: "#666666",
        fontSize: "14px",
      },
      align: "left",
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
               <span style="color:#e18b76">Femmes: ${
                 point.femaleCount
               } (${femalePercent}%)</span><br>
               <span style="color:#efcb3a">Hommes: ${point.maleCount} (${
          100 - femalePercent
        }%)</span>`;
      },
    },
    colorAxis: {
      minColor: "#efcb3a",
      maxColor: "#e18b76",
      stops: [
        [0, "#efcb3a"],
        [0.5, "#EFEFEF"],
        [1, "#e18b76"],
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
      <div className="fr-text--xs fr-mt-2w" style={{ display: "block"}}>
        <span className="fr-mr-2w">
          <span
            style={{
              display: "inline-block",
              width: "10px",
              height: "10px",
              backgroundColor: "#efcb3a",
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
              backgroundColor: "#e18b76",
              marginRight: "5px",
            }}
          ></span>
          Majorité de femmes
        </span>
      </div>
    </>
  );
}
