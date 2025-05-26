import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import highchartsMap from "highcharts/modules/map";
import mapDataIE from "../../../../../assets/regions.json";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { RegionMapPoint } from "../../../types";

highchartsMap(Highcharts);

export default function FacultyFranceMap({
  availableGeos,
}: {
  availableGeos: {
    femaleCount: number;
    femalePercent: number;
    geo_id: string;
    geo_nom: string;
    maleCount: number;
    malePercent: number;
    totalCount: number;
  }[];
}) {
  const navigate = useNavigate();
  const [mapOptions, setMapOptions] = useState<Highcharts.Options | null>(null);

  useEffect(() => {
    const regionMapping = {};

    mapDataIE.objects?.default?.geometries?.forEach((g) => {
      const regId = g.properties?.reg_id;
      if (regId) {
        regionMapping[regId] = g.properties["hc-key"];
      }
    });

    const mapData = availableGeos
      .filter((region) => {
        const hasMapping = !!regionMapping[region.geo_id];

        if (!hasMapping) {
          return;
        }
        return hasMapping;
      })
      .map((region) => {
        const mapRegionCode = regionMapping[region.geo_id];
        return {
          "hc-key": mapRegionCode,
          name: region.geo_nom,
          geo_id: region.geo_id,
          value: Number(region.totalCount) || 0,
          totalCount: region.totalCount,
          maleCount: region.maleCount,
          femaleCount: region.femaleCount,
          malePercent: region.malePercent,
          femalePercent: region.femalePercent,
        };
      });

    setMapOptions({
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
        text: "Sélectionnez une région pour explorer les données",
        style: {
          color: "#000091",
          fontWeight: "bold",
          fontSize: "16px",
        },
      },
      credits: {
        enabled: false,
      },
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
        max: 17000,
        type: "linear",
        labels: {
          format: "{value:,.0f}",
          style: {
            fontSize: "12px",
            fontFamily: "'Marianne', sans-serif",
          },
        },
        tickPositions: [0, 3400, 6800, 10200, 13600, 17000],
        layout: "horizontal",
      },
      tooltip: {
        useHTML: true,
        headerFormat: "",
        pointFormatter: function () {
          const point = this as RegionMapPoint;

          return `
    <div class="map-tooltip">
      <h4 class="tooltip-title">${point.name}</h4>
      <div class="tooltip-stats">
        <div class="stat-row">
          <span class="stat-label">Total enseignants:</span>
          <span class="stat-value">${
            point.totalCount?.toLocaleString() || "N/A"
          }</span>
        </div>
        <div class="stat-row">
          <span class="stat-label">Hommes:</span> 
          <span class="stat-value">${
            point.maleCount?.toLocaleString() || "N/A"
          } (${point.malePercent}%)</span>
        </div>
        <div class="stat-row">
          <span class="stat-label">Femmes:</span>
          <span class="stat-value">${
            point.femaleCount?.toLocaleString() || "N/A"
          } (${point.femalePercent}%)</span>
        </div>
      </div>
      <hr class="tooltip-divider" />
      <div class="tooltip-footer">
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
          data: mapData.map((region) => ({
            ...region,
            value: Number(region.totalCount) || 0,
          })),
          states: {
            hover: {
              brightness: 0.2,
              borderColor: "#000",
            },
            select: {
              color: "#000066",
            },
          },
          point: {
            events: {
              click: function () {
                const point = this as unknown as RegionMapPoint;

                if (point.options && point.options.geo_id) {
                  navigate(
                    `/personnel-enseignant/geo/vue-d'ensemble/${point.options.geo_id}`
                  );
                } else if (point.geo_id) {
                  navigate(
                    `/personnel-enseignant/geo/vue-d'ensemble/${point.geo_id}`
                  );
                } else {
                  const region = availableGeos.find(
                    (r) => r.geo_nom === point.name
                  );
                  if (region) {
                    navigate(
                      `/personnel-enseignant/geo/vue-d'ensemble/${region.geo_id}`
                    );
                  }
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
  }, [availableGeos, navigate]);

  if (!mapOptions) return <div>Chargement de la carte...</div>;

  return (
    <div className="france-map-container">
      <HighchartsReact
        constructorType={"mapChart"}
        highcharts={Highcharts}
        options={mapOptions}
      />
    </div>
  );
}
