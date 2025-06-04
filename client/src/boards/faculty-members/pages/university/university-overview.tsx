// import {
//   Container,
//   Row,
//   Col,
//   Title,
//   Breadcrumb,
//   Link,
//   Text,
// } from "@dataesr/dsfr-plus";
// import { useState, useEffect } from "react";
// // import { useNavigate } from "react-router-dom";
// import YearSelector from "../../filters";
// import useFacultyMembersByUniversity from "./api/use-filters";
// import GeneralIndicatorsCard from "../../components/general-indicators-card";
// import { EstablishmentTypeChart } from "./charts/structure-type/structure";
// import { GenderPerStructureTypeChart } from "./charts/gender/gender-per-structure-type";
// import useFacultyMembersByEstablishmentType from "../fields/api/use-by-univ";

// export default function UniversityOverview() {
//   // const navigate = useNavigate();
//   const [selectedYear, setSelectedYear] = useState("");

//   const {
//     data: univData,
//     isLoading,
//     isError,
//     error,
//   } = useFacultyMembersByUniversity(undefined, selectedYear || undefined);

//   const { data: establishmentData, isLoading: establishmentLoading } =
//     useFacultyMembersByEstablishmentType(selectedYear);

//   const genderData = establishmentData?.establishmentTypes?.find(
//     (item) => item?.["type"] == "Université"
//   );

//   // console.log(genderData);

//   const [availableYears, setAvailableYears] = useState<string[]>([]);
//   const [universities, setUniversities] = useState<
//     { geo_id: string; geo_name: string }[]
//   >([]);

//   useEffect(() => {
//     if (univData) {
//       const years = univData.available_years || [];
//       setAvailableYears(years);

//       if (univData.universities) {
//         setUniversities(univData.universities);
//       }

//       if (years.length > 0 && !selectedYear) {
//         setSelectedYear(univData.latest_year || years[years.length - 1]);
//       }
//     }
//   }, [univData, selectedYear]);

//   if (isLoading) {
//     return <div>Chargement des données...</div>;
//   }

//   if (isError) {
//     return <div>Erreur: {(error as Error)?.message}</div>;
//   }

//   // const navigateToUniversity = (univId: string) => {
//   //   navigate(`/personnel-enseignant/universite/vue-d'ensemble/${univId}`);
//   // };

//   return (
//     <Container as="main">
//       <Row>
//         <Col md={9}>
//           <Breadcrumb className="fr-m-0 fr-mt-1w">
//             <Link href="/personnel-enseignant">Personnel enseignant</Link>
//             <Link>
//               <strong>Vue par établissement</strong>
//             </Link>
//           </Breadcrumb>
//           <Title as="h3" look="h5" className="fr-mt-5w">
//             Explorer par établissement
//           </Title>
//         </Col>
//         <Col md={3} style={{ textAlign: "right" }}>
//           <YearSelector
//             years={availableYears}
//             selectedYear={selectedYear}
//             onYearChange={setSelectedYear}
//           />
//         </Col>
//       </Row>

//       {univData?.annual_summary && (
//         <Row className="fr-mt-2w">
//           <Row>
//             <Col md={8} className="fr-pr-6w">
//               <Text>
//                 Desriptif du périmètre des établissements du programme 150.{" "}
//                 <br />
//                 Lorem ipsum dolor sit amet, consectetur adipiscing elit.
//                 Phasellus vitae lobortis sem. Quisque vel ex a elit facilisis
//                 rhoncus. Morbi eleifend bibendum orci vel aliquet. Fusce a neque
//                 dui. Cras molestie quam quis libero ullamcorper viverra. Sed
//                 rutrum placerat nibh ut tristique. Cras egestas felis a
//                 scelerisque dignissim. Donec placerat nulla dapibus, efficitur
//                 ex non, vehicula sapien. Aenean vehicula vitae eros ut egestas.
//                 Maecenas lorem massa, vulputate id leo id, aliquet ornare mi.
//                 Etiam vitae ipsum ipsum. Cras fermentum lobortis mauris eget
//                 malesuada. Sed in consequat elit, eu fringilla magna.
//               </Text>
//             </Col>
//             <Col md={4}>
//               <GeneralIndicatorsCard structureData={univData?.annual_summary} />
//             </Col>
//           </Row>
//           <Col>
//             {/* <Title as="h4" look="h6">
//               Statistiques globales pour l'année {selectedYear}
//             </Title>
//             <Row className="fr-mt-2w">
//               {univData.annual_summary.length > 0 && (
//                 <>
//                   <Col md={3}>
//                     <div className="fr-p-2w fr-mb-2w">
//                       <Title as="h5" look="h6">
//                         Établissements
//                       </Title>
//                       <Title as="h6" look="h3">
//                         {univData.annual_summary[0].establishment_count}
//                       </Title>
//                     </div>
//                   </Col>
//                   <Col md={3}>
//                     <div className="fr-p-2w fr-mb-2w">
//                       <Title as="h5" look="h6">
//                         Effectif total
//                       </Title>
//                       <Title as="h6" look="h3">
//                         {univData.annual_summary[0].total_headcount}
//                       </Title>
//                     </div>
//                   </Col>
//                   <Col md={3}>
//                     <div className="fr-p-2w fr-mb-2w">
//                       <Title as="h5" look="h6">
//                         Répartition F/H
//                       </Title>
//                       <Title as="h6" look="h3">
//                         {univData.annual_summary[0].woman_percentage.toFixed(1)}
//                         % /{" "}
//                         {univData.annual_summary[0].man_percentage.toFixed(1)}%
//                       </Title>
//                     </div>
//                   </Col>
//                   <Col md={3}>
//                     <div className="fr-p-2w fr-mb-2w">
//                       <Title as="h5" look="h6">
//                         Titulaires
//                       </Title>
//                       <Title as="h6" look="h3">
//                         {univData.annual_summary[0].titular_count}
//                       </Title>
//                     </div>
//                   </Col>
//                 </>
//               )}
//             </Row> */}
//             {/* {console.log(univData)} */}
//             {/* Section pour la distribution par domaine - à ajouter si vous implémentez l'API correspondante */}
//             {/* {univData?.field_distribution && (
//               <div className="fr-mt-5w">
//                 <Title as="h4" look="h5">
//                   Répartition par domaine scientifique ({selectedYear})
//                 </Title>
//                 <table className="fr-table fr-table--bordered fr-mt-2w">
//                   <thead>
//                     <tr>
//                       <th scope="col">Domaine</th>
//                       <th scope="col">Effectif</th>
//                       <th scope="col">% du total</th>
//                       <th scope="col">Femmes</th>
//                       <th scope="col">Hommes</th>
//                       <th scope="col">% Femmes</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {univData.field_distribution.map((field) => (
//                       <tr key={field.field_id}>
//                         <td>{field.field_label}</td>
//                         <td>{field.count.toLocaleString()}</td>
//                         <td>{field.percentage}%</td>
//                         <td>{field.womanCount.toLocaleString()}</td>
//                         <td>{field.manCount.toLocaleString()}</td>
//                         <td>
//                           {Math.round((field.womanCount / field.count) * 100)}%
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>
//             )} */}
//             {/* <table className="fr-mt-3w">
//               <thead>
//                 <tr>
//                   <th>Année académique</th>
//                   <th>Nombre d'établissements</th>
//                   <th>Effectif total</th>
//                   <th>Femmes</th>
//                   <th>Hommes</th>
//                   <th>% Femmes</th>
//                   <th>% Hommes</th>
//                   <th>Titulaires</th>
//                   <th>Enseignants-chercheurs</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {univData.annual_summary.map((summary) => (
//                   <tr key={summary.academic_year}>
//                     <td>{summary.academic_year}</td>
//                     <td>{summary.establishment_count}</td>
//                     <td>{summary.total_headcount}</td>
//                     <td>{summary.woman_count}</td>
//                     <td>{summary.man_count}</td>
//                     <td>{summary.woman_percentage.toFixed(1)}%</td>
//                     <td>{summary.man_percentage.toFixed(1)}%</td>
//                     <td>{summary.titular_count}</td>
//                     <td>{summary.researcher_count}</td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table> */}
//           </Col>
//         </Row>
//       )}

//       <Row className="fr-mt-8w">
//         <Col md={8} className="fr-pr-6w">
//           <EstablishmentTypeChart
//             establishmentData={establishmentData}
//             isLoading={establishmentLoading}
//             year={selectedYear}
//           />
//         </Col>
//         <Col md={4}>
//           <Text>Descriptif des types d'établissement ???</Text>
//         </Col>
//       </Row>
//       <Row className="fr-mt-8w">
//         <Col md={8} className="fr-pr-6w">
//           {/* <GenderPerStructureTypeChart
//             structureData={genderData}
//             isLoading={establishmentLoading}
//             year={selectedYear}
//           /> */}
//         </Col>
//       </Row>
//       {/* <Row className="fr-mt-8w">
//         <Col>
//           <Title as="h4" look="h6">
//             Liste des établissements disponibles ({universities.length})
//           </Title>
//           <div className="fr-mt-3w">
//             <Row>
//               {universities.map((univ) => (
//                 <Col key={univ.geo_id} md={4} className="fr-mb-3w">
//                   <div
//                     className="fr-card--grey fr-p-3w"
//                     style={{ height: "100%" }}
//                   >
//                     <Title as="h5" look="h6">
//                       {univ.geo_name}
//                     </Title>
//                     <div className="fr-mt-2w">
//                       <Button
//                         type="button"
//                         onClick={() => navigateToUniversity(univ.geo_id)}
//                         className="fr-btn--sm fr-btn--secondary"
//                       >
//                         Voir les détails
//                       </Button>
//                     </div>
//                   </div>
//                 </Col>
//               ))}
//             </Row>
//           </div>
//         </Col>
//       </Row> */}
//     </Container>
//   );
// }
