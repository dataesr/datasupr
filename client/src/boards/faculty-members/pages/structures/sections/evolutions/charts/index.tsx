import { useMemo, useState } from "react";
import { SegmentedControl, SegmentedElement } from "@dataesr/dsfr-plus";
import ChartWrapper from "../../../../../../../components/chart-wrapper";
import DefaultSkeleton from "../../../../../../../components/charts-skeletons/default";
import type { FmAnalysisConfig, FmMetricConfig } from "../../../../../config/analyses-config";
import {
    createFmSingleOptions,
    createFmVariationOptions,
    createFmStackedOptions,
    createFmBase100Options,
} from "./options";

interface FmEvolutionChartProps {
    records: Record<string, any>[];
    selectedAnalysis: string;
    allAnalyses: Record<string, FmAnalysisConfig>;
    metricsConfig: Record<string, FmMetricConfig>;
    periodText: string;
    ageClass: string;
    onAgeClassChange: (val: string) => void;
}

export default function FmEvolutionChart({
    records,
    selectedAnalysis,
    allAnalyses,
    metricsConfig,
    periodText,
    ageClass,
    onAgeClassChange,
}: FmEvolutionChartProps) {
    const [displayMode, setDisplayMode] = useState<"values" | "percentage">("values");
    const [viewMode, setViewMode] = useState<"evolution" | "variation">("evolution");

    const analysisConfig = allAnalyses[selectedAnalysis];

    const chartOptions = useMemo(() => {
        if (!analysisConfig || !records.length) return null;
        const { chartType, metrics } = analysisConfig;

        if (chartType === "stacked") {
            return createFmStackedOptions(records, metrics, metricsConfig, displayMode === "percentage");
        }
        if (chartType === "base100") {
            return createFmBase100Options(records, metrics, metricsConfig);
        }
        // single
        const metricKey = metrics[0];
        const config = metricsConfig[metricKey];
        if (!config) return null;
        if (viewMode === "variation") {
            return createFmVariationOptions(records, metricKey, config);
        }
        return createFmSingleOptions(records, metricKey, config);
    }, [analysisConfig, records, metricsConfig, displayMode, viewMode]);

    if (!analysisConfig) return null;
    if (!chartOptions) return <DefaultSkeleton height="440px" />;

    const { chartType, metrics, label } = analysisConfig;
    const primaryConfig = metricsConfig[metrics[0]];

    const chartConfig = {
        id: `fm-evolution-${selectedAnalysis}`,
        title: { fr: label, look: "h5" as const },
        comment: periodText ? { fr: <>Données disponibles sur la période&nbsp;: {periodText}.</> } : undefined,
        sources: [{ label: { fr: <>MESR-SIES, SISE</> }, url: { fr: "https://data.enseignementsup-recherche.gouv.fr" } }],
    };

    return (
        <>
            {chartType === "single" && (
                <div className="fr-mb-2w">
                    <SegmentedControl className="fr-segmented--sm" name="fm-view-mode">
                        <SegmentedElement
                            checked={viewMode === "evolution"}
                            label="Évolution"
                            onClick={() => setViewMode("evolution")}
                            value="evolution"
                        />
                        <SegmentedElement
                            checked={viewMode === "variation"}
                            label="Variation annuelle"
                            onClick={() => setViewMode("variation")}
                            value="variation"
                        />
                    </SegmentedControl>
                </div>
            )}

            {chartType === "stacked" && (
                <div className="fr-mb-2w">
                    <SegmentedControl className="fr-segmented--sm" name="fm-display-mode">
                        <SegmentedElement
                            checked={displayMode === "values"}
                            label="Valeurs"
                            onClick={() => setDisplayMode("values")}
                            value="values"
                        />
                        <SegmentedElement
                            checked={displayMode === "percentage"}
                            label="Répartition %"
                            onClick={() => setDisplayMode("percentage")}
                            value="percentage"
                        />
                    </SegmentedControl>
                </div>
            )}

            <div className="fr-mb-3w">
                <SegmentedControl name="fm-age-filter" className="fr-segmented--sm">
                    <SegmentedElement label="Tous âges" value="" checked={ageClass === ""} onClick={() => onAgeClassChange("")} />
                    <SegmentedElement label="≤ 35 ans" value="35 ans et moins" checked={ageClass === "35 ans et moins"} onClick={() => onAgeClassChange("35 ans et moins")} />
                    <SegmentedElement label="36 – 55 ans" value="36 à 55 ans" checked={ageClass === "36 à 55 ans"} onClick={() => onAgeClassChange("36 à 55 ans")} />
                    <SegmentedElement label="≥ 56 ans" value="56 ans et plus" checked={ageClass === "56 ans et plus"} onClick={() => onAgeClassChange("56 ans et plus")} />
                </SegmentedControl>
            </div>

            <ChartWrapper config={chartConfig} options={chartOptions} constructorType="chart" />

            {chartType === "single" && viewMode === "evolution" && records.length >= 2 && primaryConfig && (() => {
                const first = records[0];
                const last = records[records.length - 1];
                const v1 = first[metrics[0]];
                const v2 = last[metrics[0]];
                if (typeof v1 !== "number" || typeof v2 !== "number") return null;
                const diff = v2 - v1;
                const isPercent = primaryConfig.format === "percent";
                const formattedDiff = isPercent
                    ? `${diff >= 0 ? "+" : ""}${diff.toFixed(1)}\u00a0pp`
                    : `${diff >= 0 ? "+" : ""}${Math.round(diff).toLocaleString("fr-FR")}`;
                return (
                    <p className="fr-text--xs fr-mt-1w" style={{ color: "var(--text-mention-grey)" }}>
                        De {first.annee_universitaire} à {last.annee_universitaire}&nbsp;:{" "}
                        <strong>{formattedDiff}</strong>
                        {!isPercent && <> (soit {((diff / v1) * 100).toFixed(1)}\u00a0% d'évolution)</>}.
                    </p>
                );
            })()}
        </>
    );
}
