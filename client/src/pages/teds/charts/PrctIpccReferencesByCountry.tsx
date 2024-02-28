import { useQuery } from '@tanstack/react-query';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

const { VITE_ES_TOKEN, VITE_ES_URL } = import.meta.env;

export default function NbIpccReferencesByCountry() {
  const headers = new Headers({ 'Authorization': `Basic ${VITE_ES_TOKEN}`, 'Content-Type': 'application/json' });
  const queryElastic = {
    size: 0,
    query: {
      bool: {
        must: [
          {
            bool: {
              should: [
                { term: { 'ipcc.wg.keyword': '1' } },
                { term: { 'ipcc.wg.keyword': '2' } },
                { term: { 'ipcc.wg.keyword': '2_cross' } },
                { term: { 'ipcc.wg.keyword': '3' } },
              ],
              minimum_should_match: 1,
            },
          },
        ],
      },
    },
    aggs: {
      by_countries: {
        terms: {
          field: 'countries.keyword',
          size: 20,
        },
      },
    },
    track_total_hits: true,
  }

  const { data, isLoading } = useQuery({
    queryKey: ['ipcc-references'],
    queryFn: () => fetch(`${VITE_ES_URL}teds-bibliography/_search`, { method: 'POST', headers, body: JSON.stringify(queryElastic) }).then((response) => response.json())
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const series = (data?.aggregations?.by_countries?.buckets ?? []).map((item: { key: string, doc_count: number }) => ({
    color: item.key === 'FR' ? '#cc0000' : '#808080',
    name: item.key,
    y: Math.round((item.doc_count * 100) / data.hits.total.value),
  }));
  const categories = series.map((country) => country.name);

  const options = {
    chart: { type: 'column' },
    legend: { enabled: false },
    plotOptions: { column: { dataLabels: { enabled: true } } },
    series: [{ data: series }],
    title: { text: 'Percentage of IPCC references in which France participated' },
    xAxis: { categories: categories, title: { text: 'Country' } },
    yAxis: { title: { text: 'Percentage of IPCC references' } },
  };

  return (
    <HighchartsReact
      highcharts={Highcharts}
      options={options}
    />
  );
}
