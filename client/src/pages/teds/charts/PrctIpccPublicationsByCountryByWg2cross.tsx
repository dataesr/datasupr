import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

import { useQueryResponse, useSeries, useOptions } from "./hooks";

export default function PrctIpccReferencesByCountry() {
  const body = {
    must: [{ match: { "ipcc.wg.keyword": "2_cross" } }],
  };

  const { data, isLoading } = useQueryResponse(body, 10, "2_cross");

  if (isLoading) {
    return <div>Loading...</div>;
  }

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { series, categories } = useSeries(data);

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const options = useOptions(series, categories, "IPCC");
  options.title = {
    text: "Part of publications on local Adaptations by country (WG2 cross chapters - top 10)",
  };

  return <HighchartsReact highcharts={Highcharts} options={options} />;
}
