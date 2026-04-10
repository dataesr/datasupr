import { getCssColor } from "../../../../../../utils/colors";
import { type OutcomesFluxLink } from "../../../../api";

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

function getSituationLabel(situation: string) {
    return SITUATION_LABELS[situation] || situation.replaceAll("_", " ");
}

function getNodeId(relativeYear: number, situation: string) {
    return `N+${relativeYear}__${situation}`;
}

function buildNodes(links: OutcomesFluxLink[]) {
    const seen = new Set<string>();
    const nodes: Array<{ color: string; column: number; id: string; name: string }> = [];

    links.forEach((link) => {
        [
            { rel: link.source_rel, situation: link.source_situation },
            { rel: link.target_rel, situation: link.target_situation },
        ].forEach(({ rel, situation }) => {
            const id = getNodeId(rel, situation);
            if (seen.has(id)) return;

            seen.add(id);
            nodes.push({
                color: getCssColor(SITUATION_COLOR_KEYS[situation] || "scale-3"),
                column: rel,
                id,
                name: getSituationLabel(situation),
            });
        });
    });

    return nodes;
}

function buildSeriesData(links: OutcomesFluxLink[]) {
    return links.map((link) => ({
        color: getCssColor(SITUATION_COLOR_KEYS[link.source_situation] || "scale-3"),
        from: getNodeId(link.source_rel, link.source_situation),
        to: getNodeId(link.target_rel, link.target_situation),
        weight: link.value,
    }));
}

export function createSankeyOptions(links: OutcomesFluxLink[]) {
    return {
        chart: { height: 800, backgroundColor: "transparent" },
        accessibility: {
            point: {
                valueDescriptionFormat: "{index}. {point.fromNode.name} vers {point.toNode.name}, {point.weight} étudiants.",
            },
        },
        credits: { enabled: false },
        exporting: { enabled: false },
        plotOptions: {
            sankey: {
                borderColor: getCssColor("border-default-grey"),
                borderWidth: 1,
                dataLabels: {
                    enabled: true,
                    nodeFormatter() {
                        return (this as any).point.name;
                    },
                    style: {
                        color: getCssColor("text-default-grey"),
                        textOutline: "none",
                    },
                },
                inactiveOtherPoints: false,
                linkOpacity: 0.5,
                minLinkWidth: 1,
                nodeAlignment: "left",
                nodePadding: 10,
                nodeWidth: 50,
            },
        },
        series: [
            {
                data: buildSeriesData(links),
                nodes: buildNodes(links),
                type: "sankey",
            },
        ],
        title: { text: undefined },
        tooltip: {
            pointFormatter() {
                const p = this as any;
                return `<b>${p.fromNode.name}</b> → <b>${p.toNode.name}</b><br/>${p.weight} étudiants`;
            },
        },
    };
}
