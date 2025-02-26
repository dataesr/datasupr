import { useSearchParams } from "react-router-dom";

import ChartWrapper from "../../chart-wrapper";
import { useQueryResponse } from "../hooks";
import { getLabel } from "../utils";
import bool from "./query";
import Template from "./template";
import { getOptions, getSeries } from "./utils";

export default function IpbesAll() {
  const [searchParams] = useSearchParams();
  const { data, isLoading } = useQueryResponse(bool, 20, "ipbes");
  const currentLang = searchParams.get("language") || "FR";

  if (isLoading || !data) return Template();

  const { series, categories } = getSeries(data);
  const title = getLabel("ipbes_all", "title", currentLang);

  const options = getOptions(
    series,
    categories,
    title,
    getLabel("ipbes_all", "format1", currentLang),
    getLabel("ipbes_all", "format2", currentLang),
    getLabel("ipbes_all", "title_x_axis", currentLang),
    getLabel("ipbes_all", "title_y_axis", currentLang)
  );

  return (
    <ChartWrapper
      id="ipbes_all"
      options={options}
      legend={<ul className="legend"></ul>}
      display_title={true}
    />
  );
}
