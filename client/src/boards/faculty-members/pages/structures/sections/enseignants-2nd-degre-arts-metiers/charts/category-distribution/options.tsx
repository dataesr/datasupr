import Highcharts from "highcharts";
import { createChartOptions } from "../../../../../../../../components/chart-wrapper/default-options";
import { getCssColor } from "../../../../../../../../utils/colors";

export interface CategoryData {
    categoryCode: string;
    categoryName: string;
    maleCount: number;
    femaleCount: number;
    totalCount: number;
}

export function createCategoryDistributionOptions(
    categoryData: CategoryData[]
): Highcharts.Options | null {
    if (!categoryData || categoryData.length === 0) return null;

    const sortedData = [...categoryData].sort(
        (a, b) => b.totalCount - a.totalCount
    );

    const categories = sortedData.map((item) => item.categoryName);
    const womenData = sortedData.map((item) => item.femaleCount);
    const menData = sortedData.map((item) => item.maleCount);

    return createChartOptions("bar", {
        chart: {
            height: Math.max(250, 80 + categories.length * 40),
        },
        xAxis: {
            categories,
            title: { text: null },
        },
        yAxis: {
            min: 0,
            title: { text: "Nombre d'enseignants" },
            stackLabels: {
                enabled: true,
                format: "{total:,.0f}",
                style: { fontSize: "10px", fontWeight: "bold" },
            },
        },
        tooltip: {
            shared: true,
            headerFormat: "<b>{point.key}</b><br/>",
            pointFormat:
                '<span style="color:{series.color}">\u25CF</span> {series.name}: {point.y:,.0f}<br/>',
            footerFormat: "Total: {point.total:,.0f}",
        },
        plotOptions: {
            bar: {
                stacking: "normal",
                dataLabels: { enabled: false },
            },
        },
        legend: {
            enabled: true,
            reversed: true,
            itemStyle: { fontSize: "11px" },
        },
        series: [
            {
                name: "Hommes",
                data: menData,
                type: "bar",
                color: getCssColor("fm-hommes"),
            },
            {
                name: "Femmes",
                data: womenData,
                type: "bar",
                color: getCssColor("fm-femmes"),
            },
        ],
    });
}
