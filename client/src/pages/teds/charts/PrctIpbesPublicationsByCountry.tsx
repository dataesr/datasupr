import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

import { useQueryResponse, useSeries, useOptions } from "./hooks";

export default function PrctIpbesPublicationsByCountry() {
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
  const { series, categories } = useSeries(data);

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const options = useOptions(series, categories, "IPBES");
  options.title = { text: "Part of IPBES publications by country (top 20)" };

  return <HighchartsReact highcharts={Highcharts} options={options} />;
}
