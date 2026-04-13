import { useMemo } from "react";

import ChartWrapper from "../../../../../../components/chart-wrapper";
import { type OutcomesFluxLink } from "../../../../api";
import { createSankeyOptions } from "./options";

interface SankeyChartProps {
    hideTitle?: boolean;
    links: OutcomesFluxLink[];
}

export default function SankeyChart({ hideTitle, links }: SankeyChartProps) {
    const options = useMemo(() => {
        if (!links?.length) return null;
        return createSankeyOptions(links);
    }, [links]);

    if (!options) return null;

    return (
        <ChartWrapper
            hideTitle={hideTitle}
            config={{
                id: "outcomes-flux-sankey",
                title: { fr: "Parcours des néo-bacheliers inscrits en L1 en 2019", look: "h4" as const },
                comment: {
                    fr: <>Note : ce graphique représente les flux de néo-bacheliers inscrits en licence en 2019, d'une année à l'année suivante jusqu'à l'année universitaire 2023-2024.</>,
                },
            }}
            options={options}
        />
    );
}
