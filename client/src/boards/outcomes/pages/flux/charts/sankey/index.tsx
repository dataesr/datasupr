import { useMemo } from "react";

import ChartWrapper from "../../../../../../components/chart-wrapper";
import { type OutcomesFluxLink } from "../../../../api";
import { createSankeyOptions } from "./options";

interface SankeyChartProps {
    hideTitle?: boolean;
    links: OutcomesFluxLink[];
    totalStudents?: number;
}

export default function SankeyChart({ hideTitle, links, totalStudents = 0 }: SankeyChartProps) {
    const options = useMemo(() => {
        if (!links?.length) return null;
        return createSankeyOptions(links, totalStudents);
    }, [links, totalStudents]);

    if (!options) return null;

    return (
        <ChartWrapper
            hideTitle={hideTitle}
            config={{
                id: "outcomes-flux-sankey",
                title: { fr: "Parcours des néo-bacheliers inscrits en L1 en 2019", look: "h4" as const },
            }}
            options={options}
        />
    );
}
