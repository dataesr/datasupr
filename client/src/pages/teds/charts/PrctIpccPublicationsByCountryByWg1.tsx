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
    must: [{ match: { "ipcc.wg.keyword": "1" } }],
  };

  const { data, isLoading } = useQueryResponse(bool, 10, "1");

  if (isLoading) {
    return <div>Loading...</div>;
  }

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { series, categories } = getSeries(data);

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const options = getOptions(series, categories, "IPCC");
  options.title = {
    text: getLabel("wg1", translations, currentLang),
  };

  return <HighchartsReact highcharts={Highcharts} options={options} />;
}
