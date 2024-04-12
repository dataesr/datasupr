import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import buildSeries from './utils/UseSeries.js';
import QueryResponse from './utils/UseQueryResponse.js'



export default function PrctIpbesPublicationsByCountry() {

  const body = {
    should: [
      { term: { 'ipbes.chapter.keyword': '1' } },
      { term: { 'ipbes.chapter.keyword': '2.1' } },
      { term: { 'ipbes.chapter.keyword': '2.2' } },
      { term: { 'ipbes.chapter.keyword': '2.3' } },
      { term: { 'ipbes.chapter.keyword': '3' } },
      { term: { 'ipbes.chapter.keyword': '4' } },
      { term: { 'ipbes.chapter.keyword': '5' } },
      { term: { 'ipbes.chapter.keyword': '6' } },
      { term: { 'ipbes.chapter.keyword': 'glossary' } },
    ],
    minimum_should_match: 1,
  };

  const {data, isLoading} = QueryResponse(body, 20, 'ipbes')

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
    tooltip: { format: '<b>{point.name}</b> is involved in <b>{point.y:.2f}%</b> of IPBES publications' },
    series: [{ data: series }],
    title: { text: 'Part of IPBES references by country (top 20)' },
    xAxis: { categories , title: { text: 'Country' } },
    yAxis: { title: { text: 'Part of IPBES publications' }, labels: {
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