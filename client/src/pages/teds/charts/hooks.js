import { useQuery } from "@tanstack/react-query";

const { VITE_APP_SERVER_URL } = import.meta.env;

function useBuildQuery(bool, size) {
  return {
    size: 0,
    query: {
      bool,
    },
    aggs: {
      by_countries: {
        terms: {
          field: "countries.keyword",
          size,
        },
      },
    },
    track_total_hits: true,
  };
}

function useQueryResponse(body, s, i) {
  const { data, isLoading } = useQuery({
    queryKey: [`ipcc-references_${i}`],
    queryFn: () =>
      fetch(`${VITE_APP_SERVER_URL}/elasticsearch?index=teds-bibliography`, {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        body: JSON.stringify(useBuildQuery(body, s)),
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
        method: "POST",
      }).then((response) => response.json()),
  });

  return { data, isLoading };
}

function useSeries(data) {
  const series = (data?.aggregations?.by_countries?.buckets ?? []).map(
    (item) => ({
      color: item.key === "France" ? "#cc0000" : "#808080",
      name: item.key,
      y: (item.doc_count / data.hits.total.value) * 100,
      number: item.doc_count,
    })
  );
  const categories = series.map(
    (country) => `${country.name} <br> (${country.number})`
  );

  return { series, categories };
}

function useOptions(series, categories, ip) {
  return {
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
    tooltip: {
      format: `<b>{point.name}</b> is involved in <b>{point.y:.2f}%</b> of ${ip} publications`,
    },
    series: [{ data: series }],
    xAxis: { categories, title: { text: "Country" } },
    yAxis: {
      title: { text: `Part of ${ip} publications` },
      labels: {
        format: "{value}%",
      },
    },
    credits: {
      enabled: false,
    },
  };
}

export { useBuildQuery, useQueryResponse, useSeries, useOptions };
