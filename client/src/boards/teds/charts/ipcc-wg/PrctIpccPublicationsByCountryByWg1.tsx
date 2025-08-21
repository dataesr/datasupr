import { getOptions, getSeries } from "./utils";

import { getLabel } from "../utils";
import { useQueryResponse } from "../hooks";
import { useSearchParams } from "react-router-dom";
import ChartWrapper from "../../../../components/chart-wrapper";

import Template from "./template";

export default function PrctIpccReferencesByCountry() {
  const [searchParams] = useSearchParams();
  const currentLang = searchParams.get("language") || "FR";
  const bool = {
    must: [{ match: { "ipcc.wg.keyword": "wg1" } }],
  };

  const { data, isLoading } = useQueryResponse(bool, 10, "1");

  if (isLoading || !data) return Template();

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { series, categories } = getSeries(data);

  const title = getLabel("ipcc_wg", "wg1", currentLang);

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
    id: "ipcc_wg1",
    title: {
      fr: "Groupe de travail 1 : La base scientifique physique",
      en: "Working Group 1: The Physical Science Basis",
    },
  };

  return <ChartWrapper config={chartConfig} options={options} legend={null} />;
}
