import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

import { useQueryResponse } from "./hooks";

export default function PrctIpccReferencesFiveCountry() {
  const list_wg = ["1", "2", "2_cross", "3"];

  const filter0 = {
    body: {
      should: [
        { term: { "ipcc.wg.keyword": "1" } },
        { term: { "ipcc.wg.keyword": "2" } },
        { term: { "ipcc.wg.keyword": "2_cross" } },
        { term: { "ipcc.wg.keyword": "3" } },
      ],
      minimum_should_match: 1,
    },
    name: "all",
  };

  const filter1 = {
    body: {
      must: [{ match: { "ipcc.wg.keyword": list_wg[0] } }],
      must_not: [
        { match: { "ipcc.wg.keyword": list_wg[1] } },
        { match: { "ipcc.wg.keyword": list_wg[2] } },
        { match: { "ipcc.wg.keyword": list_wg[3] } },
      ],
    },
    name: "Sciences Physique (WG1)",
  };
  const filter2 = {
    body: {
      must: [{ match: { "ipcc.wg.keyword": list_wg[1] } }],
      must_not: [
        { match: { "ipcc.wg.keyword": list_wg[0] } },
        { match: { "ipcc.wg.keyword": list_wg[2] } },
        { match: { "ipcc.wg.keyword": list_wg[3] } },
      ],
    },
    name: "Adaptations (WG2)",
  };
  const filter2cross = {
    body: {
      must: [{ match: { "ipcc.wg.keyword": list_wg[2] } }],
      must_not: [
        { match: { "ipcc.wg.keyword": list_wg[0] } },
        { match: { "ipcc.wg.keyword": list_wg[1] } },
        { match: { "ipcc.wg.keyword": list_wg[3] } },
      ],
    },
    name: "Adaptations - risques locaux (WG2 cross)",
  };
  const filter3 = {
    body: {
      must: [{ match: { "ipcc.wg.keyword": list_wg[3] } }],
      must_not: [
        { match: { "ipcc.wg.keyword": list_wg[0] } },
        { match: { "ipcc.wg.keyword": list_wg[1] } },
        { match: { "ipcc.wg.keyword": list_wg[2] } },
      ],
    },
    name: "Atténuations (WG3)",
  };
  const filter12 = {
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
    name: "Sciences Physique et Adaptations",
  };

  const filter22cross = {
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
    name: "Adaptations et Adaptations - risques locaux",
  };
  const filter23 = {
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
    name: "Adaptation et Atténuation",
  };

  const filters = [
    filter0,
    filter1,
    filter2,
    filter2cross,
    filter3,
    filter12,
    filter22cross,
    filter23,
  ];

  const countries = [
    "United States",
    "United Kingdom",
    "Germany",
    "France",
    "China",
  ];

  const responses = [
    useQueryResponse(filter0.body, 50, "filter_7"),
    useQueryResponse(filter1.body, 50, "filter_0"),
    useQueryResponse(filter2.body, 50, "filter_1"),
    useQueryResponse(filter2cross.body, 50, "filter_2"),
    useQueryResponse(filter3.body, 50, "filter_3"),
    useQueryResponse(filter12.body, 50, "filter_4"),
    useQueryResponse(filter22cross.body, 50, "filter_5"),
    useQueryResponse(filter23.body, 50, "filter_6"),
  ];

  const loadings = responses.map((response) => response.isLoading);
  const isLoad = (currentValue) => currentValue === true;

  if (loadings.some(isLoad)) {
    return <div>Loading...</div>;
  }

  const total = countries.map(
    (item) =>
      responses[0].data.aggregations.by_countries.buckets.find(
        (country) => country.key === item
      ).doc_count
  );

  const values = [{}, {}, {}, {}, {}, {}, {}];
  const c = [];
  const publicationNumber = [];

  //filters.map((filter, index) => (values[index]["name"] = filter[index].name));

  responses.map((response) =>
    publicationNumber.push(
      response.data.aggregations.by_countries.buckets
        .filter((country) => countries.includes(country.key))
        .forEach((country) => (c[country.key] = country.doc_count))
    )
  );

  console.log(c);

  const options = {
    chart: { type: "column" },
    title: { text: "Part of IPCC publications for five countries" },
    legend: { enabled: true },
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
    xAxis: {
      categories: countries,
      title: { text: "Country" },
    },
    yAxis: {
      title: {
        text: "Part of IPCC publications",
      },
    },
    credits: {
      enabled: false,
    },
  };
  return <HighchartsReact highcharts={Highcharts} options={options} />;
}
