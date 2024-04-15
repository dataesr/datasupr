import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

import { useQueryResponse, useSeries, useOptions } from "./hooks";

export default function PrctIpccReferencesByCountry() {
  const bool = {
    must: [{ match: { "ipcc.wg.keyword": "3" } }],
  };

  const { data, isLoading } = useQueryResponse(bool, 10, "3");

  if (isLoading) {
    return <div>Loading...</div>;
  }

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { series, categories } = useSeries(data);

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const options = useOptions(series, categories, "IPCC");
  options.title = {
    text: "Part of publications on Mitigations by country (WG3 - top 10)",
  };

  return <HighchartsReact highcharts={Highcharts} options={options} />;
}
