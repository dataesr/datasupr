import React from "react";
import Options from "./options";
import ChartWrapper from "../../../../components/chart-wrapper";

interface Subject {
  id: string;
  label_fr: string;
  headcount: number;
}

interface CNUPieChartProps {
  subjects: Subject[];
}

const CNUPieChart: React.FC<CNUPieChartProps> = ({ subjects }) => {
  const chartOptions = Options({ subjects: subjects });

  return chartOptions ? (
    <ChartWrapper id="facultyMembersCNU" options={chartOptions} legend={""} />
  ) : null;
};

export default CNUPieChart;
