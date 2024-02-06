import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

type TrendGraphProps = {
  color?: string,
  data: number[],
};

export default function TrendGraph({
  color = '#000',
  data = [],
}: TrendGraphProps) {

  const options = {
    chart: {
      type: 'spline',
      height: '90px',
    },
    credits: { enabled: false },
    legend: { enabled: false },
    exporting: { enabled: false },
    title: { text: '' },
    yAxis: { visible: false },
    xAxis: { visible: false },
    plotOptions: {
      spline: {
        lineWidth: 4,
        states: {
          hover: {
            lineWidth: 5
          }
        },
        marker: {
          enabled: false
        },
      },
      series: {
        label: {
          connectorAllowed: false
        },
        pointStart: 2010
      }
    },
    colors: [color],
    series: [{
      name: 'Effectif étudiants',
      data
    }],

  }

  return (
    <div className="highcharts-container">
      <figure className="highcharts-figure">
        <HighchartsReact
          highcharts={Highcharts}
          options={options}
        />
      </figure>
      {/* <p className="fr-card__desc card-description fr-px-5w">
        Annee universitaire {currentYear}
      </p> */}
    </div>
  )
}