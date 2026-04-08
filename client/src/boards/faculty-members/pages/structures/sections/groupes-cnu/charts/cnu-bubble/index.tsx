import { useMemo } from "react";
import Highcharts from "highcharts";
import HighchartsMore from "highcharts/highcharts-more";
import ChartWrapper from "../../../../../../../../components/chart-wrapper";
import { createCnuBubbleOptions } from "./options";

(HighchartsMore as any)(Highcharts);

interface CnuBubbleChartProps {
    selectedYear: string;
    cnuGroups: any[];
}

export default function CnuBubbleChart({
    selectedYear,
    cnuGroups,
}: CnuBubbleChartProps) {
    const { options, readingKey } = useMemo(() => {
        if (!cnuGroups?.length) return { options: null, readingKey: null };

        const bubbleData = cnuGroups
            .filter((g: any) => (g.totalCount || 0) > 0)
            .map((g: any) => ({
                name: `${g.cnuGroupId} - ${g.cnuGroupLabel}`,
                x: g.femaleCount || 0,
                y: g.maleCount || 0,
                z: g.totalCount || 0,
                maleCount: g.maleCount || 0,
                femaleCount: g.femaleCount || 0,
                totalCount: g.totalCount || 0,
            }));

        const maxValue = Math.max(
            ...bubbleData.map((d) => Math.max(d.x, d.y))
        );

        const aboveParity = bubbleData.filter((d) => d.femaleCount > d.maleCount).length;
        const total = bubbleData.length;

        return {
            options: createCnuBubbleOptions(bubbleData, maxValue),
            readingKey: total > 0 ? {
                fr: (<>
                    Sur <strong>{total}</strong> groupes CNU,{" "}
                    <strong>{aboveParity}</strong> ont une majorité de femmes
                    (au-dessus de la diagonale de parité).
                </>),
            } : null,
        };
    }, [cnuGroups]);

    if (!options) return null;

    return (
        <ChartWrapper
            config={{
                id: "faculty-cnu-bubble",
                title: {
                    fr: `Parité H/F par groupe CNU (${selectedYear})`,
                    look: "h5" as const,
                },
                readingKey: readingKey || undefined,
                comment: {
                    fr: (
                        <>
                            Chaque bulle représente un groupe CNU. L'axe horizontal indique
                            le nombre de femmes, l'axe vertical le nombre d'hommes. La taille
                            de la bulle est proportionnelle à l'effectif total. La diagonale
                            représente la parité parfaite.
                        </>
                    ),
                },
                sources: [
                    {
                        label: { fr: <>MESR-SIES, SISE</> },
                        url: {
                            fr: "https://www.enseignementsup-recherche.gouv.fr/fr/le-systeme-d-information-sur-le-suivi-de-l-etudiant-sise-46229",
                        },
                    },
                ],
            }}
            options={options}
        />
    );
}
