// import { useState, useEffect, useMemo } from "react";
// import {
//   Container,
//   Row,
//   Col,
//   Title,
//   Breadcrumb,
//   Badge,
//   Link,
// } from "@dataesr/dsfr-plus";
// import { useParams } from "react-router-dom";
// import useFacultyMembersByFields from "../api/use-by-fields";
// import YearSelector from "../../../filters";
// import useFacultyMembersResearchsTeachers from "../api/use-researchs-teachers";
// import CnuGroupsTable from "../table/cnu-group-table";
// import CnuSectionsTable from "../table/cnu-section-table";
// import GeneralIndicatorsCard from "../../../components/general-indicators-card";
// import { AgeDistributionPieChart } from "../charts/age/age";
// import { CNUSection } from "../types";

// export function ResearchTeachers() {
//   const { field_id } = useParams<{ field_id: string }>();
//   const [selectedYear, setSelectedYear] = useState<string>("");
//   const [availableYears, setAvailableYears] = useState<string[]>([]);

//   const { data: allFieldsData, isLoading: allDataLoading } =
//     useFacultyMembersByFields(undefined, true);

//   const { data: researchTeachersData, isLoading: researchTeachersDataLoading } =
//     useFacultyMembersResearchsTeachers(selectedYear, field_id);

//   useEffect(() => {
//     if (
//       allFieldsData &&
//       Array.isArray(allFieldsData) &&
//       allFieldsData.length > 0
//     ) {
//       const uniqueYears = Array.from(
//         new Set(
//           allFieldsData.map((item) => item.year || item.academic_year || "")
//         )
//       ).filter(Boolean);

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
//   }, [allFieldsData, selectedYear]);

//   const currentDisciplineData = useMemo(() => {
//     if (!researchTeachersData) return null;

//     if (field_id) {
//       if (researchTeachersData.field_id === field_id) {
//         return researchTeachersData;
//       } else if (
//         researchTeachersData.fields &&
//         Array.isArray(researchTeachersData.fields)
//       ) {
//         return researchTeachersData.fields.find((d) => d.field_id === field_id);
//       }
//       return null;
//     } else {
//       return researchTeachersData;
//     }
//   }, [researchTeachersData, field_id]);

//   const cnuGroups = useMemo(() => {
//     if (!currentDisciplineData) return [];
//     return field_id ? currentDisciplineData.cnuGroups || [] : [];
//   }, [currentDisciplineData, field_id]);

//   const normalizeCnuSections = (sections: CNUSection[]): CNUSection[] => {
//     const sectionsMap = new Map<string, CNUSection>();

//     sections.forEach((section) => {
//       const sectionId = section.cnuSectionId ?? section.cnu_section_id;

//       const key = String(sectionId);

//       if (sectionsMap.has(key)) {
//         const existing = sectionsMap.get(key)!;
//         const existingTotal = existing.totalCount ?? 0;
//         const existingMale = existing.maleCount ?? 0;
//         const existingFemale = existing.femaleCount ?? 0;
//         const currentTotal = section.totalCount ?? 0;
//         const currentMale = section.maleCount ?? 0;
//         const currentFemale = section.femaleCount ?? 0;

//         sectionsMap.set(key, {
//           ...section,
//           totalCount: Math.max(currentTotal, existingTotal),
//           maleCount: Math.max(currentMale, existingMale),
//           femaleCount: Math.max(currentFemale, existingFemale),
//         });
//       } else {
//         sectionsMap.set(key, section);
//       }
//     });

//     return Array.from(sectionsMap.values());
//   };
//   const cnuSections = useMemo(() => {
//     if (
//       !currentDisciplineData ||
//       !field_id ||
//       currentDisciplineData.field_id !== field_id
//     ) {
//       return [];
//     }

//     const groups = currentDisciplineData.cnuGroups || [];
//     if (groups.length === 0) return [];

//     const allSections = groups.flatMap((group) =>
//       (group.cnuSections || []).map((section) => ({
//         ...section,
//         cnuGroupId: group.cnuGroupId,
//         cnuGroupLabel: group.cnuGroupLabel,
//       }))
//     );

//     return normalizeCnuSections(allSections);
//   }, [currentDisciplineData, field_id]);

//   const indicatorsData = useMemo(() => {
//     if (!researchTeachersData) return [];

//     if (field_id && currentDisciplineData) {
//       return [
//         {
//           maleCount: currentDisciplineData.maleCount,
//           femaleCount: currentDisciplineData.femaleCount,
//           totalCount: currentDisciplineData.totalCount,
//           field_id: currentDisciplineData.field_id,
//         },
//       ];
//     } else if (researchTeachersData.fields) {
//       return researchTeachersData.fields.map((discipline) => ({
//         maleCount: discipline.maleCount,
//         femaleCount: discipline.femaleCount,
//         totalCount: discipline.totalCount,
//         field_id: discipline.field_id,
//       }));
//     }

//     return [
//       {
//         maleCount: researchTeachersData.maleCount || 0,
//         femaleCount: researchTeachersData.femaleCount || 0,
//         totalCount: researchTeachersData.totalCount || 0,
//         field_id: researchTeachersData.field_id,
//       },
//     ];
//   }, [researchTeachersData, currentDisciplineData, field_id]);

//   const disciplines = useMemo(() => {
//     if (!researchTeachersData?.fields) return [];
//     return researchTeachersData.fields;
//   }, [researchTeachersData]);

//   if (researchTeachersDataLoading || allDataLoading) {
//     return <div>Chargement des données...</div>;
//   }

//   if (!researchTeachersData) {
//     return (
//       <Container as="main">
//         <div className="fr-alert fr-alert--warning">
//           <p>
//             Aucune donnée disponible
//             {field_id ? ` pour la discipline ${field_id}` : ""}
//             {selectedYear ? ` pour l'année ${selectedYear}` : ""}.
//           </p>
//         </div>
//       </Container>
//     );
//   }

//   if (field_id && !currentDisciplineData) {
//     return (
//       <Container as="main">
//         <div className="fr-alert fr-alert--warning">
//           <p>
//             Discipline {field_id} introuvable
//             {selectedYear ? ` pour l'année ${selectedYear}` : ""}.
//           </p>
//         </div>
//       </Container>
//     );
//   }

//   return (
//     <Container as="main">
//       <Row>
//         <Col md={9}>
//           <Breadcrumb className="fr-m-0 fr-mt-1w">
//             <Link href="/personnel-enseignant">Personnel enseignant</Link>
//             <Link href="/personnel-enseignant/discipline/vue-d'ensemble/">
//               Vue disciplinaire
//             </Link>
//             {field_id && currentDisciplineData && (
//               <Link>
//                 Les enseignants chercheurs en
//                 <strong> {currentDisciplineData.fieldLabel}</strong>
//               </Link>
//             )}
//           </Breadcrumb>
//         </Col>
//         <Col md={3} style={{ textAlign: "right" }}>
//           {availableYears.length > 0 && (
//             <YearSelector
//               years={availableYears}
//               selectedYear={selectedYear}
//               onYearChange={setSelectedYear}
//             />
//           )}
//         </Col>
//       </Row>

//       {!field_id && disciplines?.length > 0 && (
//         <Row gutters className="fr-mt-4w">
//           <Col md={8}>
//             <Title as="h2" look="h4" className="fr-mb-2w">
//               Répartition des groupes CNU par discipline
//             </Title>
//             <table className="fr-table fr-table--bordered">
//               <thead>
//                 <tr>
//                   <th scope="col">Discipline</th>
//                   <th scope="col" className="text-center">
//                     Hommes
//                   </th>
//                   <th scope="col" className="text-center">
//                     Femmes
//                   </th>
//                   <th scope="col" className="text-center">
//                     Total
//                   </th>
//                   <th scope="col" className="text-center">
//                     Répartition H/F
//                   </th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {disciplines.map((discipline) => {
//                   const malePercent = Math.round(
//                     (discipline.maleCount / discipline.totalCount) * 100
//                   );
//                   const femalePercent = 100 - malePercent;

//                   return (
//                     <tr key={discipline.field_id}>
//                       <td>
//                         <Link
//                           href={`/personnel-enseignant/discipline/enseignants-chercheurs/${discipline.field_id}`}
//                         >
//                           <strong>{discipline.fieldLabel}</strong>
//                           <br />
//                           <small className="text-grey">
//                             {discipline.field_id}
//                           </small>
//                         </Link>
//                       </td>
//                       <td className="text-center">
//                         {discipline.maleCount.toLocaleString()}
//                       </td>
//                       <td className="text-center">
//                         {discipline.femaleCount.toLocaleString()}
//                       </td>
//                       <td className="text-center">
//                         {discipline.totalCount.toLocaleString()}
//                       </td>
//                       <td className="text-center">
//                         <div className="progress-container">
//                           <div
//                             className="progress-bar male"
//                             style={{ width: `${malePercent}%` }}
//                           ></div>
//                           <div
//                             className="progress-bar female"
//                             style={{ width: `${femalePercent}%` }}
//                           ></div>
//                         </div>
//                         <small>
//                           <Badge>
//                             {malePercent}% / {femalePercent}%
//                           </Badge>
//                         </small>
//                       </td>
//                     </tr>
//                   );
//                 })}
//               </tbody>
//             </table>
//           </Col>
//           {/* <Col md={4}>
//             <GeneralIndicatorsCard structureData={indicatorsData} />
//             {selectedYear &&
//               currentDisciplineData &&
//               currentDisciplineData.ageDistribution && (
//                 <div className="fr-mt-3w">
//                   <AgeDistributionPieChart
//                     ageData={[currentDisciplineData]}
//                     isLoading={researchTeachersDataLoading}
//                     year={selectedYear}
//                     forcedSelectedField={field_id ?? undefined}
//                   />
//                 </div>
//               )}
//           </Col> */}
//         </Row>
//       )}

//       {field_id && cnuGroups?.length > 0 && (
//         <Row gutters className="fr-mt-5w">
//           <Col md={8}>
//             <Title as="h2" look="h4" className="fr-mb-2w">
//               Répartition par groupes CNU en {currentDisciplineData.fieldLabel}
//             </Title>
//             <CnuGroupsTable cnuGroups={cnuGroups} />
//             <div className="fr-text--xs fr-mt-1w fr-mb-4w">
//               <i>
//                 <strong>Répartition par groupes CNU</strong>
//                 <br />
//                 Ce tableau présente la répartition des enseignants-chercheurs
//                 par groupe CNU en {currentDisciplineData.fieldLabel}. Les
//                 données permettent d'analyser la distribution par genre.
//               </i>
//             </div>
//           </Col>
//           {/* <Col md={4}>
//             <GeneralIndicatorsCard structureData={indicatorsData} />
//             {selectedYear &&
//               currentDisciplineData &&
//               currentDisciplineData.ageDistribution && (
//                 <div className="fr-mt-3w">
//                   <AgeDistributionPieChart
//                     ageData={[currentDisciplineData]}
//                     isLoading={researchTeachersDataLoading}
//                     year={selectedYear}
//                     forcedSelectedField={field_id ?? undefined}
//                   />
//                 </div>
//               )}
//           </Col> */}
//         </Row>
//       )}

//       {field_id && cnuSections?.length > 0 && (
//         <Row gutters className="fr-mt-5w">
//           <Col md={12}>
//             <Title as="h2" look="h4" className="fr-mb-2w">
//               Répartition par sections CNU en {currentDisciplineData.fieldLabel}
//             </Title>
//             <CnuSectionsTable
//               cnuSections={cnuSections}
//               showDiscipline={false}
//               showGroup={true}
//             />
//             <div className="fr-text--xs fr-mt-1w">
//               <i>
//                 <strong>Répartition par sections CNU</strong>
//                 <br />
//                 Ce tableau présente la répartition des enseignants-chercheurs
//                 par section CNU en {currentDisciplineData.fieldLabel}. Les
//                 données permettent d'obtenir une vision plus fine de la
//                 distribution par spécialité au sein des groupes CNU.
//               </i>
//             </div>
//           </Col>
//         </Row>
//       )}
//     </Container>
//   );
// }

// export default ResearchTeachers;
