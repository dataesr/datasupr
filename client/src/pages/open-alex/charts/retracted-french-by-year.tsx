import { useQuery } from '@tanstack/react-query';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

export default function RetractedFrenchByYear() {
  const { data, isLoading } = useQuery({
    queryKey: ['OpenAlexFrenchRetractions'],
    queryFn: () => fetch('https://api.openalex.org/works?page=1&filter=is_retracted:true,institutions.country_code:FR,publication_year:2000-&group_by=publication_year').then((response) => response.json())
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const series = (data?.group_by ?? []).sort((a, b) => a.key - b.key)?.map((item) => ({
    color: '#808080',
    name: item.key,
    y: item.count,
  }));
  const categories = series.map((country) => country.name);

  const options = {
    chart: { type: 'column' },
    legend: { enabled: false },
    title: { text: 'Number of French retracted publications by publication year since 2000' },
    xAxis: { categories, title: { text: 'Publication year' } },
    yAxis: { title: { text: 'Number of retracted French publications' } },
    series: [{ data: series }],
    plotOptions: { column: { dataLabels: { enabled: true } } }
  };

  return (
    <HighchartsReact
      highcharts={Highcharts}
      options={options}
    />
  );
}