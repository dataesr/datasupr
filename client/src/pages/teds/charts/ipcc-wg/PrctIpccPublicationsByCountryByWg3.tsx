import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { useSearchParams } from "react-router-dom";

import translations from "../../charts-config.json";
import { getSeries, getOptions, getLabel } from "./utils";
import { useQueryResponse } from "../hooks";

export default function PrctIpccReferencesByCountry() {
  const [searchParams] = useSearchParams();
  const currentLang = searchParams.get("language");
  const bool = {
    must: [{ match: { "ipcc.wg.keyword": "3" } }],
  };

  const { data, isLoading } = useQueryResponse(bool, 10, "1");

  if (isLoading) {
    return <div>Loading...</div>;
  }

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { series, categories } = getSeries(data);

  const title = getLabel("ipcc_wg", "wg3", translations, currentLang);

  const options = getOptions(
    series,
    categories,
    title,
    getLabel("ipcc_wg", "format1", translations, currentLang),
    getLabel("ipcc_wg", "format2", translations, currentLang),
    getLabel("ipcc_wg", "title_x_axis", translations, currentLang),
    getLabel("ipcc_wg", "title_y_axis", translations, currentLang)
  );

  return <HighchartsReact highcharts={Highcharts} options={options} />;
}
