import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";

import { getData } from "./query.js";
import options from "./options.js";
import { useGetParams, readingKey } from "./utils.js";
import ChartWrapper from "../../../../../../components/chart-wrapper";
import DefaultSkeleton from "../../../../../../components/charts-skeletons/default";
import { useChartColor } from "../../../../../../hooks/useChartColor";
import { EPChartsSource, EPChartsUpdateDate } from "../../../../config.js";

import i18n from "./i18n.json";

export default function CountriesRanking() {
  const [searchParams] = useSearchParams();
  const currentLang = searchParams.get("language") || "fr";
  const params = useGetParams();
  const color = useChartColor();

  const { data, isLoading } = useQuery({
    queryKey: ["countriesRanking", params],
    queryFn: () => getData(params),
  });

  if (isLoading || !data) return <DefaultSkeleton />;

  const chartId = "countriesRanking";
  const config = {
    id: chartId,
    title: {
      fr: i18n.title.fr,
      en: i18n.title.en,
    },
    comment: {
      fr: <>{i18n.comment.fr}</>,
      en: <>{i18n.comment.en}</>,
    },
    readingKey: readingKey(data, isLoading),
    source: EPChartsSource,
    updateDate: EPChartsUpdateDate,
    integrationURL: `/integration?chart_id=${chartId}&${params}`,
  };

  return (
    <div className={`chart-container chart-container--${color}`}>
      <span className="chart-badge">Top 15</span>
      <ChartWrapper config={config} legend={null} options={options(data, currentLang)} renderData={() => null} />
    </div>
  );
}
