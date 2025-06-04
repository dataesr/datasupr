// import { useMemo } from "react";
// import { CreateChartOptions } from "../../../../components/chart-faculty-members";
// import ChartWrapper from "../../../../../../components/chart-wrapper";
// import { StatusEvolutionChartProps } from "../../types";

// export function StatusEvolutionChart({
//   evolutionData,
//   disciplineId,
//   isLoading,
// }: StatusEvolutionChartProps) {
//   const config = {
//     id: "faculty-status-evolution",
//     idQuery: "faculty-status-evolution",
//     title: {
//       fr: "Évolution de la répartition par statut des enseignants",
//       en: "Evolution of faculty members distribution by status",
//     },
//     description: {
//       fr: "Évolution de la répartition des enseignants par statut au fil des années",
//       en: "Evolution of faculty members distribution by status over years",
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

//     const titulairesPctData = isDisciplineSpecific
//       ? specificFieldData.titulaires_percent
//       : evolutionData.globalTrend.titulaires_percent;

//     const ecPctData = isDisciplineSpecific
//       ? specificFieldData.enseignants_chercheurs_percent
//       : evolutionData.globalTrend.enseignants_chercheurs_percent;

//     const ecAbsolute = years.map((_, i) =>
//       Math.round((totalCountData[i] * ecPctData[i]) / 100)
//     );

//     const titulairesNonECAbsolute = years.map((_, i) =>
//       Math.round(
//         (totalCountData[i] * (titulairesPctData[i] - ecPctData[i])) / 100
//       )
//     );

//     const nonTitulairesAbsolute = years.map((_, i) =>
//       Math.round((totalCountData[i] * (100 - titulairesPctData[i])) / 100)
//     );

//     const chartTitle = isDisciplineSpecific
//       ? `Évolution des effectifs par statut - ${specificFieldData.fieldLabel}`
//       : "Évolution des effectifs enseignants par statut";

//     return CreateChartOptions("area", {
//       chart: {
//         height: 500,
//         type: "area",
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
//         margin: 0,
//         title: { text: "Nombre d'enseignants" },
//         labels: {
//           formatter: function () {
//             return this.value?.toLocaleString() ?? "0";
//           },
//         },
//         stackLabels: {
//           enabled: true,
//           formatter: function () {
//             return this.total?.toLocaleString() ?? "0";
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
//           return `<b>${this.series.name}</b><br>
//             Année ${this.x}: <b>${
//             this.y?.toLocaleString() ?? "0"
//           }</b> enseignants`;
//         },
//       },
//       plotOptions: {
//         area: {
//           stacking: "normal",
//           marker: {
//             enabled: true,
//             radius: 3,
//             symbol: "circle",
//             lineWidth: 1,
//           },
//           dataLabels: {
//             enabled: false,
//           },
//           enableMouseTracking: true,
//           fillOpacity: 0.85,
//           states: {
//             hover: {
//               lineWidth: 2,
//               brightness: 0.1,
//               halo: {
//                 size: 5,
//                 attributes: {
//                   fill: "#ffffff",
//                   opacity: 0.25,
//                 },
//               },
//             },
//           },
//         },
//       },
//       series: [
//         {
//           name: "Non-titulaires",
//           data: nonTitulairesAbsolute,
//           color: "#69A297",
//           type: "area",
//         },
//         {
//           name: "Titulaires (non EC)",
//           data: titulairesNonECAbsolute,
//           color: "#4B9DFF",
//           type: "area",
//         },
//         {
//           name: "Enseignants-chercheurs",
//           data: ecAbsolute,
//           color: "#000091",
//           type: "area",
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
//         <p className="fr-mt-2w">
//           Chargement des données d'évolution de statut...
//         </p>
//       </div>
//     );
//   }

//   if (!chartOptions) {
//     return (
//       <div className="fr-alert fr-alert--info fr-my-3w">
//         <p>Aucune donnée d'évolution de statut disponible.</p>
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
