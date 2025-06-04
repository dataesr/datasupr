// import {
//   Container,
//   Row,
//   Col,
//   Title,
//   Breadcrumb,
//   Link,
// } from "@dataesr/dsfr-plus";
// import { useState, useEffect } from "react";
// import { useParams, useNavigate, useSearchParams } from "react-router-dom";
// import YearSelector from "../../filters";
// import useFacultyMembersByUniversity from "./api/use-filters";

// export default function SpecificUniversityOverview() {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const [searchParams] = useSearchParams();
//   const yearFromUrl = searchParams.get("year");

//   const [selectedYear, setSelectedYear] = useState(yearFromUrl || "");

//   const {
//     data: univData,
//     isLoading,
//     isError,
//     error,
//   } = useFacultyMembersByUniversity(id, selectedYear || undefined);
//   const [availableYears, setAvailableYears] = useState<string[]>([]);

//   useEffect(() => {
//     if (univData) {
//       const years = univData.available_years || [];
//       setAvailableYears(years);

//       if (years.length > 0 && !selectedYear) {
//         const latestYear = years[years.length - 1];
//         setSelectedYear(latestYear);
//         navigate(
//           `/personnel-enseignant/universite/vue-d'ensemble/${id}?year=${latestYear}`,
//           { replace: true }
//         );
//       }
//     }
//   }, [univData, selectedYear, id, navigate]);

//   const handleYearChange = (year: string) => {
//     setSelectedYear(year);
//     navigate(
//       `/personnel-enseignant/universite/vue-d'ensemble/${id}?year=${year}`,
//       {
//         replace: true,
//       }
//     );
//   };

//   if (isLoading) {
//     return <div>Chargement des données...</div>;
//   }

//   if (isError) {
//     return <div>Erreur: {(error as Error)?.message}</div>;
//   }

//   const universityData = univData?.data?.[0];

//   if (!universityData) {
//     return <div>Aucune donnée disponible pour cette université</div>;
//   }

//   const totalWomen = universityData.headcount_per_fields.reduce(
//     (sum, field) => sum + field.numberWoman,
//     0
//   );
//   const totalMen = universityData.headcount_per_fields.reduce(
//     (sum, field) => sum + field.numberMan,
//     0
//   );
//   const totalHeadcount = totalWomen + totalMen;
//   const womanPercentage =
//     totalHeadcount > 0 ? ((totalWomen / totalHeadcount) * 100).toFixed(1) : "0";
//   const manPercentage =
//     totalHeadcount > 0 ? ((totalMen / totalHeadcount) * 100).toFixed(1) : "0";

//   return (
//     <Container as="main">
//       <Row>
//         <Col md={9}>
//           <Breadcrumb className="fr-m-0 fr-mt-1w">
//             <Link href="/personnel-enseignant">Personnel enseignant</Link>
//             <Link href="/personnel-enseignant/universite/vue-d'ensemble/">
//               Vue par établissement
//             </Link>
//             <Link>
//               <strong>{universityData.geo_name}</strong>
//             </Link>
//           </Breadcrumb>
//           <Title as="h3" look="h5" className="fr-mt-5w">
//             {universityData.geo_name} ({selectedYear})
//           </Title>
//         </Col>
//         <Col md={3} style={{ textAlign: "right" }}>
//           <YearSelector
//             years={availableYears}
//             selectedYear={selectedYear}
//             onYearChange={handleYearChange}
//           />
//         </Col>
//       </Row>

//       <Row className="fr-mt-4w">
//         <Col>
//           <Title as="h4" look="h6">
//             Statistiques générales
//           </Title>
//           <Row className="fr-mt-2w">
//             <Col md={3}>
//               <div className="fr-p-2w fr-mb-2w">
//                 <Title as="h5" look="h6">
//                   Effectif total
//                 </Title>
//                 <Title as="h6" look="h3">
//                   {totalHeadcount}
//                 </Title>
//               </div>
//             </Col>
//             <Col md={3}>
//               <div className="fr-p-2w fr-mb-2w">
//                 <Title as="h5" look="h6">
//                   Femmes
//                 </Title>
//                 <Title as="h6" look="h3">
//                   {totalWomen} ({womanPercentage}%)
//                 </Title>
//               </div>
//             </Col>
//             <Col md={3}>
//               <div className="fr-p-2w fr-mb-2w">
//                 <Title as="h5" look="h6">
//                   Hommes
//                 </Title>
//                 <Title as="h6" look="h3">
//                   {totalMen} ({manPercentage}%)
//                 </Title>
//               </div>
//             </Col>
//             <Col md={3}>
//               <div className="fr-p-2w fr-mb-2w">
//                 <Title as="h5" look="h6">
//                   Classe d'âge
//                 </Title>
//                 <Title as="h6" look="h3">
//                   {universityData.age_class || "Non spécifiée"}
//                 </Title>
//               </div>
//             </Col>
//           </Row>
//         </Col>
//       </Row>

//       <Row className="fr-mt-5w">
//         <Col>
//           <Title as="h4" look="h6">
//             Répartition par domaine disciplinaire
//           </Title>
//           <table>
//             <thead>
//               <tr>
//                 <th>Domaine</th>
//                 <th>Femmes</th>
//                 <th>Hommes</th>
//                 <th>Total</th>
//                 <th>% Femmes</th>
//                 <th>% Hommes</th>
//                 <th>Titulaires F</th>
//                 <th>Titulaires H</th>
//               </tr>
//             </thead>
//             <tbody>
//               {universityData.headcount_per_fields.map((field) => {
//                 const fieldTotal = field.numberWoman + field.numberMan;
//                 const fieldWomanPercentage =
//                   fieldTotal > 0
//                     ? ((field.numberWoman / fieldTotal) * 100).toFixed(1)
//                     : "0";
//                 const fieldManPercentage =
//                   fieldTotal > 0
//                     ? ((field.numberMan / fieldTotal) * 100).toFixed(1)
//                     : "0";

//                 return (
//                   <tr key={field.field_id}>
//                     <td>{field.field_label}</td>
//                     <td>{field.numberWoman}</td>
//                     <td>{field.numberMan}</td>
//                     <td>{fieldTotal}</td>
//                     <td>{fieldWomanPercentage}%</td>
//                     <td>{fieldManPercentage}%</td>
//                     <td>{field.numberTitularWoman}</td>
//                     <td>{field.numberTitularMan}</td>
//                   </tr>
//                 );
//               })}
//             </tbody>
//             <tfoot>
//               <tr>
//                 <th>Total</th>
//                 <th>{totalWomen}</th>
//                 <th>{totalMen}</th>
//                 <th>{totalHeadcount}</th>
//                 <th>{womanPercentage}%</th>
//                 <th>{manPercentage}%</th>
//                 <th>
//                   {universityData.headcount_per_fields.reduce(
//                     (sum, field) => sum + field.numberTitularWoman,
//                     0
//                   )}
//                 </th>
//                 <th>
//                   {universityData.headcount_per_fields.reduce(
//                     (sum, field) => sum + field.numberTitularMan,
//                     0
//                   )}
//                 </th>
//               </tr>
//             </tfoot>
//           </table>
//         </Col>
//       </Row>

//       <Row className="fr-mt-5w">
//         <Col>
//           <Title as="h4" look="h6">
//             Détail par groupe CNU
//           </Title>
//           <div className="fr-collapse" id="cnu-details">
//             {universityData.headcount_per_fields.map((field) => (
//               <div key={field.field_id} className="fr-mb-4w">
//                 <Title as="h5" look="h6" className="fr-mb-2w">
//                   {field.field_label}
//                 </Title>
//                 <table>
//                   <thead>
//                     <tr>
//                       <th>Groupe CNU</th>
//                       <th>Femmes</th>
//                       <th>Hommes</th>
//                       <th>Total</th>
//                       <th>% Femmes</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {field.headcount_per_cnu_group.map((cnuGroup) => {
//                       const groupTotal =
//                         cnuGroup.numberWoman + cnuGroup.numberMan;
//                       const groupWomanPercentage =
//                         groupTotal > 0
//                           ? ((cnuGroup.numberWoman / groupTotal) * 100).toFixed(
//                               1
//                             )
//                           : "0";

//                       return (
//                         <tr key={cnuGroup.cnu_group_id}>
//                           <td>{cnuGroup.cnu_group_label}</td>
//                           <td>{cnuGroup.numberWoman}</td>
//                           <td>{cnuGroup.numberMan}</td>
//                           <td>{groupTotal}</td>
//                           <td>{groupWomanPercentage}%</td>
//                         </tr>
//                       );
//                     })}
//                   </tbody>
//                 </table>
//               </div>
//             ))}
//           </div>
//           <button
//             className="fr-btn fr-btn--secondary"
//             data-fr-opened="false"
//             aria-controls="cnu-details"
//           >
//             Afficher/Masquer les détails CNU
//           </button>
//         </Col>
//       </Row>
//     </Container>
//   );
// }
