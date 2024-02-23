import { useQuery } from '@tanstack/react-query';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

export default function Welcome() {
  const GetHorizon2020Participation = () => {
    const url = 'https://api.openalex.org/works?page=1&filter=is_retracted:true&group_by=authorships.countries';
    return fetch(url).then((response) => response.json());
  }

  const { data, isLoading } = useQuery({
    queryKey: ['GetOpeAlexRetractions'],
    queryFn: () => GetHorizon2020Participation()
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const series = (data?.group_by?.slice(0, 20) ?? []).map((country) => ({
    color: country.key === 'FR' ? '#cc0000' : '#808080',
    name: country.key_display_name,
    y: country.count,
  }));
  const categories = series.map((country) => country.name);

  const options = {
    chart: { type: 'column' },
    legend: { enabled: false },
    title: { text: 'Number of retracted publications by country (top 20)' },
    xAxis: { categories, title: { text: 'Country' } },
    yAxis: { title: { text: 'Number of publications' } },
    series: [{ data: series }],
  };

  return (
    <HighchartsReact
      highcharts={Highcharts}
      options={options}
    />
  )
}
