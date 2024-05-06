import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { useSearchParams } from "react-router-dom";

import translations from "./translations.json";
import { getOptions, getLabel } from "./utils";
import { useQueryResponse } from "./hooks";

export default function PrctIpccReferencesByCountry() {
  const [searchParams] = useSearchParams();
  const currentLang = searchParams.get("language");
  const list_wg = ["1", "2", "2_cross", "3"];

  const filter_ipcc = {
    body: {
      should: [
        { term: { "ipcc.wg.keyword": list_wg[0] } },
        { term: { "ipcc.wg.keyword": list_wg[1] } },
        { term: { "ipcc.wg.keyword": list_wg[2] } },
        { term: { "ipcc.wg.keyword": list_wg[3] } },
      ],
      minimum_should_match: 1,
    },
    name: "all",
  };

  const filter_wg1 = {
    body: {
      must: [{ match: { "ipcc.wg.keyword": list_wg[0] } }],
      must_not: [
        { match: { "ipcc.wg.keyword": list_wg[1] } },
        { match: { "ipcc.wg.keyword": list_wg[2] } },
        { match: { "ipcc.wg.keyword": list_wg[3] } },
      ],
    },
    name: getLabel("wg1", translations, currentLang),
  };
  const filter_wg2 = {
    body: {
      must: [{ match: { "ipcc.wg.keyword": list_wg[1] } }],
      must_not: [
        { match: { "ipcc.wg.keyword": list_wg[0] } },
        { match: { "ipcc.wg.keyword": list_wg[2] } },
        { match: { "ipcc.wg.keyword": list_wg[3] } },
      ],
    },
    name: getLabel("wg2", translations, currentLang),
  };
  const filter_wg2cross = {
    body: {
      must: [{ match: { "ipcc.wg.keyword": list_wg[2] } }],
      must_not: [
        { match: { "ipcc.wg.keyword": list_wg[0] } },
        { match: { "ipcc.wg.keyword": list_wg[1] } },
        { match: { "ipcc.wg.keyword": list_wg[3] } },
      ],
    },
    name: getLabel("wg2cross", translations, currentLang),
  };
  const filter_wg3 = {
    body: {
      must: [{ match: { "ipcc.wg.keyword": list_wg[3] } }],
      must_not: [
        { match: { "ipcc.wg.keyword": list_wg[0] } },
        { match: { "ipcc.wg.keyword": list_wg[1] } },
        { match: { "ipcc.wg.keyword": list_wg[2] } },
      ],
    },
    name: getLabel("wg3", translations, currentLang),
  };
  const filter_wg1_and_wg2 = {
    body: {
      must: [
        { match: { "ipcc.wg.keyword": list_wg[0] } },
        { match: { "ipcc.wg.keyword": list_wg[1] } },
      ],
      must_not: [
        { match: { "ipcc.wg.keyword": list_wg[2] } },
        { match: { "ipcc.wg.keyword": list_wg[3] } },
      ],
    },
    name: getLabel("wg1_wg2", translations, currentLang),
  };

  const filter_wg2_and_wg2cross = {
    body: {
      must: [
        { match: { "ipcc.wg.keyword": list_wg[1] } },
        { match: { "ipcc.wg.keyword": list_wg[2] } },
      ],
      must_not: [
        { match: { "ipcc.wg.keyword": list_wg[0] } },
        { match: { "ipcc.wg.keyword": list_wg[3] } },
      ],
    },
    name: getLabel("wg2_wg2cross", translations, currentLang),
  };
  const filter_wg2_and_wg3 = {
    body: {
      must: [
        { match: { "ipcc.wg.keyword": list_wg[1] } },
        { match: { "ipcc.wg.keyword": list_wg[3] } },
      ],
      must_not: [
        { match: { "ipcc.wg.keyword": list_wg[0] } },
        { match: { "ipcc.wg.keyword": list_wg[2] } },
      ],
    },
    name: getLabel("wg2_wg3", translations, currentLang),
  };

  const filters = [
    filter_wg1,
    filter_wg2,
    filter_wg2cross,
    filter_wg3,
    filter_wg1_and_wg2,
    filter_wg2_and_wg2cross,
    filter_wg2_and_wg3,
  ];

  const countries = ["USA", "GBR", "DEU", "FRA", "CHN"];

  const responses = [
    useQueryResponse(filters[0].body, 50, filters[0].name),
    useQueryResponse(filters[1].body, 50, filters[1].name),
    useQueryResponse(filters[2].body, 50, filters[2].name),
    useQueryResponse(filters[3].body, 50, filters[3].name),
    useQueryResponse(filters[4].body, 50, filters[4].name),
    useQueryResponse(filters[5].body, 50, filters[5].name),
    useQueryResponse(filters[6].body, 50, filters[6].name),
  ];

  const response_total = useQueryResponse(
    filter_ipcc.body,
    50,
    filter_ipcc.name
  );

  if (
    responses.map((response) => response.isLoading).some((item) => item) ||
    response_total.isLoading
  ) {
    return <div>Loading...</div>;
  }

  const buckets = responses.map((response) =>
    response.data.aggregations.by_countries.buckets.filter((country) =>
      countries.includes(country.key)
    )
  );

  const values: { name: string; data: number[] }[] = [];

  filters.map((filter, index) => {
    values.push({
      name: filter.name,
      data: [
        buckets[index].find((country) => country.key === countries[0])
          .doc_count,
        buckets[index].find((country) => country.key === countries[1])
          .doc_count,
        buckets[index].find((country) => country.key === countries[2])
          .doc_count,
        buckets[index].find((country) => country.key === countries[3])
          .doc_count,
        buckets[index].find((country) => country.key === countries[4])
          .doc_count,
      ],
    });
  });

  values.push({
    name: "Multi WG",
    data: countries.map(
      (item) =>
        response_total.data.aggregations.by_countries.buckets.find(
          (country) => country.key === item
        ).doc_count -
        responses
          .map(
            (response) =>
              response.data.aggregations.by_countries.buckets.find(
                (country) => country.key === item
              ).doc_count
          )
          .reduce((accumulator, currentValue) => accumulator + currentValue)
    ),
  });

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const options = getOptions(values, countries, "IPCC");

  Object.assign(options, {
    legend: { enabled: true },
    title: {
      text: getLabel(
        "publications_for_five_countries",
        translations,
        currentLang
      ),
    },
    plotOptions: {
      column: {
        stacking: "percent",
        dataLabels: {
          enabled: true,
          format: "{point.percentage:.0f}%",
        },
      },
    },
    tooltip: {
      pointFormat:
        '<span style="color:{series.color}">{series.name}</span>' +
        ": <b>{point.y}</b> ({point.percentage:.0f}%)<br/>",
      shared: true,
    },
    series: values,
  });
  return <HighchartsReact highcharts={Highcharts} options={options} />;
}
