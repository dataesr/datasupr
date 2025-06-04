// import { useParams } from "react-router-dom";
// import ChartWrapper from "../../../../../../../components/chart-wrapper";
// import useFacultyMembersByStatus from "../../../api/use-by-status";
// import options from "./options";

// interface StackStatusPerDisciplineBarProps {
//   selectedYear: string;
// }

// const StackStatusPerDisciplineBar: React.FC<
//   StackStatusPerDisciplineBarProps
// > = ({ selectedYear }) => {
//   const { field_id } = useParams<{ field_id?: string }>();

//   // Utilisation du hook directement dans le composant
//   const {
//     data: statusData,
//     isLoading,
//     error,
//   } = useFacultyMembersByStatus(selectedYear, field_id);

//   const config = {
//     id: "StackStatusPerDisciplineBar",
//     idQuery: "StackStatusPerDisciplineBar",
//     title: {
//       fr: field_id
//         ? "Répartition par statut de la discipline sélectionnée"
//         : "Répartition par statut des enseignants par discipline",
//       en: field_id
//         ? "Distribution of faculty members by status for selected field"
//         : "Distribution of faculty members by status and discipline",
//     },
//     description: {
//       fr: field_id
//         ? "Répartition des enseignants par statut pour la discipline sélectionnée"
//         : "Répartition des enseignants par statut et discipline",
//       en: field_id
//         ? "Distribution of faculty members by status for selected field"
//         : "Distribution of faculty members by status and discipline",
//     },
//     integrationURL:
//       "/european-projects/components/pages/analysis/overview/charts/destination-funding",
//   };

//   if (isLoading) {
//     return (
//       <div className="fr-text--center fr-py-3w">
//         Chargement des données de répartition par statut...
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="fr-text--center fr-py-3w fr-text--red">
//         Erreur lors du chargement des données par statut
//       </div>
//     );
//   }

//   if (!statusData || statusData.length === 0) {
//     return (
//       <div className="fr-text--center fr-py-3w">
//         Aucune donnée disponible pour les statuts pour l'année {selectedYear}
//         {field_id && " et la discipline sélectionnée"}
//       </div>
//     );
//   }

//   const chartOptions = options({ statusData, selectedYear });

//   return chartOptions ? (
//     <>
//       <ChartWrapper
//         config={config}
//         options={chartOptions}
//         legend={null}
//         renderData={undefined}
//       />
//     </>
//   ) : (
//     <div className="fr-text--center fr-py-3w">
//       Impossible de générer le graphique pour l'année {selectedYear}
//     </div>
//   );
// };

// export default StackStatusPerDisciplineBar;
