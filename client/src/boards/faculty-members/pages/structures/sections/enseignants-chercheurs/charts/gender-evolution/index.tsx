import { useMemo } from "react";
import ChartWrapper from "../../../../../../../../components/chart-wrapper";
import { createGenderEvolutionOptions } from "./options";

interface GenderEvolutionChartProps {
    genderEvolution: any[];
}

export default function GenderEvolutionChart({
    genderEvolution,
}: GenderEvolutionChartProps) {
    const { options, readingKey } = useMemo(() => {
        if (!genderEvolution?.length) return { options: null, readingKey: null };

        const first = genderEvolution[0];
        const last = genderEvolution[genderEvolution.length - 1];
        const firstFemale = first?.gender_breakdown?.find((g: any) => g.gender === "Féminin")?.count || 0;
        const lastFemale = last?.gender_breakdown?.find((g: any) => g.gender === "Féminin")?.count || 0;
        const firstPct = first?.total > 0 ? ((firstFemale / first.total) * 100).toFixed(1) : "0";
        const lastPct = last?.total > 0 ? ((lastFemale / last.total) * 100).toFixed(1) : "0";

        return {
            options: createGenderEvolutionOptions(genderEvolution),
            readingKey: {
                fr: (
                    <>
                        La part des femmes parmi les enseignants-chercheurs est passée de{" "}
                        <strong>{firstPct}%</strong> en {first._id} à{" "}
                        <strong>{lastPct}%</strong> en {last._id}.
                    </>
                ),
            },
        };
    }, [genderEvolution]);

    if (!options) return null;

    return (
        <ChartWrapper
            config={{
                id: "ec-gender-evolution",
                title: {
                    fr: "Évolution de la parité femmes-hommes",
                    look: "h5" as const,
                },
                readingKey: readingKey || undefined,
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
