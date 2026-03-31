import { useMemo } from "react";
import ChartWrapper from "../../../../../../../../components/chart-wrapper";
import { createCategoryEvolutionOptions } from "./options";

interface Props {
    categoryEvolution: any[];
}

export default function CategoryEvolutionChart({ categoryEvolution }: Props) {
    const { options, readingKey } = useMemo(() => {
        if (!categoryEvolution?.length) return { options: null, readingKey: null };
        const years = categoryEvolution.map((e: any) => e._id);

        const first = categoryEvolution[0];
        const last = categoryEvolution[categoryEvolution.length - 1];
        const firstTotal = first?.total || 0;
        const lastTotal = last?.total || 0;
        const diff = lastTotal - firstTotal;
        const pct = firstTotal > 0 ? ((diff / firstTotal) * 100).toFixed(1) : "0";

        return {
            options: createCategoryEvolutionOptions(years, categoryEvolution),
            readingKey:
                firstTotal > 0
                    ? {
                        fr: (
                            <>
                                Entre <strong>{first._id}</strong> et{" "}
                                <strong>{last._id}</strong>, l'effectif total est passé de{" "}
                                <strong>{firstTotal.toLocaleString("fr-FR")}</strong> à{" "}
                                <strong>{lastTotal.toLocaleString("fr-FR")}</strong> (
                                {diff >= 0 ? "+" : ""}
                                {pct}%).
                            </>
                        ),
                    }
                    : null,
        };
    }, [categoryEvolution]);

    if (!options) return null;

    return (
        <ChartWrapper
            config={{
                id: "faculty-category-evolution-global",
                title: {
                    fr: "Évolution par catégorie de personnel",
                    look: "h5" as const,
                },
                readingKey: readingKey || undefined,
                comment: {
                    fr: (
                        <>
                            Ce graphique montre l'évolution des effectifs empilés par catégorie
                            de personnel (ensemble du personnel, titulaires et non-titulaires).
                        </>
                    ),
                },
                sources: [
                    {
                        label: { fr: <>MESR-SIES, SISE</> },
                        url: { fr: "https://data.enseignementsup-recherche.gouv.fr" },
                    },
                ],
            }}
            options={options}
        />
    );
}
