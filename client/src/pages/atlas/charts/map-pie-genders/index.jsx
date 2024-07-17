/* eslint-disable @typescript-eslint/no-this-alias */
import React from "react";
import Highcharts from "highcharts";
import mapModule from "highcharts/modules/map";
import HighchartsReact from "highcharts-react-official";
import * as turf from "@turf/turf";

import MapSkeleton from "../skeletons/map";

mapModule(Highcharts);

export default function MapPieGenders({
  currentYear,
  isLoading,
  mapPieData,
  polygonsData,
}) {
  if (isLoading) return <MapSkeleton />;

  const data = mapPieData.map((item) => [
    item.id,
    item.effectif_feminin,
    item.effectif_masculin,
    item.effectif_feminin > item.effectif_masculin ? -1 : 1,
    item.nom,
  ]);

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
          options.center = [pixelPos.x, pixelPos.y];
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

  // Compute min and max staff to find relative sizes of bubbles
  let maxStaff = 0;
  Highcharts.each(data, function (row) {
    maxStaff = Math.max(maxStaff, row[1] + row[2]);
  });
  let minStaff = maxStaff;
  Highcharts.each(data, function (row) {
    minStaff = Math.min(minStaff, row[1] + row[2]);
  });
  const a = 1 / (maxStaff - minStaff);
  const b = -a * minStaff;

  // Build the chart
  const options = {
    title: { text: "" },
    credits: { enabled: false },
    chart: {
      animation: false,
      backgroundColor: "transparent",
      mapNavigation: { enabled: false },
      events: {
        load: function () {
          const chart = this;
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
                  const x = state.effectifFeminin + state.effectifMasculin;
                  const y = a * x + b;
                  return Math.sqrt(y + 1.5) * 100;
                },
                tooltip: {
                  pointFormatter: function () {
                    return (
                      this.territory +
                      "<br /><b>Effectif étudiants " +
                      currentYear +
                      "</b><br/>" +
                      Highcharts.map(
                        [[this.name, this.y]].sort(function (a, b) {
                          return b[1] - a[1];
                        }),
                        function (line) {
                          return (
                            '<span style="color:' +
                            line[2] +
                            '">\u25CF</span> ' +
                            line[0] +
                            ": " +
                            Highcharts.numberFormat(line[1], 0) +
                            "<br/>"
                          );
                        }
                      ).join("") +
                      "<hr/>Total: " +
                      Highcharts.numberFormat(this.total, 0) +
                      " étudiant(e)s"
                    );
                  },
                },
                size:
                  ((state.effectifFeminin + state.effectifMasculin) * 70) /
                  maxStaff,
                data: [
                  {
                    name: "Effectif féminin",
                    y: state.effectifFeminin,
                    color: "rgba(240,154,133,0.8)",
                    territory: state.territory,
                  },
                  {
                    name: "Effectif masculin",
                    y: state.effectifMasculin,
                    color: "rgba(246,227,150,0.8)",
                    territory: state.territory,
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
    colorAxis: {
      dataClasses: [
        {
          from: -1,
          to: 0,
          color: "rgba(240,154,133,0.5)",
          name: "Effectif féminin",
        },
        {
          from: 0,
          to: 1,
          color: "rgba(246,227,150,0.5)",
          name: "Effectif masculin",
        },
      ],
    },
    mapView: {
      projection: {
        name: "WebMercator",
      },
    },
    yAxis: { minRange: 2300 },
    tooltip: { useHTML: true },
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
        name: "Territoire",
        borderColor: "#fff",
        nullColor: "rgba(0, 0, 0, 0.3)",
        showInLegend: false,
        joinBy: "originalId",
        keys: [
          "originalId",
          "effectifFeminin",
          "effectifMasculin",
          "value",
          "territory",
        ],
        tooltip: {
          headerFormat: "",
          pointFormatter: function () {
            var hoverVotes = this.hoverVotes; // Used by pie only
            return (
              this.nameFr +
              "<br /><b>Effectif étudiants " +
              currentYear +
              "</b><br/>" +
              Highcharts.map(
                [
                  ["Effectif féminin", this.effectifFeminin, "#F09A85"],
                  ["Effectif masculin", this.effectifMasculin, "#F6E396"],
                ].sort(function (a, b) {
                  return b[1] - a[1]; // Sort tooltip by most votes
                }),
                function (line) {
                  return (
                    '<span style="color:' +
                    line[2] +
                    // Colorized bullet
                    '">\u25CF</span> ' +
                    (line[0] === hoverVotes ? "<b>" : "") +
                    line[0] +
                    ": " +
                    Highcharts.numberFormat(line[1], 0) +
                    (line[0] === hoverVotes ? "</b>" : "") +
                    "<br/>"
                  );
                }
              ).join("") +
              "<hr/>Total: " +
              Highcharts.numberFormat(
                this.effectifFeminin + this.effectifMasculin,
                0
              ) +
              " étudiant(e)s"
            );
          },
        },
      },
    ],
  };

  return (
    <HighchartsReact
      highcharts={Highcharts}
      options={options}
      containerProps={{
        style: {
          width: "100%",
          height: "500px",
        },
      }}
      constructorType={"mapChart"}
    />
  );
}
