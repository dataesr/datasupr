import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import highchartsMap from "highcharts/modules/map";
import mapDataIE from "../../../assets/regions.json";
import Template from "../../../components/template";

highchartsMap(Highcharts);

type DataProps = {
  reg_id: string,
  value: number,
}[]

export default function FranceMap({ data, isLoading }: { data: DataProps, isLoading: boolean }) {
  if (isLoading) {
    return (
      <Template />
    );
  }

  const mapOptions = {
    chart: {
      map: mapDataIE,
      // backgroundColor: '#161616',
      height: '100%'
    },
    title: {
      text: 'Régions françaises',
      style: {
        color: '#fff',
        fontWeight: 'bold'
      }
    },
    credits: {
      enabled: false
    },
    subtitle: {
      text: 'Carte des régions françaises colorisées en fonction de l\'effectif des étudiants inscrits'
    },
    mapNavigation: {
      enabled: true,
      buttonOptions: {
        verticalAlign: 'bottom'
      }
    },
    colorAxis: {
      min: 0
    },
    series: [{
      data,
      name: 'Effectif étudiants par région',
      states: {
        hover: {
          color: '#2323ff',
        }
      },
      dataLabels: {
        enabled: true,
        format: '{point.name}'
      },
      cursor: 'pointer',
      tooltip: {
        pointFormat: '{point.name}: {point.value} étudiants<br><span style="color:gray;font-size:11px">Cliquez pour plus de détails</span>'
      }
    }],
  }

  return (
    <section>
      <HighchartsReact
        constructorType={'mapChart'}
        highcharts={Highcharts}
        options={mapOptions}
      />
    </section>
  );

}
