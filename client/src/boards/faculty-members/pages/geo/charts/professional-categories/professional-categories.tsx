import ChartWrapper from "../../../../../../components/chart-wrapper";
import { ProfessionalCategory } from "../../types";
import options from "./options";

const ProfessionalCategoriesChart = ({
  categories,
}: {
  categories: ProfessionalCategory[];
}) => {
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
