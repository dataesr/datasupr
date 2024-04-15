import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

import { useQueryResponse, useSeries, useOptions } from "./hooks";

export default function PrctIpccReferencesByCountry() {
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
  const { series, categories } = useSeries(data);

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const options = useOptions(series, categories, "IPCC");
  options.title = { text: "Part of IPCC publications by country (top 20)" };

  return <HighchartsReact highcharts={Highcharts} options={options} />;
}
