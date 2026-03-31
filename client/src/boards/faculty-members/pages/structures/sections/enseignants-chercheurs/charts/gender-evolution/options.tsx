import Highcharts from "highcharts";
import { createChartOptions } from "../../../../../../../../components/chart-wrapper/default-options";
import { getCssColor } from "../../../../../../../../utils/colors";

export function createGenderEvolutionOptions(
    genderEvolution: any[]
): Highcharts.Options {
    const categories = genderEvolution.map((e: any) => e._id);

    const femaleData = genderEvolution.map((e: any) => {
        const f = e.gender_breakdown?.find((g: any) => g.gender === "Féminin");
        return f?.count || 0;
    });

    const maleData = genderEvolution.map((e: any) => {
        const m = e.gender_breakdown?.find((g: any) => g.gender === "Masculin");
        return m?.count || 0;
    });

    const femalePctData = genderEvolution.map((e: any) => {
        const f = e.gender_breakdown?.find((g: any) => g.gender === "Féminin")?.count || 0;
        return e.total > 0 ? Math.round((f / e.total) * 1000) / 10 : 0;
    });

    return createChartOptions("line", {
        chart: { height: 350 },
        xAxis: {
            categories,
            title: { text: null },
            labels: { rotation: -45 },
        },
        yAxis: [
            {
                title: { text: "Effectif" },
                min: 0,
            },
            {
                title: { text: "% Femmes" },
                opposite: true,
                min: 0,
                max: 100,
                labels: { format: "{value}%" },
            },
        ],
        tooltip: {
            shared: true,
            headerFormat: "<b>{point.key}</b><br/>",
        },
        plotOptions: {
            line: {
                marker: { enabled: false, radius: 3 },
            },
            area: {
                stacking: "normal",
                marker: { enabled: false, radius: 3 },
                fillOpacity: 0.3,
            },
        },
        legend: {
            enabled: true,
            itemStyle: { fontSize: "11px", fontWeight: "normal" },
        },
        series: [
            {
                type: "area",
                name: "Hommes",
                data: maleData,
                color: getCssColor("fm-hommes"),
                yAxis: 0,
            },
            {
                type: "area",
                name: "Femmes",
                data: femaleData,
                color: getCssColor("fm-femmes"),
                yAxis: 0,
            },
            {
                type: "line",
                name: "% Femmes",
                data: femalePctData,
                color: getCssColor("fm-indicateur"),
                yAxis: 1,
                dashStyle: "Dash",
                tooltip: { valueSuffix: "%" },
                lineWidth: 2,
            },
        ],
    });
}
