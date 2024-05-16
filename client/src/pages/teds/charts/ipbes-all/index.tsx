import { getLabel, getOptions, getSeries } from "./utils";

import ChartWrapper from "../../chart-wrapper";
import Template from "./template";
import bool from "./query";
import translations from "../../charts-config.json";
import { useQueryResponse } from "../hooks";
import { useSearchParams } from "react-router-dom";

export default function IpccAll() {
  const [searchParams] = useSearchParams();
  const { data, isLoading } = useQueryResponse(bool, 20, "");
  const currentLang = searchParams.get("language");

  if (isLoading || !data) return <Template />;

  const { series, categories } = getSeries(data);
  const title = getLabel("ipbes_all", "title", translations, currentLang);

  const options = getOptions(
    series,
    categories,
    title,
    getLabel("ipbes_all", "description", translations, currentLang),
    getLabel("ipbes_all", "source", translations, currentLang),
    getLabel("ipbes_all", "format1", translations, currentLang),
    getLabel("ipbes_all", "format2", translations, currentLang),
    getLabel("ipbes_all", "title_x_axis", translations, currentLang),
    getLabel("ipbes_all", "title_y_axis", translations, currentLang)
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
