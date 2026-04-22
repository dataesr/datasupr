import { getCssColor } from "../../../../../../utils/colors";

const SITUATION_LABELS: Record<string, string> = {
    SIT01: "L1",
    SIT02: "L2",
    SIT03: "L3",
    SIT04: "M1",
    SIT05: "M2",
    SIT06: "STS",
    SIT07: "CPGE",
    SIT08: "IUT",
    SIT09: "LP",
    SIT10: "Cursus santé",
    SIT11: "Écoles d'ingénieur et de commerce",
    SIT12: "Autres formations",
    SIT13: "Sortants",
};

const SITUATION_COLOR_KEYS: Record<string, string> = {
    SIT01: "outcomes-l1",
    SIT02: "outcomes-l2",
    SIT03: "outcomes-l3",
    SIT04: "outcomes-m1",
    SIT05: "outcomes-m2",
    SIT06: "outcomes-sts",
    SIT07: "outcomes-cpge",
    SIT08: "outcomes-iut",
    SIT09: "outcomes-lp",
    SIT10: "outcomes-autres",
    SIT11: "outcomes-ecoles",
    SIT12: "outcomes-autres",
    SIT13: "outcomes-sortants",
};

const SITUATION_ORDER = [
    "SIT01", "SIT02", "SIT03", "SIT09", "SIT04", "SIT05",
    "SIT06", "SIT08", "SIT07", "SIT11",
    "SIT10", "SIT12", "SIT13",
];

interface DistributionItem {
    annee_rel: number;
    situation: string;
    count: number;
}

export function createRepartitionOptions(
    distribution: DistributionItem[],
    relativeYears: number[],
    yearLabels: Record<number, string>,
) {
    const categories = relativeYears.map((y) => yearLabels[y] || `N+${y}`);

    const situationsInData = new Set(distribution.map((d) => d.situation));
    const orderedSituations = SITUATION_ORDER.filter((s) => situationsInData.has(s));

    const series = orderedSituations.map((situation) => ({
        name: SITUATION_LABELS[situation] || situation.replaceAll("_", " "),
        color: getCssColor(SITUATION_COLOR_KEYS[situation] || "scale-3"),
        data: relativeYears.map((year) => {
            const item = distribution.find(
                (d) => d.annee_rel === year && d.situation === situation
            );
            return item?.count || 0;
        }),
    }));

    return {
        accessibility: {
            point: {
                valueDescriptionFormat: "{series.name}: {point.percentage:.1f}%",
            },
        },
        chart: {
            type: "column", backgroundColor: "transparent",
        },
        exporting: { enabled: false },
        credits: { enabled: false },
        legend: { enabled: true, reversed: true, itemStyle: { color: getCssColor("text-default-grey") } },
        plotOptions: {
            column: {
                borderWidth: 0,
                dataLabels: {
                    enabled: true,
                    format: "{point.percentage:.0f} %",
                    style: {
                        color: getCssColor("text-default-grey"),
                        fontSize: "11px",
                        textOutline: "none",
                    },
                },
                groupPadding: 0.05,
                pointPadding: 0,
                stacking: "percent",
            },
        },
        series,
        title: { text: undefined },
        tooltip: {
            pointFormat: '<span style="color:{series.color}">\u25CF</span> {series.name}: <b>{point.y}</b> ({point.percentage:.1f}%)<br/>',
            shared: true,
        },
        xAxis: { categories, crosshair: true, labels: { style: { color: getCssColor("text-default-grey") } } },
        yAxis: {
            labels: { format: "{value} %", style: { color: getCssColor("text-default-grey") } },
            title: { text: undefined },
        },
    };
}
