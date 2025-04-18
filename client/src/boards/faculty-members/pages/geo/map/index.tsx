import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import highchartsMap from "highcharts/modules/map";
import mapDataIE from "../../../../../assets/regions.json";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { FacultyFranceMapProps, RegionMapPoint } from "../../../types";

highchartsMap(Highcharts);

export default function FacultyFranceMap({
  availableGeos,
}: FacultyFranceMapProps) {
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

        const totalCount = Math.floor(Math.random() * 10000) + 1000;

        const malePercent = Math.floor(Math.random() * 30) + 35;

        const maleCount = Math.round((malePercent / 100) * totalCount);
        const femaleCount = totalCount - maleCount;
        const femalePercent = 100 - malePercent;

        return {
          "hc-key": mapRegionCode,
          name: region.geo_nom,
          geo_id: region.geo_id,
          value: 1,
          totalCount,
          maleCount,
          femaleCount,
          malePercent,
          femalePercent,
        };
      });

    setMapOptions({
      chart: {
        map: mapDataIE,
        backgroundColor: "#fff",
        height: "500px",
        borderWidth: 0,
        plotBorderWidth: 0,
        margin: [0, 0, 0, 0],
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
        dataClasses: [
          {
            from: 0.5,
            to: 1.5,
            color: "#e3e3fd",
            name: "",
          },
        ],
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
          data: mapData,
          states: {
            hover: {
              color: "#000091",
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
