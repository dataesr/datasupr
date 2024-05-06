import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { useSearchParams } from "react-router-dom";

import translations from "./translations.json";
import { getSeries, getOptions, getLabel } from "./utils";
import { useQueryResponse } from "./hooks";

export default function PrctIpccReferencesByCountry() {
  const [searchParams] = useSearchParams();
  const currentLang = searchParams.get("language");
  const bool = {
    should: [
      { term: { "ipcc.wg.keyword": "1" } },
      { term: { "ipcc.wg.keyword": "2" } },
      { term: { "ipcc.wg.keyword": "2_cross" } },
      { term: { "ipcc.wg.keyword": "3" } },
    ],
    minimum_should_match: 1,
  };

  const { data, isLoading } = useQueryResponse(bool, 20, "");

  if (isLoading) {
    return <div>Loading...</div>;
  }

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { series, categories } = getSeries(data);

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const options = getOptions(series, categories, "IPCC");
  options.title = {
    text: getLabel("all_publications_ipcc", translations, currentLang),
  };

  return <HighchartsReact highcharts={Highcharts} options={options} />;
}
