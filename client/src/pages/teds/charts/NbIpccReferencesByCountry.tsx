import { useQuery } from '@tanstack/react-query';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

export default function NbIpccReferencesByCountry() {
  const config = require('./config.json')
  console.log(config)
  const esLogin = console.log(config.ES_LOGIN_TEDS_BACK);
  const esPassword = console.log(config.ES_PASSWORD_TEDS_BACK);
  const authHeader = new Headers({'Authorization': 'Basic '+btoa(esLogin+':'+esPassword), });
  const query_elastic = {
    size : 0,
    query: {
        bool: {
            must: [
                {
                    bool: {
                        should: [{term: {'ipcc.wg.keyword': '1'}}, {term: {'ipcc.wg.keyword': '2'}}, {term: {'ipcc.wg.keyword': '2_cross'}}, {term: {'ipcc.wg.keyword': '3'}}],
                        minimum_should_match: 1
                    }
                }
            ],
            }
        },
        aggs: {
            by_countries: {
                terms: {
                    field: 'countries.keyword', size: 20
                },
            }
        },
        track_total_hits: true
    }

  const { data, isLoading } = useQuery({
    queryKey: ['IpccParticipationsByCountry'],
    queryFn: () => fetch(console.log(config.ES_URL)+'teds-bibliography/_search', { method: 'POST', headers: authHeader , body: JSON.stringify({ query: query_elastic })}).then((response) => response.json())
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }
  
  const data_counts = {};
  data.aggregations.by_countries.buckets.forEach((x: { key: string ; doc_count: number; }) => {
    data_counts[x.key] = Math.round((x.doc_count * 100) / data.hits.total.value);
  });
  
  const categories = Object.keys(data_counts).slice(0, 20);
  
  const series = categories.map((country) => ({
    color: country === 'FR' ? '#cc0000' : '#808080',
    name: country,
    y: data_counts[country],
  }));

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