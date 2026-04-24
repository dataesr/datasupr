import { useMemo } from "react";

import ChartWrapper from "../../../../../../components/chart-wrapper";
import { createDiplomaDonutOptions } from "./options";

interface DiplomaDonutProps {
    rows: Array<{ diplome: string; effectif: number }>;
    nonDiplomes: { effectif: number };
    lastYearLabel: string;
}

export default function DiplomaDonut({ rows, nonDiplomes, lastYearLabel }: DiplomaDonutProps) {
    const title = `Plus haut diplôme obtenu en ${lastYearLabel}`;
    const options = useMemo(() => {
        if (!rows?.length) return null;
        return createDiplomaDonutOptions(rows, nonDiplomes, title);
    }, [rows, nonDiplomes.effectif, title]);

    if (!options) return null;

    return (
        <ChartWrapper
            config={{
                id: "outcomes-plus-haut-diplome-donut",
                title: { fr: title, look: "h5" as const },
                sources: [
                    {
                        label: { fr: <>MESRE-SIES</> },
                        url: { fr: "https://data.enseignementsup-recherche.gouv.fr" },
                    },
                ],
            }}
            options={options}
        />
    );
}
