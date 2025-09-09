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
  onRegionClick,
}: MapOptionsParams): Highcharts.Options => ({
  chart: {
    map: mapDataIE,
    backgroundColor: "transparent",
    height: "550px",
    spacing: [0, 0, 0, 0],
    borderWidth: 0,
    plotBorderWidth: 0,
    margin: [20, 10, 80, 10],
    style: {
      fontFamily: "'Marianne', sans-serif",
    },
  },
  exporting: { enabled: false },
  title: {
    text: "",
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
      [0, "var(--blue-cumulus-850)"],
      [0.2, "var(--blue-ecume-850)"],
      [0.4, "var(--blue-cumulus-main-526)"],
      [0.6, "var(--blue-cumulus-sun-368)"],
      [0.8, "var(--blue-ecume-sun-247)"],
      [1, "var(--blue-ecume-sun-247)"],
    ],
    min: 0,
    max: stats.max_region_count,
    type: "linear",
    labels: {
      format: "{value:,.0f}",
      style: {
        fontSize: "12px",
        fontFamily: "'Marianne', sans-serif",
        color: "#000091",
      },
    },
    tickPositions: [stats.p25, stats.p50, stats.p75, stats.max_region_count],
    layout: "horizontal",
    width: "100%",
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
