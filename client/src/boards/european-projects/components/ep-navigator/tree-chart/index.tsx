import Highcharts from "highcharts";
import HighchartsExporting from "highcharts/modules/exporting";
import HighchartsOfflineExporting from "highcharts/modules/offline-exporting";
import HighchartsReact from "highcharts-react-official";
import Treemap from "highcharts/modules/treemap";
import Treegraph from "highcharts/modules/treegraph";

Treemap(Highcharts);
Treegraph(Highcharts);
HighchartsExporting(Highcharts);
HighchartsOfflineExporting(Highcharts);

interface TreeChartProps {
  data?: Array<[string, string, number?]>;
}

export default function TreeChart({ data }: TreeChartProps) {
  // Validation côté client pour éviter les références circulaires
  const validateData = (treeData: Array<[string, string, number?]> | undefined) => {
    if (!treeData || !Array.isArray(treeData)) {
      console.warn("Invalid tree data received");
      return [];
    }

    const validData = treeData.filter(([parent, child]) => {
      if (parent === child) {
        console.warn(`Self-reference filtered out: ${parent}`);
        return false;
      }
      return true;
    });

    return validData;
  };

  const validatedData = validateData(data);

  const options = {
    chart: {
      spacingBottom: 30,
      marginRight: 120,
      height: 1200,
    },
    title: {
      text: "",
    },
    series: [
      {
        type: "treegraph",
        keys: ["parent", "id", "level"],
        clip: false,
        data: validatedData,
        marker: {
          symbol: "circle",
          radius: 6,
          fillColor: "#ffffff",
          lineWidth: 3,
        },
        dataLabels: {
          align: "left",
          pointFormat: "{point.id}",
          // style: {
          //   color: "var(--highcharts-neutral-color-100, #000)",
          //   // textOutline: "3px contrast",
          //   whiteSpace: "nowrap",
          // },
          x: 24,
          crop: false,
          overflow: "none",
        },
        levels: [
          {
            level: 1,
            levelIsConstant: false,
          },
          {
            level: 2,
            colorByPoint: true,
          },
          {
            level: 3,
            colorVariation: {
              key: "brightness",
              to: -0.5,
            },
          },
          {
            level: 4,
            colorVariation: {
              key: "brightness",
              to: 0.5,
            },
          },
        ],
      },
    ],
  };

  return <HighchartsReact highcharts={Highcharts} options={options} />;
}
