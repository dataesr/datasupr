import { useMemo } from "react";

import ChartWrapper from "../../../../../../components/chart-wrapper";
import { createRepartitionOptions } from "./options";

interface RepartitionChartProps {
    hideTitle?: boolean;
    distribution: Array<{ annee_rel: number; situation: string; count: number }>;
    relativeYears: number[];
    yearLabels: Record<number, string>;
}

export default function RepartitionChart({ hideTitle, distribution, relativeYears, yearLabels }: RepartitionChartProps) {
    const options = useMemo(() => {
        if (!distribution?.length) return null;
        return createRepartitionOptions(distribution, relativeYears, yearLabels);
    }, [distribution, relativeYears, yearLabels]);

    if (!options) return null;

    return (
        <ChartWrapper
            hideTitle={hideTitle}
            config={{
                id: "outcomes-repartition",
                title: "Répartition selon les inscriptions (en %)",
            }}
            options={options}
        />
    );
}
