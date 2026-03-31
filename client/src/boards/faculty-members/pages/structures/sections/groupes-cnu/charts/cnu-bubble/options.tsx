import Highcharts from "highcharts";
import { createChartOptions } from "../../../../../../../../components/chart-wrapper/default-options";
import { getCssColor } from "../../../../../../../../utils/colors";

export function createCnuBubbleOptions(
    bubbleData: Array<{
        name: string;
        x: number;
        y: number;
        z: number;
        maleCount: number;
        femaleCount: number;
        totalCount: number;
    }>,
    maxValue: number
): Highcharts.Options {
    const hommesColor = getCssColor("fm-hommes");
    const femmesColor = getCssColor("fm-femmes");
    const padding = maxValue * 0.05;

    return createChartOptions("bubble", {
        chart: { height: 550 },
        xAxis: {
            title: { text: "Nombre de femmes" },
            min: -padding,
            max: maxValue + padding,
            gridLineWidth: 1,
        },
        yAxis: {
            title: { text: "Nombre d'hommes" },
            min: -padding,
            max: maxValue + padding,
            gridLineWidth: 1,
        },
        tooltip: {
            useHTML: true,
            formatter: function () {
                const point = this as any;
                const femalePercent =
                    point.totalCount > 0
                        ? Math.round((point.femaleCount / point.totalCount) * 100)
                        : 0;
                return `<div style="padding:6px;">
          <strong>${point.name}</strong><br/>
          Effectif : <strong>${point.totalCount?.toLocaleString("fr-FR")}</strong><br/>
          <span style="color:${femmesColor}">♀ Femmes : ${point.femaleCount?.toLocaleString("fr-FR")} (${femalePercent}%)</span><br/>
          <span style="color:${hommesColor}">♂ Hommes : ${point.maleCount?.toLocaleString("fr-FR")} (${100 - femalePercent}%)</span>
        </div>`;
            },
        },
        plotOptions: {
            bubble: {
                minSize: 8,
                maxSize: 50,
                dataLabels: {
                    enabled: false,
                },
            },
        },
        legend: { enabled: false },
        series: [
            {
                type: "line",
                data: [
                    [0, 0],
                    [maxValue, maxValue],
                ],
                color: "var(--border-default-grey)",
                dashStyle: "Dash",
                lineWidth: 2,
                marker: { enabled: false },
                showInLegend: false,
                enableMouseTracking: false,
            },
            {
                type: "bubble",
                name: "Groupes CNU",
                data: bubbleData,
                color: getCssColor("fm-statut-ec"),
                marker: { fillOpacity: 0.6 },
            },
        ] as any,
    });
}
