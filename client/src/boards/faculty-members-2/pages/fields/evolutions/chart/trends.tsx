// import { useMemo } from "react";
// import { CreateChartOptions } from "../../../../components/chart-faculty-members";
// import ChartWrapper from "../../../../../../components/chart-wrapper";
// import { StatusEvolutionChartProps } from "../../types";

// export function EvolutionGlobalChart({
//   evolutionData,
//   disciplineId,
//   isLoading,
// }: StatusEvolutionChartProps) {
//   const config = {
//     id: "faculty-count-evolution",
//     idQuery: "faculty-count-evolution",
//     title: {
//       fr: "Évolution des effectifs enseignants",
//       en: "Evolution of faculty members count",
//     },
//     description: {
//       fr: "Évolution des effectifs enseignants par genre au fil des années",
//       en: "Evolution of faculty members count by gender over years",
//     },
//     integrationURL:
//       "/european-projects/components/pages/analysis/overview/charts/destination-funding",
//   };

//   const specificFieldData = useMemo(() => {
//     if (!disciplineId || !evolutionData?.disciplinesTrend) return null;
//     return evolutionData.disciplinesTrend[disciplineId] || null;
//   }, [evolutionData, disciplineId]);

//   const chartOptions = useMemo(() => {
//     if (!evolutionData?.years?.length) {
//       return null;
//     }

//     const years = evolutionData.years;
//     const isDisciplineSpecific = disciplineId && specificFieldData;

//     const totalCountData = isDisciplineSpecific
//       ? specificFieldData.totalCount
//       : evolutionData.globalTrend.totalCount;

//     const femmesPctData = isDisciplineSpecific
//       ? specificFieldData.femmes_percent
//       : evolutionData.globalTrend.femmes_percent;

//     const hommesPctData = isDisciplineSpecific
//       ? years.map((_, i) => 100 - specificFieldData.femmes_percent[i])
//       : evolutionData.globalTrend.hommes_percent;

//     const femmesData = years.map((_, i) =>
//       Math.round((totalCountData[i] * femmesPctData[i]) / 100)
//     );

//     const hommesData = years.map((_, i) =>
//       Math.round((totalCountData[i] * hommesPctData[i]) / 100)
//     );

//     const chartTitle = isDisciplineSpecific
//       ? `Évolution des effectifs - ${specificFieldData.fieldLabel}`
//       : "Évolution des effectifs enseignants";

//     return CreateChartOptions("column", {
//       chart: {
//         height: 500,
//         type: "column",
//         marginLeft: 10,
//         marginRight: 10,
//         marginBottom: 120,
//       },
//       title: {
//         text: chartTitle,
//         style: { fontSize: "18px", fontWeight: "bold" },
//       },
//       subtitle: {
//         text: `Période de ${years[0]} à ${years[years.length - 1]}`,
//         style: { fontSize: "14px" },
//       },
//       xAxis: {
//         categories: years,
//         title: { text: "Année académique" },
//         labels: { style: { fontSize: "12px" } },
//       },
//       yAxis: {
//         min: 0,
//         title: { text: "Nombre d'enseignants" },
//         labels: {
//           formatter: function () {
//             return this.value?.toLocaleString() ?? "0";
//           },
//         },
//         stackLabels: {
//           enabled: true,
//           formatter: function () {
//             const total = this.total ?? 0;
//             return total >= 10000
//               ? `${Math.round(total / 1000)}k`
//               : total.toLocaleString();
//           },
//           style: {
//             fontWeight: "bold",
//             color: "black",
//             textOutline: "none",
//           },
//         },
//       },
//       tooltip: {
//         shared: false,
//         formatter: function () {
//           const y = this.y ?? 0;
//           const total = totalCountData[this.point?.index ?? 0] ?? 1;
//           const percent = ((y / total) * 100).toFixed(1);

//           return `<b>Année ${this.x}</b><br>
//            <span style="color:${this.color}">\u25CF</span> ${
//             this.series.name
//           }: <b>${y.toLocaleString()}</b><br>
//            <span style="color:#666666">Part: ${percent}% du total</span><br>
//            <span style="color:#000091">Total: ${total.toLocaleString()}</span>`;
//         },
//       },
//       plotOptions: {
//         column: {
//           stacking: "normal",
//           dataLabels: {
//             enabled: false,
//           },
//           borderWidth: 0,
//           pointPadding: 0.1,
//           groupPadding: 0.1,
//         },
//         series: {
//           animation: { duration: 1000 },
//         },
//       },
//       series: [
//         {
//           name: "Hommes",
//           data: hommesData,
//           color: "#6A6A6A",
//           type: "column",
//         },
//         {
//           name: "Femmes",
//           data: femmesData,
//           color: "#EA526F",
//           type: "column",
//         },
//       ],
//       legend: {
//         enabled: true,
//         align: "center",
//         verticalAlign: "bottom",
//         layout: "horizontal",
//       },
//       credits: { enabled: false },
//     });
//   }, [evolutionData, disciplineId, specificFieldData]);

//   if (isLoading) {
//     return (
//       <div className="fr-text--center fr-py-5w">
//         <span
//           className="fr-icon-refresh-line fr-icon--lg fr-icon--spin"
//           aria-hidden="true"
//         ></span>
//         <p className="fr-mt-2w">Chargement des données d'évolution...</p>
//       </div>
//     );
//   }

//   if (!chartOptions) {
//     return (
//       <div className="fr-alert fr-alert--info fr-my-3w">
//         <p>Aucune donnée d'évolution disponible.</p>
//       </div>
//     );
//   }

//   return (
//     <ChartWrapper
//       config={config}
//       options={chartOptions}
//       legend={null}
//       renderData={undefined}
//     />
//   );
// }
