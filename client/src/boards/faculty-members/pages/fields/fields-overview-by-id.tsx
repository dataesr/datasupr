// import {
//   Container,
//   Row,
//   Col,
//   Title,
//   Breadcrumb,
//   Link,
//   Badge,
// } from "@dataesr/dsfr-plus";
// import { useState, useEffect, useMemo } from "react";
// import { useParams } from "react-router-dom";
// import YearSelector from "../../filters";
// import useFacultyMembersByFields from "./api/use-by-fields";
// import DisciplineStatusSummary from "./components/fields-by-status";
// import StatusDistribution from "./charts/status/status";
// import GeneralIndicatorsCard from "../../components/general-indicators-card";
// import { Field, NormalizedDiscipline } from "./types";

// export default function SpecificFieldsOverview() {
//   const [selectedYear, setSelectedYear] = useState<string>("");
//   const [specificFieldData, setSpecificFieldData] = useState<Field | null>(
//     null
//   );
//   const [availableYears, setAvailableYears] = useState<string[]>([]);
//   const { field_id } = useParams<{ field_id: string }>();

//   const { data: allFieldsData } = useFacultyMembersByFields(undefined, true);

//   const { data: fieldData } = useFacultyMembersByFields(selectedYear);

//   useEffect(() => {
//     if (
//       allFieldsData &&
//       Array.isArray(allFieldsData) &&
//       allFieldsData.length > 0
//     ) {
//       const filteredData = allFieldsData.filter(
//         (field) => (field.field_id || field.field_id) === field_id
//       );

//       if (filteredData.length === 0) {
//         return;
//       }

//       const uniqueYears = Array.from(
//         new Set(
//           filteredData
//             .map((item) => item.year || item.academic_year)
//             .filter(Boolean)
//         )
//       ) as string[];

//       const sortedYears = [...uniqueYears].sort((a, b) => {
//         const yearA = parseInt(a.split("-")[0]);
//         const yearB = parseInt(b.split("-")[0]);
//         return yearB - yearA;
//       });

//       setAvailableYears(sortedYears);

//       if (sortedYears.length > 0 && !selectedYear) {
//         setSelectedYear(sortedYears[0]);
//       }
//     }
//   }, [allFieldsData, field_id, selectedYear]);

//   useEffect(() => {
//     if (fieldData && Array.isArray(fieldData) && field_id && selectedYear) {
//       const foundField = fieldData.find(
//         (field) =>
//           (field.field_id || field.field_id) === field_id &&
//           (field.year || field.academic_year) === selectedYear
//       );

//       setSpecificFieldData(foundField || null);
//     } else {
//       setSpecificFieldData(null);
//     }
//   }, [fieldData, field_id, selectedYear]);

//   const normalizedFieldData = useMemo<NormalizedDiscipline[]>(() => {
//     if (!specificFieldData) return [];

//     return [
//       {
//         field_id: specificFieldData.field_id || specificFieldData.field_id || "",
//         fieldLabel:
//           specificFieldData.fieldLabel || specificFieldData.field_label || "",
//         maleCount:
//           specificFieldData.maleCount || specificFieldData.numberMan || 0,
//         femaleCount:
//           specificFieldData.femaleCount || specificFieldData.numberWoman || 0,
//         unknownCount:
//           specificFieldData.unknownCount ||
//           specificFieldData.numberUnknown ||
//           0,
//         totalCount:
//           specificFieldData.totalCount || specificFieldData.total_count || 0,
//       },
//     ];
//   }, [specificFieldData]);

//   if (!specificFieldData) {
//     return (
//       <Container as="main">
//         <Row>
//           <Col>
//             <div className="fr-alert fr-alert--warning fr-my-5w">
//               <p>
//                 Aucune donnée trouvée pour la discipline {field_id} en{" "}
//                 {selectedYear}.
//               </p>
//               <p>
//                 Veuillez vérifier l'identifiant de la discipline ou sélectionner
//                 une autre année.
//               </p>
//               {availableYears.length > 0 && (
//                 <div className="fr-mt-3w">
//                   <p>Années disponibles pour cette discipline:</p>
//                   <YearSelector
//                     years={availableYears}
//                     selectedYear={selectedYear}
//                     onYearChange={setSelectedYear}
//                   />
//                 </div>
//               )}
//             </div>
//           </Col>
//         </Row>
//       </Container>
//     );
//   }

//   const fieldLabel =
//     specificFieldData.fieldLabel || specificFieldData.field_label || "";

//   return (
//     <Container as="main">
//       <Row>
//         <Col md={9}>
//           <Breadcrumb className="fr-m-0 fr-mt-1w">
//             <Link href="/personnel-enseignant">Personnel enseignant</Link>
//             <Link href="/personnel-enseignant/discipline/vue-d'ensemble/">
//               Vue disciplinaire
//             </Link>
//             <Link>
//               <strong>{fieldLabel}</strong>
//             </Link>
//           </Breadcrumb>
//           <Title as="h3" look="h5" className="fr-mt-5w">
//             {fieldLabel} <Badge color="blue-cumulus">{field_id}</Badge>
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
//       <Row gutters className="fr-mt-2w fr-mb-3w">
//         <Col md={8}>
//           Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam,
//           tempora sapiente in, nam autem fugiat voluptatem, illo accusantium
//           consequuntur odit minima repellat at. Similique laboriosam totam dolor
//           cupiditate quo nostrum.
//           <StatusDistribution selectedYear={selectedYear} field_id={field_id} />
//         </Col>
//         <Col md={4}>
//           <GeneralIndicatorsCard generalIndicators={normalizedFieldData} />
//           <DisciplineStatusSummary
//             selectedYear={selectedYear}
//             field_id={field_id}
//           />
//           <i>
//             <Link
//               href={`/personnel-enseignant/discipline/enseignants-chercheurs/${field_id}`}
//             >
//               Pour plus de détails sur les enseignant-chercheurs, cliquez ici
//             </Link>
//           </i>
//         </Col>
//       </Row>
//       <Row className="fr-mt-5w fr-mb-5w"></Row>
//       <Row gutters className="fr-mt-4w fr-mb-5w">
//         <Col md={7}>
//           Lorem ipsum dolor sit amet consectetur adipisicing elit. Id eum
//           mollitia exercitationem ullam maxime a illo, cupiditate nostrum
//           laudantium possimus doloribus iure dolor, laborum itaque, asperiores
//           molestias similique natus! Blanditiis!
//         </Col>
//         <Col md={5}>Coucou</Col>
//       </Row>
//     </Container>
//   );
// }
