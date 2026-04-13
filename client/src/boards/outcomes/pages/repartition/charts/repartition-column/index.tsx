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
                title: { fr: "Répartition selon les inscriptions (en %)", look: "h4" as const },
                comment: {
                    fr: <>Note : ce graphique représente la répartition des néo-bacheliers inscrits en licence en 2019 selon leur situation d'inscription pour chaque année universitaire.</>,
                },
                sources: [{
                    label: { fr: <>MESRE-SIES, système d'information SISE</> },
                    url: { fr: "https://www.enseignementsup-recherche.gouv.fr/" },
                }],
            }}
            options={options}
        />
    );
}
