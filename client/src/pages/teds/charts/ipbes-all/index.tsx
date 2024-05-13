import { getLabel, getOptions, getSeries } from "./utils";
import { useQueryResponse } from "../hooks";
import { useSearchParams } from "react-router-dom";
import bool from "./query";
import ChartWrapper from "../../chart-wrapper";
import Template from "./template";
import translations from "../../charts-config.json";

export default function IpbesAll() {
  const [searchParams] = useSearchParams();
  const { data, isLoading } = useQueryResponse(bool, 20, "");
  const currentLang = searchParams.get("language");

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const { series, categories } = getSeries(data);
  const title = getLabel("ipbes_all", "title", translations, currentLang);

  const options = getOptions(series, categories, "IPBES", title);

  if (isLoading || !data) return <Template />;
  return (
    <ChartWrapper
      id="ipbes_all"
      options={options}
      legend={<ul className="legend"></ul>}
    />
  );
}
