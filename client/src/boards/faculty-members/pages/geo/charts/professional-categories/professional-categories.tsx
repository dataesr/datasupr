import ChartWrapper from "../../../../../../components/chart-wrapper";
import options from "./options";

interface ProfessionalCategoriesChartProps {
  categories: {
    id: string;
    label_fr: string;
    headcount: number;
  }[];
}

const ProfessionalCategoriesChart: React.FC<
  ProfessionalCategoriesChartProps
> = ({ categories }) => {
  const chartOptions = options({ categories });

  const config = {
    id: "professionalCategory",
    idQuery: "professionalCategory",
    title: {
      en: "Répartition des membres du personnel par catégorie professionnelle",
      fr: "Professionnal Categories Distribution",
    },
    description: {
      fr: "Répartition des membres du personnel par catégorie professionnelle",
      en: "Distribution of staff members by professional category",
    },
    integrationURL:
      "/european-projects/components/pages/analysis/overview/charts/destination-funding",
  };

  return chartOptions ? (
    <ChartWrapper
      config={config}
      options={chartOptions}
      legend={null}
      renderData={() => null}
    />
  ) : null;
};

export default ProfessionalCategoriesChart;
