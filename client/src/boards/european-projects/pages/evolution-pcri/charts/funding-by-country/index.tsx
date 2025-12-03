import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";

import { getData } from "./query.js";
import options from "./options.js";
import { useGetParams, readingKey } from "./utils.js";
import ChartWrapper from "../../../../../../components/chart-wrapper";
import DefaultSkeleton from "../../../../../../components/charts-skeletons/default";
import { useChartColor } from "../../../../../../hooks/useChartColor";
import Legend from "./legend";

export default function FundingByCountry() {
  const [searchParams] = useSearchParams();
  const currentLang = searchParams.get("language") || "fr";
  const params = useGetParams();
  const color = useChartColor();

  const { data, isLoading } = useQuery({
    queryKey: ["fundingByCountry", params],
    queryFn: () => getData(params),
  });

  if (isLoading || !data) return <DefaultSkeleton />;

  const config = {
    id: "fundingByCountryEvolution",
    title: {
      fr: "Évolution des financements de FP6 à Horizon Europe",
      en: "Funding evolution from FP6 to Horizon Europe",
    },
    comment: {
      fr: <>Evolution des financements cumulés obtenus par les pays depuis FP6 jusqu'à Horizon Europe.</>,
      en: <>Evolution of cumulative funding obtained by countries from FP6 to Horizon Europe.</>,
    },
    readingKey: readingKey(data, isLoading),
    integrationURL: "/european-projects/components/pages/evolution-pcri/charts/funding-by-country",
  };

  return (
    <div className={`chart-container chart-container--${color}`}>
      <ChartWrapper
        config={config}
        legend={null}
        options={options(data, currentLang)}
        renderData={() => null} // TODO: add data table
      />
      <Legend />
    </div>
  );
}
