import type { OutcomesFilterOption } from "../../../api";

function formatNumber(n: number): string {
    return Math.round(n).toLocaleString("fr-FR");
}

function formatPercent(n: number): string {
    return `${Number(n).toLocaleString("fr-FR", { minimumFractionDigits: 1, maximumFractionDigits: 1 })}%`;
}

interface BreakdownRowProps {
    option: OutcomesFilterOption;
    sectionTotal: number;
    sectionMax: number;
    mode: "percent" | "effectif";
}

export default function BreakdownRow({
    option,
    sectionTotal,
    sectionMax,
    mode,
}: BreakdownRowProps) {
    const dipl = option.dipl ?? 0;
    const ndipl = option.ndipl ?? 0;
    const total = dipl + ndipl;
    if (total <= 0) return null;

    const diplShare = (dipl / total) * 100;
    const ndiplShare = (ndipl / total) * 100;
    const populationShare = sectionTotal > 0 ? (total / sectionTotal) * 100 : 0;

    const rowWidth = mode === "effectif" && sectionMax > 0 ? (total / sectionMax) * 100 : 100;
    const diplWidth = (diplShare * rowWidth) / 100;
    const ndiplWidth = (ndiplShare * rowWidth) / 100;

    const leftLabel = mode === "percent" ? formatPercent(diplShare) : formatNumber(dipl);
    const rightLabel = mode === "percent" ? formatPercent(ndiplShare) : formatNumber(ndipl);

    return (
        <div className="fr-mb-2w">
            <p className="fr-text--sm fr-mb-1v">
                <b>{option.label}</b> — {formatNumber(total)} ({formatPercent(populationShare)} de la population observée)
            </p>
            <div
                className="outcomes-phd__bar"
                role="img"
                aria-label={`${option.label} : ${formatNumber(dipl)} diplômés, ${formatNumber(ndipl)} non diplômés`}
            >
                <div className="outcomes-phd__bar-fill outcomes-phd__bar-fill--dipl" style={{ width: `${diplWidth}%` }}>
                    <span>{leftLabel}</span>
                </div>
                <div className="outcomes-phd__bar-fill outcomes-phd__bar-fill--ndipl" style={{ width: `${ndiplWidth}%` }}>
                    <span>{rightLabel}</span>
                </div>
            </div>
            <div className="outcomes-phd__row-footer fr-text--xs fr-mt-1v">
                <span>{formatNumber(dipl)} diplômés</span>
                <span>{formatNumber(ndipl)} non diplômés</span>
            </div>
        </div>
    );
}
