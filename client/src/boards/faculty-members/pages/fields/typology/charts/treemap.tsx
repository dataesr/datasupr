// import { useMemo } from "react";
// import { useParams } from "react-router-dom";
// import ChartWrapper from "../../../../../../components/chart-wrapper";
// import { CreateChartOptions } from "../../../../components/chart-faculty-members";
// import useFacultyMembersByFields from "../../api/use-by-fields";

// interface TreemapData {
//   id: string;
//   name: string;
//   value: number;
//   colorValue: number;
//   maleCount: number;
//   femaleCount: number;
// }

// interface TreemapChartProps {
//   selectedYear: string;
// }

// export function TreemapChart({ selectedYear }: TreemapChartProps) {
//   const { field_id } = useParams<{ field_id?: string }>();

//   const { data: fieldsData, isLoading } =
//     useFacultyMembersByFields(selectedYear);

//   const { data: treemapData, title } = useMemo(() => {
//     if (!fieldsData)
//       return { data: [], title: "Répartition des effectifs par discipline" };

//     let dataToProcess = fieldsData;
//     let chartTitle = "Répartition des effectifs par discipline";

//     if (field_id) {
//       const specificFieldData = fieldsData.find(
//         (d) => d.field_id === field_id || d.field_id === field_id
//       );

//       if (specificFieldData) {
//         if (
//           specificFieldData.cnuGroups &&
//           specificFieldData.cnuGroups.length > 0
//         ) {
//           const cnuGroupsData = specificFieldData.cnuGroups.map((group) => ({
//             id: group.cnuGroupId || "",
//             name: group.cnuGroupLabel || "",
//             value: group.totalCount || 0,
//             colorValue:
//               group.maleCount && group.femaleCount
//                 ? (group.femaleCount / (group.femaleCount + group.maleCount)) *
//                   100
//                 : 50,
//             maleCount: group.maleCount || 0,
//             femaleCount: group.femaleCount || 0,
//           }));

//           chartTitle = `Groupes CNU de ${
//             specificFieldData.fieldLabel || specificFieldData.field_label
//           }`;

//           return { data: cnuGroupsData, title: chartTitle };
//         } else {
//           dataToProcess = [specificFieldData];
//           chartTitle = `Répartition des effectifs: ${
//             specificFieldData.fieldLabel || specificFieldData.field_label
//           }`;
//         }
//       } else {
//         return { data: [], title: chartTitle };
//       }
//     }

//     const processedData = dataToProcess.map((field) => ({
//       id: field.field_id || field.field_id || "",
//       name: field.fieldLabel || field.field_label || "",
//       value: field.totalCount || field.total_count || 0,
//       colorValue:
//         field.maleCount && field.femaleCount
//           ? (field.femaleCount / (field.femaleCount + field.maleCount)) * 100
//           : 50,
//       maleCount: field.maleCount || 0,
//       femaleCount: field.femaleCount || 0,
//     }));

//     return { data: processedData, title: chartTitle };
//   }, [fieldsData, field_id]);

//   const config = {
//     id: "disciplines-treemap",
//     idQuery: "disciplines-treemap",
//     title: {
//       fr: field_id
//         ? "Répartition au sein de la discipline sélectionnée"
//         : "Répartition par statut au sein des disciplines",
//       en: field_id
//         ? "Distribution within the selected discipline"
//         : "Distribution of faculty members by status within disciplines",
//     },
//     description: {
//       fr: field_id
//         ? "Répartition des effectifs pour la discipline sélectionnée"
//         : "Evolution des effectifs enseignants par statut et discipline",
//       en: field_id
//         ? "Distribution of faculty members for the selected discipline"
//         : "Evolution of faculty members by status and discipline",
//     },
//     integrationURL:
//       "/european-projects/components/pages/analysis/overview/charts/destination-funding",
//   };

//   if (isLoading) {
//     return (
//       <div className="fr-text--center fr-py-3w">
//         Chargement des données de répartition...
//       </div>
//     );
//   }

//   if (!treemapData || treemapData.length === 0) {
//     return (
//       <div className="fr-text--center fr-py-3w">
//         Aucune donnée disponible pour la répartition pour l'année {selectedYear}
//         {field_id && " et la discipline sélectionnée"}
//       </div>
//     );
//   }

//   const treemapOptions = CreateChartOptions("treemap", {
//     chart: {
//       type: "treemap",
//       height: 600,
//       marginLeft: 0,
//       style: {
//         fontFamily: "Marianne, sans-serif",
//       },
//     },
//     title: {
//       text: title,
//       style: {
//         color: "#000000",
//         fontSize: "18px",
//         fontWeight: "bold",
//       },
//       align: "left",
//     },
//     subtitle: {
//       text: `Année universitaire ${selectedYear}`,
//       style: {
//         color: "#666666",
//         fontSize: "14px",
//       },
//       align: "left",
//     },
//     tooltip: {
//       formatter: function () {
//         const point = this.point as unknown as TreemapData;
//         const femalePercent = point.femaleCount
//           ? Math.round(
//               (point.femaleCount / (point.femaleCount + point.maleCount)) * 100
//             )
//           : 0;
//         return `<b>${point.name}</b><br>
//                Effectif total: <b>${point.value}</b> personnes<br>
//                <span style="color:#e18b76">Femmes: ${
//                  point.femaleCount
//                } (${femalePercent}%)</span><br>
//                <span style="color:#efcb3a">Hommes: ${point.maleCount} (${
//           100 - femalePercent
//         }%)</span>`;
//       },
//     },
//     colorAxis: {
//       minColor: "#efcb3a",
//       maxColor: "#e18b76",
//       stops: [
//         [0, "#efcb3a"],
//         [0.5, "#EFEFEF"],
//         [1, "#e18b76"],
//       ],
//     },
//     series: [
//       {
//         type: "treemap",
//         layoutAlgorithm: "squarified",
//         data: treemapData,
//         dataLabels: {
//           enabled: true,
//           crop: false,
//           overflow: "allow",
//           style: {
//             textOutline: "1px contrast",
//             fontSize: "13px",
//             fontWeight: "bold",
//           },
//         },
//       },
//     ],
//     credits: { enabled: false },
//   });

//   return (
//     <>
//       <ChartWrapper
//         config={config}
//         options={treemapOptions}
//         legend={null}
//         renderData={undefined}
//       />
//       <div className="fr-text--xs fr-mt-2w" style={{ display: "block" }}>
//         <span className="fr-mr-2w">
//           <span
//             style={{
//               display: "inline-block",
//               width: "10px",
//               height: "10px",
//               backgroundColor: "#efcb3a",
//               marginRight: "5px",
//             }}
//           ></span>
//           Majorité d'hommes
//         </span>
//         <span className="fr-mr-2w">
//           <span
//             style={{
//               display: "inline-block",
//               width: "10px",
//               height: "10px",
//               backgroundColor: "#EFEFEF",
//               marginRight: "5px",
//             }}
//           ></span>
//           Parité
//         </span>
//         <span>
//           <span
//             style={{
//               display: "inline-block",
//               width: "10px",
//               height: "10px",
//               backgroundColor: "#e18b76",
//               marginRight: "5px",
//             }}
//           ></span>
//           Majorité de femmes
//         </span>
//       </div>
//     </>
//   );
// }
