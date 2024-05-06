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
    should: [
      { term: { "ipbes.chapter.keyword": "1" } },
      { term: { "ipbes.chapter.keyword": "2.1_drivers" } },
      { term: { "ipbes.chapter.keyword": "2.2_nature" } },
      { term: { "ipbes.chapter.keyword": "2.3_ncp" } },
      { term: { "ipbes.chapter.keyword": "3" } },
      { term: { "ipbes.chapter.keyword": "4" } },
      { term: { "ipbes.chapter.keyword": "5" } },
      { term: { "ipbes.chapter.keyword": "6" } },
      { term: { "ipbes.chapter.keyword": "ipbes-global_glossary" } },
    ],
    minimum_should_match: 1,
  };

  const { data, isLoading } = useQueryResponse(bool, 20, "IPBES");

  if (isLoading) {
    return <div>Loading...</div>;
  }

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { series, categories } = getSeries(data);

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const options = getOptions(series, categories, "IPBES");
  options.title = {
    text: getLabel("all_publications_ipbes", translations, currentLang),
  };

  return <HighchartsReact highcharts={Highcharts} options={options} />;
}
