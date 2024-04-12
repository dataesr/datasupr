import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import buildSeries from './utils/UseSeries.js';
import QueryResponse from './utils/UseQueryResponse.js'



export default function PrctIpccReferencesByCountry() {

  const body = {
    'must': [{'match': {'ipcc.wg.keyword': '3'}}]
  };

  const {data, isLoading} = QueryResponse(body, 10, '3')

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const {series, categories}= buildSeries(data)


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
    title: { text:  'Part of publications on Mitigations by country (WG3 - top 10)' },
    xAxis: { categories , title: { text: 'Country' } },
    yAxis: { title: { text: 'Part of IPCC publications' }, labels: {
      format: '{value}%'
    },},
  };

  return (
    <HighchartsReact
      highcharts={Highcharts}
      options={options}
    />
  );
}
