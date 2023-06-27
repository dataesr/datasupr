import React from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import graphData from '../../assets/data/prototype_graph.json';

export default function PrototypeGraph() {
  const data = graphData;

  const seriesData = data[0].data.map((item) => ({
    country: item.country_name,
    year: item.year,
    value: item.value,
  }));

  const uniqueCountries = [...new Set(seriesData.map((item) => item.country))];
  const uniqueYears = [...new Set(seriesData.map((item) => item.year))];

  const options = {
    chart: {
      type: 'bar',
    },
    title: {
      text: data[0].label,
      align: 'left',
    },
    xAxis: {
      categories: uniqueCountries,
      title: {
        text: 'Pays',
      },
    },
    yAxis: {
      title: {
        text: 'Valeur',
      },
    },
    tooltip: {
      formatter() {
        const year = this.series.name;
        const value = this.point.y;
        return `En ${year}, il y a eu ${value} projets signés`;
      },
    },
    legend: {
      layout: 'vertical',
      align: 'right',
      verticalAlign: 'middle',
    },
    series: uniqueYears.map((year) => ({
      name: year.toString(),
      data: uniqueCountries.map((country) => seriesData
        .filter((item) => item.year === year && item.country === country)
        .map((item) => item.value)),
    })),
  };

  return (
    <div>
      <HighchartsReact highcharts={Highcharts} options={options} />
    </div>
  );
}
