import { useMemo } from "react";
import ChartWrapper from "../../../../../../../../components/chart-wrapper";
import { createCategoryChartOptions } from "./options";

interface CategoryChartProps {
  selectedYear: string;
  categoryDistribution: any[];
}

export default function CategoryChart({
  selectedYear,
  categoryDistribution,
}: CategoryChartProps) {
  const { options } = useMemo(() => {
    if (!categoryDistribution?.length) return { options: null };

    const sorted = [...categoryDistribution].sort(
      (a: any, b: any) => (b.total || 0) - (a.total || 0)
    );

    const categories = sorted.map((c: any) => c._id || "Non précisé");
    const maleData = sorted.map((c: any) =>
      c.gender_breakdown?.find((g: any) => g.gender === "Masculin")?.count || 0
    );
    const femaleData = sorted.map((c: any) =>
      c.gender_breakdown?.find((g: any) => g.gender === "Féminin")?.count || 0
    );

    const top = sorted[0];
    return {
      largest: top && (top.total || 0) > 0 ? { name: top._id, total: top.total } : null,
      options: createCategoryChartOptions(categories, maleData, femaleData),
    };
  }, [categoryDistribution]);

  if (!options) return null;

  return (
    <ChartWrapper
      config={{
        id: "faculty-category-distribution",
        title: {
          fr: `Répartition par catégorie de personnel (${selectedYear})`,
          look: "h5" as const,
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
