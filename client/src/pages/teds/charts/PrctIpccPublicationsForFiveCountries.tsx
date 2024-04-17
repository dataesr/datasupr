import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

import { useQueryResponse, useOptions } from "./hooks";

export default function PrctIpccReferencesFiveCountry() {
  const list_wg = ["1", "2", "2_cross", "3"];

  const filter0 = {
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
    useQueryResponse(filter1.body, 50, "filter_0"),
    useQueryResponse(filter2.body, 50, "filter_1"),
    useQueryResponse(filter2cross.body, 50, "filter_2"),
    useQueryResponse(filter3.body, 50, "filter_3"),
    useQueryResponse(filter12.body, 50, "filter_4"),
    useQueryResponse(filter22cross.body, 50, "filter_5"),
    useQueryResponse(filter23.body, 50, "filter_6"),
  ];

  const response_total = useQueryResponse(filter0.body, 50, "filter_7");

  const loadings = responses.map((response) => response.isLoading);
  const isLoad = (currentValue) => currentValue === true;

  if (loadings.some(isLoad)) {
    return <div>Loading...</div>;
  }

  const values = [
    { name: "", data: [] },
    { name: "", data: [] },
    { name: "", data: [] },
    { name: "", data: [] },
    { name: "", data: [] },
    { name: "", data: [] },
    { name: "", data: [] },
  ];

  const buckets = responses.map((response) =>
    response.data.aggregations.by_countries.buckets.filter((country) =>
      countries.includes(country.key)
    )
  );

  values.map((value, index) => {
    (value.name = filters[index].name),
      (value.data = [
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
      ]);
  });

  if (response_total.isLoading) {
    return <div>Loading...</div>;
  }

  const total = countries.map(
    (item) =>
      response_total.data.aggregations.by_countries.buckets.find(
        (country) => country.key === item
      ).doc_count
  );

  const sum_publications = countries.map(
    (item, index) =>
      total[index] -
      responses
        .map(
          (response) =>
            response.data.aggregations.by_countries.buckets.find(
              (country) => country.key === item
            ).doc_count
        )
        .reduce((accumulator, currentValue) => accumulator + currentValue)
  );

  values.push({ name: "Multi WG", data: sum_publications });

  console.log(values);

  const options = useOptions(values, countries, "IPCC");

  Object.assign(options, {
    legend: { enabled: true },
    title: { text: "Part of IPCC publications for five countries" },
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
