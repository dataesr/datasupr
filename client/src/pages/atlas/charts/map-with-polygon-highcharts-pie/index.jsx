/* eslint-disable @typescript-eslint/no-this-alias */
import * as turf from "@turf/turf";
import Highcharts from "highcharts";
import mapModule from "highcharts/modules/map";
import HighchartsReact from "highcharts-react-official";
import React from "react";

import data from "./data.json";
import mapData from "./mapData.json";

mapModule(Highcharts);

export default function MapWithPolygonHighchartsPie({
  mapbubbleData,
  polygonsData,
}) {
  Highcharts.seriesType(
    "mappie",
    "pie",
    {
      center: null, // Can't be array by default anymore
      linkedMap: null, // id of linked map
      dataLabels: { enabled: false },
    },
    {
      init: function () {
        Highcharts.Series.prototype.init.apply(this, arguments);
        // Respond to zooming and dragging the base map
        Highcharts.addEvent(this.chart.mapView, "afterSetView", () => {
          this.isDirty = true;
        });
      },
      render: function () {
        const series = this,
          chart = series.chart,
          linkedSeries = chart.get(series.options.linkedMap);
        Highcharts.seriesTypes.pie.prototype.render.apply(this, arguments);
        if (series.group && linkedSeries === "map") {
          series.group.add(linkedSeries.group);
        }
      },
      getCenter: function () {
        const options = this.options,
          chart = this.chart,
          slicingRoom = 2 * (options.slicedOffset || 0);
        if (!options.center) {
          options.center = [null, null]; // Do the default here instead
        }
        // Handle lat/lon support
        if (options.center.lat !== undefined) {
          const projectedPos = chart.fromLatLonToPoint(options.center),
            pixelPos = chart.mapView.projectedUnitsToPixels(projectedPos);

          options.center = [
            pixelPos.x, // - chart.plotLeft,
            pixelPos.y, //- chart.plotTop
          ];
        }
        // Handle dynamic size
        if (options.sizeFormatter) {
          options.size = options.sizeFormatter.call(this);
        }
        // Call parent function
        const result =
          Highcharts.seriesTypes.pie.prototype.getCenter.call(this);
        // Must correct for slicing room to get exact pixel pos
        result[0] -= slicingRoom;
        result[1] -= slicingRoom;
        return result;
      },
      translate: function (p) {
        this.options.center = this.userOptions.center;
        this.center = this.getCenter();
        return Highcharts.seriesTypes.pie.prototype.translate.call(this, p);
      },
    }
  );

  const publicColor = "rgba(74,131,240,0.80)";
  const privateColor = "rgba(220,71,71,0.80)";

  let maxVotes = 0;
  // Compute max votes to find relative sizes of bubbles
  Highcharts.each(data, function (row) {
    maxVotes = Math.max(maxVotes, row[3]);
  });

  // Build the chart
  const options = {
    chart: {
      animation: false,
      events: {
        load: function () {
          const chart = this;

          // When clicking legend items, also toggle connectors and pies
          Highcharts.each(chart.legend.allItems, function (item) {
            const setVisible = item.setVisible;
            item.setVisible = function () {
              const legendItem = this;
              setVisible.call(legendItem);

              Highcharts.each(chart.series[0].points, function (point) {
                if (
                  chart.colorAxis[0].dataClasses[point.dataClass].name ===
                  legendItem.name
                ) {
                  // Find this state's pie and set visibility
                  Highcharts.find(chart.series, function (item) {
                    return item.name === point.id;
                  }).setVisible(legendItem.visible, false);
                  // Do the same for the connector point if it exists
                  const connector = Highcharts.find(
                    chart.series[2].points,
                    (item) => item.name === point.id
                  );
                  if (connector) {
                    connector.setVisible(legendItem.visible, false);
                  }
                }
              });
              chart.redraw();
            };
          });

          // Add the pies after chart load, optionally with offset and connectors
          Highcharts.each(chart.series[0].points, function (state) {
            if (!state.id) {
              return; // Skip points with no data, if any
            }

            let polygon;
            if (state.geometry.type === "Polygon") {
              polygon = turf.polygon(state.geometry.coordinates);
            } else if (state.geometry.type === "MultiPolygon") {
              polygon = turf.multiPolygon(state.geometry.coordinates);
            }
            const center = turf.centerOfMass(polygon);

            // Add the pie for this state
            chart.addSeries(
              {
                clip: true,
                type: "mappie",
                name: state.id,
                zIndex: 6, // Keep pies above connector lines
                sizeFormatter: function () {
                  const zoomFactor = chart.mapView.zoom / chart.mapView.minZoom;

                  return Math.max(
                    (this.chart.chartWidth / 45) * zoomFactor, // Min size
                    ((this.chart.chartWidth / 11) *
                      zoomFactor *
                      state.sumVotes) /
                      maxVotes
                  );
                },
                size: (state.sumVotes * 70) / maxVotes,
                data: [
                  {
                    name: "Democrats",
                    y: state.demVotes,
                    color: publicColor,
                  },
                  {
                    name: "Republicans",
                    y: state.repVotes,
                    color: privateColor,
                  },
                ],
                center: {
                  lat: center.geometry.coordinates[1],
                  lon: center.geometry.coordinates[0],
                },
              },
              false
            );
          });
          chart.redraw();
        },
      },
    },

    title: {
      text: "",
    },

    colorAxis: {
      dataClasses: [
        {
          from: -1,
          to: 0,
          color: "rgba(116,140,192,0.5)",
          name: "Secteur public",
        },
        {
          from: 0,
          to: 1,
          color: "rgba(117,95,77,0.5)",
          name: "Secteur privé",
        },
      ],
    },

    mapNavigation: {
      enabled: true,
    },
    // Limit zoom range
    yAxis: {
      minRange: 2300,
    },

    tooltip: {
      useHTML: true,
    },

    // Default options for the pies
    plotOptions: {
      mappie: {
        borderColor: "rgba(255,255,255,0.4)",
        borderWidth: 1,
        tooltip: {
          headerFormat: "",
        },
      },
    },

    series: [
      {
        mapData: polygonsData,
        data,
        name: "States",
        borderColor: "#FFF",
        showInLegend: false,
        joinBy: "originalId",
        keys: [
          "originalId",
          "demVotes",
          "repVotes",
          "sumVotes",
          "value",
          // "pieOffset",
        ],
      },
    ],
  };

  return (
    <HighchartsReact
      highcharts={Highcharts}
      options={options}
      containerProps={{
        style: {
          maxWidth: "820px",
          minWidth: "320px",
          height: "500px",
          margin: "1em auto",
        },
      }}
      constructorType={"mapChart"}
    />
  );
}
