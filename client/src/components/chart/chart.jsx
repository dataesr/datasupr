import React from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

import data from '../../assets/data/all_treso.json';

export default function FinanceGraph () {
    const id_paysage = 's3t8T'
    const etablissement = data?.map((el) => el.etablissement)?.[0]
    const filteredData = data?.filter((el) => el.id_paysage === id_paysage)?.[0].data
        .filter((el) => el.code_indic === 'TR')
        
    console.log('filteredData',filteredData);
    
    const seriesData = filteredData.map((item) => ({
        etab: etablissement,
        source: item.source,
        year: item.year,
        value: item.value
    }));

    const years = [...new Set(seriesData.map((item) => item.year))];

    console.log(seriesData);

    const options = {
        chart: {
            type: 'column',
        },
        title: {
           text: null,
        },
        xAxis : years,
        legend: {
            layout: 'vertical',
            align: 'right',
            verticalAlign: 'middle',
        },
        series: seriesData,
    };

    return (
        <div>
            <HighchartsReact highcharts={Highcharts} options={options} />
        </div>
    );
    

}