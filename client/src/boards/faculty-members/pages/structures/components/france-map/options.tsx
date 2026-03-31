import Highcharts from "highcharts";
import mapDataIE from "../../../../../../assets/regions.json";
import { getCssColor } from "../../../../../../utils/colors";

interface MapOptionsParams {
    chartData: Array<{
        "hc-key": string;
        name: string;
        value: number;
        male_count: number;
        female_count: number;
        male_percent: number;
        female_percent: number;
    }>;
    maxValue: number;
    clickable?: boolean;
}

export function createFranceMapOptions({
    chartData,
    maxValue,
    clickable = false,
}: MapOptionsParams): Highcharts.Options {
    const hommesColor = getCssColor("fm-hommes");
    const femmesColor = getCssColor("fm-femmes");

    return {
        chart: {
            map: mapDataIE as any,
            backgroundColor: "transparent",
            height: "420px",
            spacing: [0, 0, 0, 0],
            margin: [20, 10, 80, 10],
        },
        title: { text: "" },
        exporting: { enabled: false },
        credits: { enabled: false },
        accessibility: { enabled: false },
        mapNavigation: {
            enabled: true,
            buttonOptions: { verticalAlign: "bottom" },
        },
        colorAxis: {
            stops: [
                [0, "var(--blue-cumulus-850)"],
                [0.3, "var(--blue-cumulus-main-526)"],
                [0.7, "var(--blue-ecume-sun-247)"],
                [1, "var(--blue-ecume-sun-247)"],
            ],
            min: 0,
            max: maxValue,
            type: "linear",
            labels: {
                format: "{value:,.0f}",
                style: { fontSize: "12px", color: "var(--text-default-grey)" },
            },
            layout: "horizontal" as any,
            width: "100%",
        },
        tooltip: {
            useHTML: true,
            headerFormat: "",
            pointFormatter: function () {
                const point = this as any;
                return `
          <div style="padding:8px;">
            <strong style="color:var(--blue-france-main-525)">${point.name}</strong><br/>
            <span>Total : <strong>${point.options.value?.toLocaleString("fr-FR")}</strong></span><br/>
            <span style="color:${hommesColor}">♂ Hommes : ${point.options.male_count?.toLocaleString("fr-FR")} (${point.options.male_percent}%)</span><br/>
            <span style="color:${femmesColor}">♀ Femmes : ${point.options.female_count?.toLocaleString("fr-FR")} (${point.options.female_percent}%)</span>
          </div>`;
            },
        },
        plotOptions: {
            series: {
                cursor: clickable ? "pointer" : "default",
            },
        },
        series: [
            {
                type: "map",
                data: chartData,
                joinBy: "hc-key",
                name: "Enseignants",
                borderColor: "var(--border-default-grey)",
                borderWidth: 0.5,
                states: {
                    hover: { color: "var(--border-default-grey)", borderWidth: 2 },
                },
                dataLabels: {
                    enabled: true,
                    format: "{point.name}",
                    style: {
                        fontSize: "10px",
                        fontWeight: "normal",
                        textOutline: "none",
                        color: "var(--text-inverted-grey)",
                    },
                },
            },
        ] as any,
    };
}
