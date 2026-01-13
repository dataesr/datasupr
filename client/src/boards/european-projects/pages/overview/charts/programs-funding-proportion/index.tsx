import { useQuery } from "@tanstack/react-query";

import { getData } from "./query";
import options from "./options";
import { readingKey, useGetParams, renderDataTable } from "./utils";

import ChartWrapper from "../../../../../../components/chart-wrapper";
import DefaultSkeleton from "../../../../../../components/charts-skeletons/default";
import { EPChartsSource, EPChartsUpdateDate } from "../../../../config.js";

export default function ProgramsFundingProportion() {
  const { params, currentLang } = useGetParams();
  const { data, isLoading } = useQuery({
    queryKey: ["programsFundingProportion", params],
    queryFn: () => getData(params),
  });

  if (isLoading || !data) return <DefaultSkeleton />;

  // TODO: commentaires
  const config = {
    id: "programsFundingProportion",
    comment: {
      fr: <>Part des financement demandés et obtenus par le pays sur l'ensemble des pays</>,
      en: <>Funding requested and obtained by the country on all countries</>,
    },
    readingKey: readingKey(data, isLoading),
    source: EPChartsSource,
    updateDate: EPChartsUpdateDate,
    title: {
      fr: <>Part des financement demandés et obtenus par le pays sur l'ensemble des pays</>,
      en: <>Funding requested and obtained by the country on all countries</>,
    },
    integrationURL: "/european-projects/components/pages/analysis/overview/charts/destination-funding-proportion",
  };

  return <ChartWrapper config={config} options={options(data)} renderData={() => renderDataTable(data, currentLang)} />;
}
