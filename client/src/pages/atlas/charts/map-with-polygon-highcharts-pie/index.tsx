import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import highchartsMap from "highcharts/modules/map";
// import { MapBubbleDataProps, PolygonsDataProps } from "../../../../types/atlas";
import { useEffect, useRef } from "react";

import data from "./data.json";
import mapData from "./mapData.json";

// data.demColor = "rgba(74,131,240,0.80)"
// data.libColor = "rgba(240,190,50,0.80)"
// data.grnColor = "rgba(90,200,90,0.80)"
// data.repColor = "rgba(220,71,71,0.80)"

highchartsMap(Highcharts);

export default function MapWithPolygonHighchartsPie() {
  const chartRef = useRef();

  // Compute max votes to find relative sizes of bubbles
  const maxVotes = data.reduce((max, row) => Math.max(max, row[5]), 0);

  const demColor = "rgba(74,131,240,0.80)";
  const repColor = "rgba(220,71,71,0.80)";
  const libColor = "rgba(240,190,50,0.80)";
  const grnColor = "rgba(90,200,90,0.80)";

  const mapOptions = {
    chart: {
      animation: false, // Disable animation, especially for zooming
    },

    accessibility: {
      description:
        "Complex map demo showing voting results for US " +
        "states, where each state has a pie chart overlaid showing " +
        "the vote distribution.",
    },

    colorAxis: {
      dataClasses: [
        {
          from: -1,
          to: 0,
          color: "rgba(244,91,91,0.5)",
          name: "Republican",
        },
        {
          from: 0,
          to: 1,
          color: "rgba(124,181,236,0.5)",
          name: "Democrat",
        },
        {
          from: 2,
          to: 3,
          name: "Libertarian",
          color: "rgba(240, 190, 50, 0.80)",
        },
        {
          from: 3,
          to: 4,
          name: "Green",
          color: "rgba(90,200,90,0.80)",
        },
      ],
    },

    mapNavigation: {
      enabled: true,
    },

    title: {
      text: "USA 2016 Presidential Election Results",
      align: "left",
    },

    // Default options for the pies
    plotOptions: {
      pie: {
        borderColor: "rgba(255,255,255,0.4)",
        borderWidth: 1,
        clip: true,
        dataLabels: {
          enabled: false,
        },
        states: {
          hover: {
            halo: {
              size: 5,
            },
          },
        },
        tooltip: {
          headerFormat: "",
        },
      },
    },

    series: [
      {
        mapData,
        data: data,
        name: "States",
        borderColor: "#FFF",
        joinBy: ["name", "id"],
        keys: [
          "id",
          "demVotes",
          "repVotes",
          "libVotes",
          "grnVotes",
          "sumVotes",
          "value",
          "pieOffset",
        ],
      },
      {
        name: "Connectors",
        type: "mapline",
        color: "rgba(130, 130, 130, 0.5)",
        zIndex: 5,
        showInLegend: false,
        enableMouseTracking: false,
        accessibility: {
          enabled: false,
        },
      },
    ],
  };

  useEffect(() => {
    const chart = chartRef.current.chart;
    console.log(chart);
    chart.series[0].points.forEach((state) => {
      // Add the pie for this state
      chart.addSeries(
        {
          type: "pie",
          name: state.id,
          zIndex: 6, // Keep pies above connector lines
          minSize: 15,
          maxSize: 55,
          onPoint: {
            id: state.id,
            z: (() => {
              const mapView = chart.mapView,
                zoomFactor = mapView.zoom / mapView.minZoom;

              return Math.max(
                (chart.chartWidth / 45) * zoomFactor, // Min size
                ((chart.chartWidth / 11) * zoomFactor * state.sumVotes) /
                  maxVotes
              );
            })(),
          },
          states: {
            inactive: {
              enabled: false,
            },
          },
          accessibility: {
            enabled: false,
          },
          tooltip: {
            // Use the state tooltip for the pies as well
            pointFormatter() {
              return state.series.tooltipOptions.pointFormatter.call({
                id: state.id,
                hoverVotes: this.name,
                demVotes: state.demVotes,
                repVotes: state.repVotes,
                libVotes: state.libVotes,
                grnVotes: state.grnVotes,
                sumVotes: state.sumVotes,
              });
            },
          },
          data: [
            {
              name: "Democrats",
              y: state.demVotes,
              color: demColor,
            },
            {
              name: "Republicans",
              y: state.repVotes,
              color: repColor,
            },
            {
              name: "Libertarians",
              y: state.libVotes,
              color: libColor,
            },
            {
              name: "Green",
              y: state.grnVotes,
              color: grnColor,
            },
          ],
        },
        false
      );
    });

    chart.redraw();
  }, [chartRef, maxVotes]);

  return (
    <section>
      <HighchartsReact
        constructorType={"mapChart"}
        highcharts={Highcharts}
        options={mapOptions}
        ref={chartRef}
      />
    </section>
  );
}
