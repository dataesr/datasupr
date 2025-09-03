import { getOptions, getSeries } from "./utils";

import ChartWrapper from "../../../../components/chart-wrapper";

import Template from "./template";
import { getLabel } from "../utils";
import { useQueryResponse } from "../hooks";
import { useSearchParams } from "react-router-dom";

export default function PrctIpccReferencesByCountry() {
  const [searchParams] = useSearchParams();
  const currentLang = searchParams.get("language") || "FR";
  const bool = {
    must: [{ match: { "ipcc.wg.keyword": "wg2_cross" } }],
  };

  const { data, isLoading } = useQueryResponse(bool, 10, "2cross");

  if (isLoading || !data) return Template();

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

  const chartConfig = {
    id: "ipcc_wg2-cross",
    title: {
      fr: "Groupe de travail 2 - cross",
      en: "Working Group 2 - cross",
    },
  };

  return <ChartWrapper config={chartConfig} options={options} legend={null} />;
}
