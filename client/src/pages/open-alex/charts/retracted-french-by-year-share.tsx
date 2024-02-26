import { useQuery } from '@tanstack/react-query';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

export default function RetractedFrenchByYearShare() {
  const { data: data1, isLoading: isLoading1 } = useQuery({
    queryKey: ['OpenAlexFrenchRetractions'],
    queryFn: () => fetch('https://api.openalex.org/works?page=1&filter=is_retracted:true,institutions.country_code:FR,publication_year:2000-&group_by=publication_year').then((response) => response.json())
  });

  const { data: data2, isLoading: isLoading2 } = useQuery({
    queryKey: ['OpenAlexFrenchPublications'],
    queryFn: () => fetch('https://api.openalex.org/works?page=1&filter=institutions.country_code:FR,publication_year:2000-&group_by=publication_year').then((response) => response.json())
  });

  if (isLoading1 || isLoading2) {
    return <div>Loading...</div>;
  }

  const series = (data1?.group_by?.slice(0, 20) ?? []).map((country) => {
    const total = data2.group_by.find((item) => item.key === country.key).count;
    return ({
      color: country.key === 'FR' ? '#cc0000' : '#808080',
      name: country.key_display_name,
      total,
      y: country.count / total * 10000,
    })
  }).sort((a, b) => b.y - a.y);
  const categories = series.map((country) => country.name);

  const options = {
    chart: { type: 'column' },
    legend: { enabled: false },
    plotOptions: { column: { dataLabels: { enabled: true, format: '{y:.2f} ‱' } } },
    series: [{ data: series }],
    title: { text: 'Part of French retracted publications by publication year in ‱ since 2000' },
    xAxis: { categories, title: { text: 'Country' } },
    yAxis: { title: { text: 'Part of retracted publications (‱)' } }
  };

  return (
    <HighchartsReact
      highcharts={Highcharts}
      options={options}
    />
  );
}