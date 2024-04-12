import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import buildSeries from './utils/UseSeries.js';
import QueryResponse from './utils/UseQueryResponse.js'



export default function PrctIpccReferencesByCountry() {

  const body = {
    should: [
      { term: { 'ipcc.wg.keyword': '1' } },
      { term: { 'ipcc.wg.keyword': '2' } },
      { term: { 'ipcc.wg.keyword': '2_cross' } },
      { term: { 'ipcc.wg.keyword': '3' } },
    ],
    minimum_should_match: 1,
  };

  const {data, isLoading} = QueryResponse(body, 20, '')

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
    title: { text: 'Part of IPCC references by country (top 20)' },
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
