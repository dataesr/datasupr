import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

import { useQueryResponse } from "./hooks";

export default function PrctIpccReferencesFiveCountry() {
  const list_wg = ["1", "2", "2_cross", "3"];

  const filter1 = {
    must: [{ match: { "ipcc.wg.keyword": list_wg[0] } }],
    must_not: [
      { match: { "ipcc.wg.keyword": list_wg[1] } },
      { match: { "ipcc.wg.keyword": list_wg[2] } },
      { match: { "ipcc.wg.keyword": list_wg[3] } },
    ],
  };
  const filter2 = {
    must: [{ match: { "ipcc.wg.keyword": list_wg[1] } }],
    must_not: [
      { match: { "ipcc.wg.keyword": list_wg[0] } },
      { match: { "ipcc.wg.keyword": list_wg[2] } },
      { match: { "ipcc.wg.keyword": list_wg[3] } },
    ],
  };
  const filter2cross = {
    must: [{ match: { "ipcc.wg.keyword": list_wg[2] } }],
    must_not: [
      { match: { "ipcc.wg.keyword": list_wg[0] } },
      { match: { "ipcc.wg.keyword": list_wg[1] } },
      { match: { "ipcc.wg.keyword": list_wg[3] } },
    ],
  };
  const filter3 = {
    must: [{ match: { "ipcc.wg.keyword": list_wg[3] } }],
    must_not: [
      { match: { "ipcc.wg.keyword": list_wg[0] } },
      { match: { "ipcc.wg.keyword": list_wg[1] } },
      { match: { "ipcc.wg.keyword": list_wg[2] } },
    ],
  };
  const filter12 = {
    must: [
      { match: { "ipcc.wg.keyword": list_wg[0] } },
      { match: { "ipcc.wg.keyword": list_wg[1] } },
    ],
    must_not: [
      { match: { "ipcc.wg.keyword": list_wg[2] } },
      { match: { "ipcc.wg.keyword": list_wg[3] } },
    ],
  };

  const filter22cross = {
    must: [
      { match: { "ipcc.wg.keyword": list_wg[1] } },
      { match: { "ipcc.wg.keyword": list_wg[2] } },
    ],
    must_not: [
      { match: { "ipcc.wg.keyword": list_wg[0] } },
      { match: { "ipcc.wg.keyword": list_wg[3] } },
    ],
  };
  const filter23 = {
    must: [
      { match: { "ipcc.wg.keyword": list_wg[1] } },
      { match: { "ipcc.wg.keyword": list_wg[3] } },
    ],
    must_not: [
      { match: { "ipcc.wg.keyword": list_wg[0] } },
      { match: { "ipcc.wg.keyword": list_wg[2] } },
    ],
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

  const filters_names = [
    "Sciences Physique (WG1)",
    "Adaptations (WG2)",
    "Adaptations - risques locaux (WG2 cross)",
    "Atténuations (WG3)",
    "Sciences Physique et Adaptations",
    "Adaptations et Adaptations - risques locaux",
    "Adaptation et Atténuation",
    "Multi WG",
  ];

  const groups = [
    "United States",
    "United Kingdom",
    "Germany",
    "France",
    "China",
  ];

  const tot = [19002, 10400, 6538, 3925, 4084];

  const datas = [
    useQueryResponse(filters[0], 50, `filter_${0}`),
    useQueryResponse(filters[1], 50, `filter_${1}`),
    useQueryResponse(filters[2], 50, `filter_${2}`),
    useQueryResponse(filters[3], 50, `filter_${3}`),
    useQueryResponse(filters[4], 50, `filter_${4}`),
    useQueryResponse(filters[5], 50, `filter_${5}`),
    useQueryResponse(filters[6], 50, `filter_${6}`),
  ];
  const values = [];

  for (let i = 0; i < filters.length; i++) {
    const value = { name: filters_names[i], data: {} };
    const { data, isLoading } = datas[i];
    if (isLoading) {
      return <div>Loading...</div>;
    }
    const by_countries = data.aggregations.by_countries.buckets;

    for (let j = 0; j < by_countries.length; j++) {
      for (let k = 0; k < groups.length; k++) {
        if (groups[k] === by_countries[j].key) {
          value.data[groups[k]] = by_countries[j].doc_count;
          break;
        }
      }
    }

    values.push({
      name: filters_names[i],
      data: [
        value.data[groups[0]],
        value.data[groups[1]],
        value.data[groups[2]],
        value.data[groups[3]],
        value.data[groups[4]],
      ],
    });
  }

  const sum_values = [];

  for (let k = 0; k < 5; k++) {
    sum_values.push(
      tot[k] -
        (values[0].data[k] +
          values[1].data[k] +
          values[2].data[k] +
          values[3].data[k] +
          values[4].data[k] +
          values[5].data[k] +
          values[6].data[k])
    );
  }

  values.push({
    name: "multi WG",
    data: [
      sum_values[0],
      sum_values[1],
      sum_values[2],
      sum_values[3],
      sum_values[4],
    ],
  });

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
      categories: groups,
      title: { text: "Country" },
    },
    yAxis: {
      min: 0,
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
