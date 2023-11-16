import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from "react-router-dom";
import { get1 } from '../../api';

import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import highchartsMap from "highcharts/modules/map";
import mapDataIE from "../../assets/regions.json";
import { Link } from 'dsfr-plus';
highchartsMap(Highcharts);

export function Home() {
  const [searchParams] = useSearchParams();

  const params = [...searchParams].map(([key, value]) => `${key}=${value}`).join('&');
  console.log(params);

  const { data: dataMap, isLoading } = useQuery({
    queryKey: ["atlas/number-of-students-map", params],
    queryFn: () => get1(params)
  })

  if (isLoading) {
    return <div>Loading...</div>
  }

  const mappingRegion = [
    { "R94": "fr-cor" },
    { "R53": "fr-bre" },
    { "R52": "fr-pdl" },
    { "R93": "fr-pac" },
    { "R76": "fr-occ" },
    { "R75": "fr-naq" },
    { "R27": "fr-bfc" },
    { "R24": "fr-cvl" },
    { "R11": "fr-idf" },
    { "R32": "fr-hdf" },
    { "R84": "fr-ara" },
    { "R44": "fr-ges" },
    { "R28": "fr-nor" },
    { "R06": "fr-lre" },
    { "R04": "fr-may" },
    { "R03": "fr-gf" },
    { "R02": "fr-mq" },
    { "R01": "fr-gua" }
  ]

  const data = [];
  mappingRegion.map((regionObject) => {
    const regionKey = Object.keys(regionObject)[0];
    const regionData = dataMap?.data.filter((item: object) => item.geo_id === regionKey);
    // additional effectif
    let effectif = 0;
    regionData?.map((item: object) => {
      effectif += item.effectif;
    })

    data.push([regionObject[regionKey], effectif]);

  })

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
      text: 'Carte des régions françaises colorisées Source map: <a href="http://code.highcharts.com/mapdata/countries/fr/custom/fr-all-mainland.topo.json">France, mainland</a>'
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
      data: data,
      name: 'Effectif étudiants par région',
      states: {
        hover: {
          color: '#34f4cc',
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
    plotOptions: {
      series: {
        point: {
          events: {
            click: function () {
              location.href = './' + this.reg_id;
            }
          }
        }
      }
    },
  }
  console.log(dataMap);

  return (
    <main>

      <HighchartsReact
        constructorType={'mapChart'}
        highcharts={Highcharts}
        options={mapOptions}
      />
      <section>
        <ul>
          <li><Link href="/atlas/en-un-coup-d-oeil?annee_universitaire=2022-23&geo_id=R28">Normandie</Link></li>
          <li><Link href="/atlas/en-un-coup-d-oeil?annee_universitaire=2022-23&geo_id=R76">Occitanie</Link></li>
        </ul>
      </section>
    </main>
  )
}

