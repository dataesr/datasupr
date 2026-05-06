import Highcharts from "highcharts/es-modules/masters/highcharts.src.js";

import { createChartOptions } from "../../../../../../components/chart-wrapper/default-options";
import type { OutcomesFilterOption } from "../../../../api";

function formatNumber(n: number): string {
    return Math.round(n).toLocaleString("fr-FR");
}

function formatPercent(n: number): string {
    return `${Number(n).toLocaleString("fr-FR", { minimumFractionDigits: 1, maximumFractionDigits: 1 })}%`;
}

export function createBreakdownBarOptions(
    options: OutcomesFilterOption[],
    _title: string,
): Highcharts.Options {
    const withData = options.filter((o) => (o.dipl ?? 0) + (o.ndipl ?? 0) > 0);

    const categories = withData.map((o) => o.label);
    const diplData = withData.map((o) => o.dipl ?? 0);
    const ndiplData = withData.map((o) => o.ndipl ?? 0);

    return createChartOptions("bar", {
        caption: {
            align: "left",
            style: { color: "var(--text-mention-grey)", fontSize: "11px" },
            text: "Source : MESRE-SIES.",
            verticalAlign: "bottom",
        },
        chart: {
            backgroundColor: "transparent",
            height: 140 + categories.length * 56,
        },
        title: { text: " " },
        xAxis: {
            categories,
            title: { text: undefined },
        },
        yAxis: {
            min: 0,
            max: 100,
            title: { text: undefined },
            labels: { format: "{value}%" },
        },
        legend: { enabled: true, reversed: true },
        plotOptions: {
            series: {
                stacking: "percent",
                borderWidth: 0,
                dataLabels: {
                    enabled: true,
                    format: "{point.percentage:.1f}%",
                    style: { color: "var(--text-inverted-grey)", fontSize: "12px" },
                },
            },
        },
        tooltip: {
            shared: false,
            useHTML: true,
            pointFormatter() {
                const p = this as unknown as { y: number; percentage: number; series: { name: string } };
                return `<b>${p.series.name}</b> : ${formatNumber(p.y)} (${formatPercent(p.percentage)})`;
            },
        },
        series: [
            {
                type: "bar",
                name: "Diplômés",
                data: diplData,
                color: "var(--green-emeraude-main-632)",
            },
            {
                type: "bar",
                name: "Non diplômés",
                data: ndiplData,
                color: "var(--purple-glycine-main-494)",
            },
        ],
    });
}
