import * as Highcharts from "highcharts";

interface DataItem {
  id: number;
  ratio: number;
  total_coordination_number_successful: number;
  total_coordination_number_evaluated: number;
}

interface ChartData {
  selectedCountry: DataItem[];
  otherCountries: DataItem[];
}

export default function Options(data: ChartData): Highcharts.Options | null {
  if (!data) return null;

  // sort selectedCountry by action_id
  const selectedCountry = data.selectedCountry.filter((el) => el.ratio && el.ratio !== 0).sort((a, b) => a.id - b.id);

  // sort otherCountries same as selectedCountry
  data.otherCountries.sort((a, b) => {
    return data.selectedCountry.findIndex((item) => item.id === a.id) - data.selectedCountry.findIndex((item) => item.id === b.id);
  });

  const otherCountriesSorted = selectedCountry
    .map((item) => {
      return data.otherCountries.find((otherItem) => otherItem.id === item.id);
    })
    .filter((item): item is DataItem => item !== undefined);

  return {
    chart: {
      type: "column",
      height: 500,
      backgroundColor: "transparent",
    },
    title: { text: "" },
    legend: { enabled: false },
    credits: { enabled: false },

    xAxis: {
      categories: selectedCountry.map((item) => item.id.toString()),
      crosshair: true,
      accessibility: {
        description: "Actions",
      },
    },
    yAxis: {
      min: 0,
      title: {
        text: "(%)",
      },
    },
    tooltip: {
      valueSuffix: " (%)",
    },
    plotOptions: {
      column: {
        pointPadding: 0.2,
        borderWidth: 0,
      },
    },
    series: [
      {
        type: "column",
        name: "Pays",
        data: selectedCountry.map((item) => (item.total_coordination_number_successful * 100) / item.total_coordination_number_evaluated),
        color: "#6DD897",
      } as Highcharts.SeriesColumnOptions,
      {
        type: "column",
        name: "UE & Etats associés",
        data: otherCountriesSorted.map((item) => (item.total_coordination_number_successful * 100) / item.total_coordination_number_evaluated),
        color: "#09622A",
      } as Highcharts.SeriesColumnOptions,
    ],
  };
}
