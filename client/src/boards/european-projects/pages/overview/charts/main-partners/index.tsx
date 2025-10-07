import { useQuery } from "@tanstack/react-query";

import { GetData } from "./query";
import options from "./options";

import ChartWrapper from "../../../../../../components/chart-wrapper";
import { useGetParams } from "./utils";
import { RenderData } from "./render-data";
import DefaultSkeleton from "../../../../../../components/charts-skeletons/default";
import { useSearchParams } from "react-router-dom";

const config = {
  id: "mainPartners",
  title: "Principaux bénéficiaires du pays sélectionné",
  integrationURL: "/european-projects/components/pages/analysis/overview/charts/main-beneficiaries",
};

export default function MainPartners() {
  const params = useGetParams();
  const [searchParams] = useSearchParams();
  const currentLang = searchParams.get("language") || "fr";

  const { data, isLoading } = useQuery({
    queryKey: [config.id, params],
    queryFn: () => GetData(params),
  });

  if (isLoading || !data) return <DefaultSkeleton />;

  return <ChartWrapper config={config} legend={null} options={options(data, currentLang)} renderData={RenderData} />;
}
