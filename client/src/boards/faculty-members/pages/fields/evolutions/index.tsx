// import { useMemo } from "react";
// import { Container, Row, Col, Title, Breadcrumb } from "@dataesr/dsfr-plus";
// import { useParams } from "react-router-dom";
// import { Link } from "@dataesr/dsfr-plus";
// import useFacultyMembersEvolution from "../api/use-evolution";
// import { EvolutionGlobalChart } from "./chart/trends";
// import { StatusEvolutionChart } from "./chart/status";
// import useFacultyMembersAgeEvolution from "../api/use-age-evolution";
// import { AgeEvolutionChart } from "./chart/age-evolution";

// export function FieldsEvolution() {
//   const { field_id } = useParams<{ field_id: string }>();
//   const { data: evolutionData, isLoading } = useFacultyMembersEvolution();
//   const { data: ageEvolutionData, isLoading: ageEvolutionLoading } =
//     useFacultyMembersAgeEvolution(field_id);

//   const specificFieldData = useMemo(() => {
//     if (!field_id || !evolutionData?.disciplinesTrend) return null;
//     return evolutionData.disciplinesTrend[field_id] || null;
//   }, [evolutionData, field_id]);

//   return (
//     <Container as="main">
//       <Row>
//         <Col md={12}>
//           <Breadcrumb className="fr-m-0 fr-mt-1w">
//             <Link href="/personnel-enseignant">Personnel enseignant</Link>
//             <Link href="/personnel-enseignant/discipline/vue-d'ensemble/">
//               Vue disciplinaire
//             </Link>
//             <Link>
//               <strong>
//                 {specificFieldData?.fieldLabel || "Évolution des effectifs"}
//               </strong>
//             </Link>
//           </Breadcrumb>

//           <Title as="h2" look="h4" className="fr-mt-4w fr-mb-3w">
//             {specificFieldData
//               ? `Évolution des effectifs - ${specificFieldData.fieldLabel}`
//               : "Évolution des effectifs enseignants"}
//           </Title>
//         </Col>
//       </Row>

//       <Row gutters className="fr-mb-5w">
//         <Col md={6}>
//           <EvolutionGlobalChart
//             evolutionData={evolutionData}
//             disciplineId={field_id}
//             isLoading={isLoading}
//           />
//         </Col>
//         <Col md={6}>
//           <StatusEvolutionChart
//             evolutionData={evolutionData}
//             disciplineId={field_id}
//             isLoading={isLoading}
//           />
//         </Col>
//       </Row>
//       <Row gutters className="fr-mb-5w">
//         <Col md={6}>
//           <AgeEvolutionChart
//             ageEvolutionData={ageEvolutionData}
//             disciplineId={field_id}
//             isLoading={ageEvolutionLoading}
//           />
//         </Col>
//       </Row>
//     </Container>
//   );
// }
