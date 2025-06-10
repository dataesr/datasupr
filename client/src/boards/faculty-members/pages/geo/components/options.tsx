import Highcharts from "highcharts";
import mapDataIE from "../../../../../assets/regions.json";

interface RegionMapData {
  geo_id: string;
  geo_nom: string;
  total_count: number;
  male_count: number;
  female_count: number;
  male_percent: number;
  female_percent: number;
}

interface RegionMapPoint extends Highcharts.Point {
  options: RegionMapData & {
    "hc-key": string;
    value: number;
  };
}

interface MapStatistics {
  total_count: number;
  regions_count: number;
  max_region_count: number;
  p25: number;
  p50: number;
  p75: number;
}

interface MapOptionsParams {
  chartData: Array<{
    "hc-key": string;
    name: string;
    geo_id: string;
    value: number;
    total_count: number;
    male_count: number;
    female_count: number;
    male_percent: number;
    female_percent: number;
  }>;
  stats: MapStatistics;
  annee_universitaire: string;
  onRegionClick: (geoId: string) => void;
}

export const createMapOptions = ({
  chartData,
  stats,
  annee_universitaire,
  onRegionClick,
}: MapOptionsParams): Highcharts.Options => ({
  chart: {
    map: mapDataIE,
    backgroundColor: "transparent",
    height: "650px",
    spacing: [0, 50, 100, 355],
    borderWidth: 0,
    plotBorderWidth: 0,
    margin: [0, 0, 150, 0],
    style: {
      fontFamily: "'Marianne', sans-serif",
    },
  },
  title: {
    text: `Personnel enseignant par région ${
      annee_universitaire !== "Toutes les années"
        ? `- ${annee_universitaire}`
        : ""
    }`,
    style: {
      color: "#000091",
      fontWeight: "bold",
      fontSize: "16px",
    },
  },
  subtitle: {
    text: `${stats.total_count.toLocaleString()} enseignants dans ${
      stats.regions_count
    } régions`,
    style: {
      color: "#666666",
      fontSize: "14px",
    },
  },
  credits: { enabled: false },
  mapNavigation: {
    enabled: true,
    buttonOptions: {
      verticalAlign: "bottom",
    },
  },
  colorAxis: {
    stops: [
      [0, "#E3E3FD"],
      [0.2, "#B5B5F7"],
      [0.4, "#8787F2"],
      [0.6, "#5959ED"],
      [0.8, "#2B2BE8"],
      [1, "#000091"],
    ],
    min: 0,
    max: stats.max_region_count,
    type: "linear",
    labels: {
      format: "{value:,.0f}",
      style: {
        fontSize: "12px",
        fontFamily: "'Marianne', sans-serif",
      },
    },
    tickPositions: [0, stats.p25, stats.p50, stats.p75, stats.max_region_count],
    layout: "horizontal",
  },
  tooltip: {
    useHTML: true,
    headerFormat: "",
    pointFormatter: function () {
      const point = this as unknown as RegionMapPoint;
      return `
        <div style="padding: 10px; background: white; border-radius: 5px; box-shadow: 0 2px 8px rgba(0,0,0,0.15);">
          <h4 style="margin: 0 0 8px 0; color: #000091; font-size: 16px;">${
            point.name
          }</h4>
          <div style="margin-bottom: 8px;">
            <strong>Total enseignants:</strong> ${point.options.total_count?.toLocaleString()}
          </div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
            <span style="color: #efcb3a;">♂ Hommes:</span>
            <span><strong>${point.options.male_count?.toLocaleString()}</strong> (${
        point.options.male_percent
      }%)</span>
          </div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
            <span style="color: #e18b76;">♀ Femmes:</span>
            <span><strong>${point.options.female_count?.toLocaleString()}</strong> (${
        point.options.female_percent
      }%)</span>
          </div>
          <hr style="margin: 8px 0; border: none; border-top: 1px solid #eee;" />
          <div style="text-align: center; color: #666; font-size: 12px;">
            Cliquez pour voir les détails complets
          </div>
        </div>
      `;
    },
  },
  series: [
    {
      type: "map",
      name: "Régions françaises",
      data: chartData,
      states: {
        hover: {
          brightness: 0.2,
          borderColor: "#000091",
          borderWidth: 2,
        },
        select: {
          color: "#000066",
        },
      },
      point: {
        events: {
          click: function () {
            const point = this as unknown as RegionMapPoint;
            if (point.options?.geo_id) {
              onRegionClick(point.options.geo_id);
            }
          },
        },
      },
      dataLabels: {
        enabled: true,
        format: "{point.name}",
        style: {
          fontWeight: "normal",
          fontSize: "10px",
          textOutline: "2px white",
          color: "#000000",
        },
      },
      cursor: "pointer",
    },
  ],
});
