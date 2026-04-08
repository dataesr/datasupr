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

    return createChartOptions("line", {
        chart: { height: 350 },
        xAxis: {
            categories,
            title: { text: null },
            labels: { rotation: -45 },
        },
        yAxis: { min: 0, title: { text: "Effectif" } },
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
            }
        ],
    });
}
