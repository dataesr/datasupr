import Highcharts from "highcharts";
import mapDataIE from "../../../../../../../../assets/regions.json";
import { getCssColor } from "../../../../../../../../utils/colors";

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
}

export function createMapOptions({
    chartData,
    maxValue,
}: MapOptionsParams): Highcharts.Options {
    const hommesColor = getCssColor("fm-hommes");
    const femmesColor = getCssColor("fm-femmes");
    const colorLight = getCssColor("blue-cumulus-main-526");
    const colorMid = getCssColor("blue-france-main-525");
    const colorDark = getCssColor("blue-ecume-main-400");
    const bgColor = getCssColor("background-default-grey");
    const textColor = getCssColor("text-default-grey");
    const borderColor = getCssColor("border-default-grey");

    return {
        chart: {
            map: mapDataIE as any,
            backgroundColor: "transparent",
            height: "500px",
            spacing: [0, 0, 0, 0],
            margin: [10, 0, 90, 0],
            style: { fontFamily: "Marianne, sans-serif" },
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
                [0, colorLight],
                [0.5, colorMid],
                [1, colorDark],
            ],
            min: 0,
            max: maxValue,
            type: "linear",
            labels: {
                format: "{value:,.0f}",
                style: { fontSize: "11px", color: textColor },
            },
            layout: "horizontal" as any,
            width: "70%",
        },
        tooltip: {
            useHTML: true,
            headerFormat: "",
            backgroundColor: bgColor,
            borderColor: borderColor,
            shadow: true,
            pointFormatter: function () {
                const point = this as any;
                return `
          <div style="padding:10px 14px; min-width:210px;">
            <strong style="font-size:13px; color:${colorDark}">${point.name}</strong>
            <hr style="margin:6px 0; border:none; border-top:1px solid ${borderColor};" />
            <div style="margin-bottom:6px; font-size:12px;">Total : <strong>${point.options.value?.toLocaleString("fr-FR")}</strong> enseignants</div>
            <div style="color:${hommesColor}; font-size:12px; margin-bottom:3px;">♂ ${point.options.male_count?.toLocaleString("fr-FR")} hommes (${point.options.male_percent}%)</div>
            <div style="color:${femmesColor}; font-size:12px;">♀ ${point.options.female_count?.toLocaleString("fr-FR")} femmes (${point.options.female_percent}%)</div>
          </div>`;
            },
        },
        series: [
            {
                type: "map",
                data: chartData,
                joinBy: "hc-key",
                name: "Enseignants",
                borderColor: bgColor,
                borderWidth: 1.5,
                states: {
                    hover: { brightness: 0.15, borderWidth: 2, borderColor: colorDark },
                },
                dataLabels: {
                    enabled: true,
                    format: "{point.name}",
                    style: {
                        fontSize: "9px",
                        fontWeight: "normal",
                        textOutline: `2px ${bgColor}`,
                        color: textColor,
                    },
                },
            },
        ] as any,
    };
}
