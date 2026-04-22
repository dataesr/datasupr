import { getCssColor } from "../../../../../../utils/colors";
import { type OutcomesFluxLink } from "../../../../api";

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

const SITUATION_ORDER: Record<string, number> = {
    SIT05: 0,  // M2
    SIT04: 1,  // M1
    SIT03: 2,  // L3
    SIT09: 3,  // LP
    SIT02: 4,  // L2
    SIT01: 5,  // L1
    SIT07: 6,  // CPGE
    SIT11: 7,  // Écoles
    SIT08: 8,  // IUT
    SIT06: 9,  // STS
    SIT10: 10, // Cursus santé
    SIT12: 11, // Autres formations
    SIT13: 12, // Sortants
};

const YEAR_LABELS: Record<number, string> = {
    0: "2019-2020",
    1: "2020-2021",
    2: "2021-2022",
    3: "2022-2023",
    4: "2023-2024",
};

function getSituationLabel(situation?: string) {
    if (!situation) return "Non renseigné";
    return SITUATION_LABELS[situation] || situation.replaceAll("_", " ");
}

function getNodeId(relativeYear: number, situation: string) {
    return `N+${relativeYear}__${situation}`;
}

function normalizeRelativeYear(value: unknown): number | null {
    if (Number.isInteger(value)) return value as number;
    const parsed = Number.parseInt(String(value), 10);
    return Number.isInteger(parsed) ? parsed : null;
}

function buildNodes(links: OutcomesFluxLink[]) {
    const seen = new Set<string>();
    const nodes: Array<{ color: string; column: number; id: string; name: string }> = [];

    links.forEach((link) => {
        [
            { rel: link.source_rel, situation: link.source_situation },
            { rel: link.target_rel, situation: link.target_situation },
        ].forEach(({ rel, situation }) => {
            const normalizedRel = normalizeRelativeYear(rel);
            if (normalizedRel === null || !situation) return;

            const id = getNodeId(normalizedRel, situation);
            if (seen.has(id)) return;

            seen.add(id);
            nodes.push({
                color: getCssColor(SITUATION_COLOR_KEYS[situation] || "scale-3"),
                column: normalizedRel,
                id,
                name: getSituationLabel(situation),
            });
        });
    });

    return nodes;
}

function buildSeriesData(links: OutcomesFluxLink[]) {
    return links
        .map((link) => {
            const sourceRel = normalizeRelativeYear(link.source_rel);
            const targetRel = normalizeRelativeYear(link.target_rel);

            if (
                sourceRel === null ||
                targetRel === null ||
                !link.source_situation ||
                !link.target_situation
            ) {
                return null;
            }

            return {
                color: getCssColor(SITUATION_COLOR_KEYS[link.source_situation] || "scale-3"),
                from: getNodeId(sourceRel, link.source_situation),
                to: getNodeId(targetRel, link.target_situation),
                weight: link.value,
            };
        })
        .filter((item): item is { color: string; from: string; to: string; weight: number } => item !== null);
}

function sortLinks(links: OutcomesFluxLink[]): OutcomesFluxLink[] {
    return [...links].sort((a, b) => {
        const sourceRelA = normalizeRelativeYear(a.source_rel) ?? 999;
        const sourceRelB = normalizeRelativeYear(b.source_rel) ?? 999;
        if (sourceRelA !== sourceRelB) return sourceRelA - sourceRelB;
        const orderA = SITUATION_ORDER[a.target_situation] ?? 99;
        const orderB = SITUATION_ORDER[b.target_situation] ?? 99;
        return orderA - orderB;
    });
}

function formatPercent(value: number) {
    return `${new Intl.NumberFormat("fr-FR", {
        maximumFractionDigits: 1,
        minimumFractionDigits: 1,
    }).format(value)}%`;
}

function formatNumber(value: number) {
    return new Intl.NumberFormat("fr-FR").format(value);
}

export function createSankeyOptions(links: OutcomesFluxLink[]) {
    const sorted = sortLinks(links);
    const seriesData = buildSeriesData(sorted);
    const nodes = buildNodes(sorted);
    const nodeNames = new Map<string, string>(nodes.map((node) => [node.id, node.name]));
    const incomingByNode = new Map<string, number>();
    const outgoingByNode = new Map<string, number>();
    const incomingBreakdownByNode = new Map<string, Map<string, number>>();
    const outgoingBreakdownByNode = new Map<string, Map<string, number>>();

    seriesData.forEach((item) => {
        incomingByNode.set(item.to, (incomingByNode.get(item.to) || 0) + item.weight);
        outgoingByNode.set(item.from, (outgoingByNode.get(item.from) || 0) + item.weight);

        const incomingBreakdown = incomingBreakdownByNode.get(item.to) || new Map<string, number>();
        incomingBreakdown.set(item.from, (incomingBreakdown.get(item.from) || 0) + item.weight);
        incomingBreakdownByNode.set(item.to, incomingBreakdown);

        const outgoingBreakdown = outgoingBreakdownByNode.get(item.from) || new Map<string, number>();
        outgoingBreakdown.set(item.to, (outgoingBreakdown.get(item.to) || 0) + item.weight);
        outgoingBreakdownByNode.set(item.from, outgoingBreakdown);
    });

    const totalVisibleFlow = seriesData.reduce((sum, item) => sum + item.weight, 0);

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
                data: seriesData,
                nodes,
                type: "sankey",
            },
        ],
        title: { text: undefined },
        tooltip: {
            formatter() {
                const p = (this as any).point;

                // Vérifier si c'est un node (les nodes n'ont pas 'from' et 'to')
                const isNode = !p.from && !p.to;

                if (isNode) {
                    // Pour la première colonne, afficher juste le nom et l'année
                    if (p.column === 0) {
                        const yearLabel = YEAR_LABELS[p.column as number] || `N+${p.column}`;
                        return `${p.name} - ${yearLabel}`;
                    }

                    const nodeId = String(p.id || "");
                    const incoming = incomingByNode.get(nodeId) || 0;
                    const outgoing = outgoingByNode.get(nodeId) || 0;
                    const nodeTotal = Math.max(incoming, outgoing);
                    const nodePart = totalVisibleFlow > 0 ? (nodeTotal / totalVisibleFlow) * 100 : 0;
                    const yearLabel = YEAR_LABELS[p.column as number] || `N+${p.column}`;

                    const incomingBreakdown = Array.from((incomingBreakdownByNode.get(nodeId) || new Map()).entries())
                        .sort((a, b) => b[1] - a[1]);

                    const incomingLines = incoming > 0
                        ? incomingBreakdown
                            .map(([sourceId, value]) => `${nodeNames.get(sourceId) || sourceId} : ${formatPercent((value / incoming) * 100)}`)
                        : ["Aucun étudiant"];

                    return [
                        `<b>${p.name} - ${yearLabel}</b>`,
                        `<b>Part du total : ${formatPercent(nodePart)}</b>`,
                        `<b>D'où viennent les étudiants :</b>`,
                        ...incomingLines,
                        `<b>Effectif total : ${formatNumber(incoming)}</b>`,
                    ].join("<br/>");
                }

                // C'est un link
                const weight = Number(p.weight) || 0;
                const incoming = incomingByNode.get(String(p.to || "")) || 0;
                const outgoing = outgoingByNode.get(String(p.from || "")) || 0;

                const shareOfIncoming = incoming > 0 ? (weight / incoming) * 100 : 0;
                const shareOfOutgoing = outgoing > 0 ? (weight / outgoing) * 100 : 0;
                const shareOfVisible = totalVisibleFlow > 0 ? (weight / totalVisibleFlow) * 100 : 0;

                return [
                    `<b>${p.fromNode.name}</b> → <b>${p.toNode.name}</b>`,
                    `<b>${formatNumber(weight)}</b> étudiants`,
                    `<b>Flux sortants</b>`,
                    `${formatPercent(shareOfOutgoing)} de ${p.fromNode.name} à ${p.toNode.name}`,
                    `Part totale du flux: <b>${formatPercent(shareOfVisible)}</b>`,
                    `<b>Flux entrants</b>`,
                    `${p.fromNode.name} : ${formatPercent(shareOfIncoming)} de ${p.toNode.name}`,
                ].join("<br/>");
            },
        },
    };
}
