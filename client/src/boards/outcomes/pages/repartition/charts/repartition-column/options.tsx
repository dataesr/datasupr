import { getCssColor } from "../../../../../../utils/colors";

const SITUATION_LABELS: Record<string, string> = {
    Autres_formations: "Autres formations",
    CPGE: "CPGE",
    Ecoles_ing_com: "Écoles d'ingénieur et de commerce",
    IUT: "IUT",
    L1: "L1",
    L2: "L2",
    L3: "L3",
    LP: "LP",
    M1: "M1",
    M2: "M2",
    STS: "STS",
    Sortants_diplomes: "Sortants diplômés",
    Sortants_non_diplomes: "Sortants non diplômés",
};

const SITUATION_COLOR_KEYS: Record<string, string> = {
    Autres_formations: "outcomes-autres",
    CPGE: "outcomes-cpge",
    Ecoles_ing_com: "outcomes-ecoles",
    IUT: "outcomes-iut",
    L1: "outcomes-l1",
    L2: "outcomes-l2",
    L3: "outcomes-l3",
    LP: "outcomes-lp",
    M1: "outcomes-m1",
    M2: "outcomes-m2",
    STS: "outcomes-sts",
    Sortants_diplomes: "outcomes-sortants-diplomes",
    Sortants_non_diplomes: "outcomes-sortants-non-diplomes",
};

const SITUATION_ORDER = [
    "L1", "L2", "L3", "LP", "M1", "M2",
    "STS", "IUT", "CPGE", "Ecoles_ing_com",
    "Autres_formations", "Sortants_diplomes", "Sortants_non_diplomes",
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
