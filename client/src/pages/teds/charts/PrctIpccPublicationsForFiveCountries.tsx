//import Highcharts from "highcharts";
//import HighchartsReact from "highcharts-react-official";

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
  /* const tot = {
    "United States": 19002,
    "United Kingdom": 10400,
    Germany: 6538,
    France: 3925,
    China: 4084,
  }; */

  for (let i = 0; i <= filters.length; i++) {
    console.log(i);
    const value = { name: filters_names[i], data: {} };
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const { data, isLoading } = useQueryResponse(filters[i], 50, `filter_${i}`);
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
    /* console.log(value);
    if (i === 0) {
      const values = {
        name: filters_names[i],
        data: [
          value.data[groups[0]],
          value.data[groups[1]],
          value.data[groups[2]],
          value.data[groups[3]],
          value.data[groups[4]],
        ],
      };
      console.log(values);
    } else {
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
      console.log(values);
    } */
  }
  /* const options = {
    chart: { type: "column" },
    legend: { enabled: false },
    plotOptions: {
      column: {
        dataLabels: {
          enabled: true,
          format: "{point.y:.1f}%",
        },
      },
    },
    series: [{ data: values }],
    xAxis: { groups, title: { text: "Country" } },
    yAxis: {
      title: { text: `Part of IPCC publications` },
      labels: {
        format: "{value}%",
      },
    },
    credits: {
      enabled: false,
    },
  }; */
}
