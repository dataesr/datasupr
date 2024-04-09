import { useQuery } from '@tanstack/react-query';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

const { VITE_APP_SERVER_URL } = import.meta.env;

export default function PrctIpccReferencesByCountry() {
  const query = {
    size: 0,
    query: {
      bool: {
        'must': [{'match': {'ipcc.wg.keyword': '1'}}]
      },
    },
    aggs: {
      by_countries: {
        terms: {
          field: 'countries.keyword',
          size: 10,
        },
      },
    },
    track_total_hits: true,
  }

  const { data, isLoading } = useQuery({
    queryKey: ['ipcc-references_1'],
    queryFn: () => fetch(`${VITE_APP_SERVER_URL}/elasticsearch?index=teds-bibliography`, {
      body: JSON.stringify(query),
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      method: 'POST',
    }).then((response) => response.json())
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const series = (data?.aggregations?.by_countries?.buckets ?? []).map((item: { key: string, doc_count: number }) => ({
    color: item.key === 'France' ? '#cc0000' : '#808080',
    name: item.key,
    y: item.doc_count / data.hits.total.value * 100,
    number: item.doc_count
  }));
  const categories = series.map((country) => country.name +'<br>'+'('+country.number+')');

  const options = {
    chart: { type: 'column' },
    legend: { enabled: false },
    plotOptions: {
      column: {
        dataLabels: { 
          enabled: true,
          format: '{point.y:.1f}%'
        },
      },
    },
    tooltip: { format: '<b>{point.name}</b> is involved in <b>{point.y:.2f}%</b> of IPCC publications' },
    series: [{ data: series }],
    title: { text: 'Part of publications on Physical Sciences by country (WG1 - top 10)' },
    xAxis: { categories: categories , title: { text: 'Country' } },
    yAxis: { title: { text: 'Part of IPCC publications' }, labels: {
      formatter(this: { value: number }) {
        return this.value + '%'; 
      },
    },},
  };

  return (
    <HighchartsReact
      highcharts={Highcharts}
      options={options}
    />
  );
}
