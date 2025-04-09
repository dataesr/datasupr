import ChartWrapper from "../../../../components/chart-wrapper";
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

  return chartOptions ? (
    <ChartWrapper
      id="professionalCategory"
      options={chartOptions}
      legend={null}
    />
  ) : null;
};

export default ProfessionalCategoriesChart;
