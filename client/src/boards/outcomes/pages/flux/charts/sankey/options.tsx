import { getCssColor } from "../../../../../../utils/colors";
import { type OutcomesFluxLink } from "../../../../api";

function resolveTokenColor(token: string) {
    if (typeof window === "undefined" || typeof document === "undefined") {
        return getCssColor(token);
    }

    const probe = document.createElement("span");
    probe.style.color = `var(--${token})`;
    probe.style.position = "absolute";
    probe.style.left = "-9999px";
    probe.style.top = "-9999px";
    document.body.appendChild(probe);
    const resolved = window.getComputedStyle(probe).color;
    document.body.removeChild(probe);

    if (!resolved || resolved === "rgb(0, 0, 0)") {
        return getCssColor(token);
    }
    return resolved;
}

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
    SIT13: "outcomes-sortants-diplomes",
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
                color: resolveTokenColor(SITUATION_COLOR_KEYS[situation] || "scale-3"),
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
                color: resolveTokenColor(SITUATION_COLOR_KEYS[link.source_situation] || "scale-3"),
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

export function createSankeyOptions(links: OutcomesFluxLink[], totalStudents = 0) {
    const sorted = sortLinks(links);
    const seriesData = buildSeriesData(sorted);
    const nodes = buildNodes(sorted);
    const usedYears = Array.from(new Set(nodes.map((node) => node.column))).sort((a, b) => a - b);
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
    const totalStudentsBase = totalStudents > 0 ? totalStudents : totalVisibleFlow;

    return {
        chart: {
            height: 800,
            backgroundColor: "transparent",
            spacingBottom: 120,
            events: {
                render() {
                    const chart = this as any;
                    const sankeySeries = chart?.series?.find((serie: any) => serie.type === "sankey");

                    if (chart.outcomesYearLabelsGroup) {
                        chart.outcomesYearLabelsGroup.destroy();
                        chart.outcomesYearLabelsGroup = null;
                    }

                    if (!sankeySeries?.nodes?.length) return;

                    const group = chart.renderer.g("outcomes-year-labels").add();
                    const y = chart.plotTop + chart.plotHeight + 10;
                    const minX = chart.plotLeft + 4;
                    const maxX = chart.plotLeft + chart.plotWidth - 4;

                    usedYears.forEach((year) => {
                        const yearNodes = sankeySeries.nodes
                            .filter((node: any) => node?.column === year && node?.shapeArgs)
                            .map((node: any) => node.shapeArgs.x + node.shapeArgs.width / 2);

                        if (!yearNodes.length) return;

                        const x = yearNodes.reduce((sum: number, value: number) => sum + value, 0) / yearNodes.length;

                        const textEl = chart.renderer
                            .text(YEAR_LABELS[year] || `N+${year}`, x, y)
                            .css({
                                color: resolveTokenColor("text-title-grey"),
                                fontSize: "12px",
                                fontWeight: "600",
                            })
                            .attr({ align: "center", zIndex: 5 })
                            .add(group);

                        const box = textEl.getBBox();
                        if (box.x < minX) {
                            textEl.attr({ x: x + (minX - box.x) });
                        } else if (box.x + box.width > maxX) {
                            textEl.attr({ x: x - ((box.x + box.width) - maxX) });
                        }
                    });

                    chart.outcomesYearLabelsGroup = group;
                },
            },
        },
        accessibility: {
            point: {
                valueDescriptionFormat: "{index}. {point.fromNode.name} vers {point.toNode.name}, {point.weight} étudiants.",
            },
        },
        caption: {
            align: "left",
            style: {
                color: resolveTokenColor("text-mention-grey"),
                fontSize: "11px",
            },
            text: "Source : MESRE-SIES.",
            verticalAlign: "bottom",
        },
        credits: { enabled: false },
        exporting: { enabled: false },
        plotOptions: {
            sankey: {
                borderColor: resolveTokenColor("border-default-grey"),
                borderWidth: 1,
                dataLabels: {
                    enabled: true,
                    nodeFormatter() {
                        return (this as any).point.name;
                    },
                    style: {
                        color: resolveTokenColor("text-title-grey"),
                        fontWeight: "600",
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

                const isNode = !p.from && !p.to;

                if (isNode) {
                    if (p.column === 0) {
                        const yearLabel = YEAR_LABELS[p.column as number] || `N+${p.column}`;
                        return `${p.name} - ${yearLabel}`;
                    }

                    const nodeId = String(p.id || "");
                    const incoming = incomingByNode.get(nodeId) || 0;
                    const outgoing = outgoingByNode.get(nodeId) || 0;
                    const nodeTotal = Math.max(incoming, outgoing);
                    const nodePart = totalStudentsBase > 0 ? (nodeTotal / totalStudentsBase) * 100 : 0;
                    const yearLabel = YEAR_LABELS[p.column as number] || `N+${p.column}`;

                    const incomingBreakdown = Array.from((incomingBreakdownByNode.get(nodeId) || new Map()).entries())
                        .sort((a, b) => b[1] - a[1]);
                    const outgoingBreakdown = Array.from((outgoingBreakdownByNode.get(nodeId) || new Map()).entries())
                        .sort((a, b) => b[1] - a[1]);

                    const hasIncoming = incoming > 0;
                    const linesTitle = hasIncoming ? "<b>D'où viennent les étudiants :</b>" : "<b>Vers quelles formations vont les étudiants :</b>";
                    const detailLines = hasIncoming
                        ? incomingBreakdown
                            .map(([sourceId, value]) => `${nodeNames.get(sourceId) || sourceId} : ${formatPercent((value / incoming) * 100)}`)
                        : outgoingBreakdown.map(([targetId, value]) => `${nodeNames.get(targetId) || targetId} : ${formatPercent((value / outgoing) * 100)}`);

                    return [
                        `<b>${p.name} - ${yearLabel}</b>`,
                        `<b>Part du total : ${formatPercent(nodePart)}</b>`,
                        linesTitle,
                        ...detailLines,
                        `<b>Effectif total : ${formatNumber(nodeTotal)}</b>`,
                    ].join("<br/>");
                }

                const weight = Number(p.weight) || 0;
                const incoming = incomingByNode.get(String(p.to || "")) || 0;
                const outgoing = outgoingByNode.get(String(p.from || "")) || 0;

                const shareOfIncoming = incoming > 0 ? (weight / incoming) * 100 : 0;
                const shareOfOutgoing = outgoing > 0 ? (weight / outgoing) * 100 : 0;
                const shareOfVisible = totalStudentsBase > 0 ? (weight / totalStudentsBase) * 100 : 0;

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
