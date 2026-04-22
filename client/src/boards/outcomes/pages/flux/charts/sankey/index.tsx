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
                    fr: (
                        <div>
                            <p>
                                <b>Note : </b>
                                ce graphique représente les flux de néo-bacheliers inscrits en licence en 2019, d'une année à l'année suivante jusqu'à l'année universitaire 2023-2024.
                            </p>
                            <p>
                                Pour des raisons de confidentialité, certaines données ont été bruitées. Les taux d'inscription présentés peuvent différer des valeurs réelles ; pour consulter les données exactes, veuillez vous référer au second onglet (l'histogramme sur la répartition des inscriptions).
                            </p>
                            <p>
                                <b>Source : </b>
                                MESRE-SIES, système d'information SISE, enquêtes menées par le SIES auprès des établissements de l'enseignement supérieur. MEN-DEPP, systèmes d'informations SCOLARITE et SIFA, enquêtes menées par la DEPP auprès d'établissements du secondaire et de centres de formation d'apprentis (CFA).
                            </p>
                            <p>
                                <b>Champ : </b>
                                les néo-bacheliers inscrits en licence en université à la rentrée 2019 en France.
                            </p>
                        </div>
                    ),
                },
            }}
            options={options}
        />
    );
}
