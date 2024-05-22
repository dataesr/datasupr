import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { useSearchParams } from "react-router-dom";

import { useQueryResponse } from "../hooks";
import { getLabel } from "../utils";
import Template from "./template";
import { getOptions, getSeries } from "./utils";

export default function PrctIpccReferencesByCountry() {
  const [searchParams] = useSearchParams();
  const currentLang = searchParams.get("language");
  const bool = {
    must: [{ match: { "ipcc.wg.keyword": "2_cross" } }],
  };

  const { data, isLoading } = useQueryResponse(bool, 10, "2cross");

  if (isLoading || !data) return <Template />;

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { series, categories } = getSeries(data);

  const title = getLabel("ipcc_wg", "wg2cross", currentLang);

  const options = getOptions(
    series,
    categories,
    title,
    getLabel("ipcc_wg", "format1", currentLang),
    getLabel("ipcc_wg", "format2", currentLang),
    getLabel("ipcc_wg", "title_x_axis", currentLang),
    getLabel("ipcc_wg", "title_y_axis", currentLang)
  );

  return <HighchartsReact highcharts={Highcharts} options={options} />;
}
