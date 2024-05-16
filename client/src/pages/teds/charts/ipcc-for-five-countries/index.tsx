import { getLabel, getOptions } from "./utils";

import ChartWrapper from "../../chart-wrapper";
import Template from "./template";
import translations from "../../charts-config.json";
import useQuery from "./query";
import { useQueryResponse } from "../hooks";
import { useSearchParams } from "react-router-dom";

export default function IpccAll() {
  const [searchParams] = useSearchParams();
  const currentLang = searchParams.get("language") || "FR";

  const { filter_ipcc, filters } = useQuery(translations, currentLang);

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
    return <Template />;
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

  const options = getOptions(
    values,
    countries,
    getLabel("ipcc_wg", "title_structures", translations, currentLang),
    getLabel("ipcc_wg", "title_x_axis", translations, currentLang),
    getLabel("ipcc_wg", "title_y_axis", translations, currentLang)
  );

  Object.assign(options, {
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
  });

  return (
    <ChartWrapper
      id="ipcc_wg"
      options={options}
      legend={<ul className="legend"></ul>}
      display_title={true}
    />
  );
}
