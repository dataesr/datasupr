import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";

import { GetData } from "./query";
import options from "./options";

import ChartWrapper from "../../../../../../components/chart-wrapper";
import { getDefaultParams } from "./utils";
import { RenderData } from "./render-data";
import DefaultSkeleton from "../../../../../../components/charts-skeletons/default";

const config = {
  id: "mainPartners",
  title: "",
  subtitle: "Principaux partenaires des équipes du pays sélectionné",
  description: "",
  integrationURL:
    "/european-projects/components/pages/analysis/overview/charts/main-beneficiaries",
};

export default function MainPartners() {
  const [searchParams] = useSearchParams();
  const params = getDefaultParams(searchParams);

  const { data, isLoading } = useQuery({
    queryKey: [config.id, params],
    queryFn: () => GetData(params),
  });

  if (isLoading || !data) return <DefaultSkeleton />;

  return <>MainPartners chart</>; //TODO: Implement MainPartners chart
  return (
    <ChartWrapper
      config={config}
      legend={null}
      options={options(data)}
      renderData={RenderData}
    />
  );
}
