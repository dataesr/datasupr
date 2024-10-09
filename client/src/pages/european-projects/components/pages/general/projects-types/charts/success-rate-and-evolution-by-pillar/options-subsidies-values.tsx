export default function Options(data) {
  console.log("data", data);

  if (!data) return null;

  // sort selectedCountry by action_id
  const selectedCountry = data.selectedCountry
    .filter((el) => el.ratio && el.ratio !== 0)
    .sort((a, b) => a.id - b.id);

  // sort otherCountries same as selectedCountry
  data.otherCountries.sort((a, b) => {
    return (
      data.selectedCountry.findIndex((item) => item.id === a.id) -
      data.selectedCountry.findIndex((item) => item.id === b.id)
    );
  });

  const otherCountriesSorted = selectedCountry.map((item) => {
    return data.otherCountries.find((otherItem) => otherItem.id === item.id);
  });

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
      categories: selectedCountry.map((item) => item.id),
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
        name: "Pays",
        data: selectedCountry.map((item) => item.ratio),
        color: "#6DD897",
      },
      {
        name: "UE & Etats associés",
        data: otherCountriesSorted.map((item) => item.ratio),
        color: "#09622A",
      },
    ],
  };
}
