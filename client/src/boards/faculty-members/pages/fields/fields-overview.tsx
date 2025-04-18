import {
  Container,
  Row,
  Col,
  Title,
  Breadcrumb,
  Link,
  Text,
} from "@dataesr/dsfr-plus";
import { useState, useEffect, useMemo } from "react";
import YearSelector from "../../filters";
import useFacultyMembersByFields from "./api/use-by-fields";
import FieldsDistributionTreemap from "./charts/general/general";
import GenderByDiscipline from "./charts/gender/gender";
import { CNUGroup, CNUSection } from "../../types";
import CnuGroupsTable from "./table/cnu-group-table";
import CnuSectionsTable from "./table/cnu-section-table";

export default function FieldOverview() {
  const [selectedYear, setSelectedYear] = useState<string>("");
  const [availableYears, setAvailableYears] = useState<string[]>([]);
  const [availableFields, setAvailableFields] = useState<
    Array<{ fieldId: string; fieldLabel: string }>
  >([]);

  const { data: allFieldsData, isLoading: allDataLoading } =
    useFacultyMembersByFields(undefined, true);
  const {
    data: fieldData,
    isLoading: dataLoading,
    isError,
    error,
  } = useFacultyMembersByFields(selectedYear);

  useEffect(() => {
    if (allFieldsData?.length) {
      const uniqueYears = Array.from(
        new Set(allFieldsData.map((item) => item.year || item.academic_year))
      ) as string[];
      const sortedYears = [...uniqueYears].sort((a, b) => {
        return parseInt(b.split("-")[0]) - parseInt(a.split("-")[0]);
      });

      setAvailableYears(sortedYears);
      if (sortedYears.length && !selectedYear) {
        setSelectedYear(sortedYears[0]);
      }

      const uniqueFields = [
        ...new Map(
          allFieldsData.map((item) => [
            item.fieldId || item.field_id,
            {
              fieldId: item.fieldId || item.field_id,
              fieldLabel: item.fieldLabel || item.field_label,
            },
          ])
        ).values(),
      ] as Array<{ fieldId: string; fieldLabel: string }>;

      setAvailableFields(
        uniqueFields.sort((a, b) => a.fieldLabel.localeCompare(b.fieldLabel))
      );
    }
  }, [allFieldsData, selectedYear]);

  const { cnuGroups, cnuSections } = useMemo(() => {
    if (!fieldData?.length || !selectedYear) {
      return { cnuGroups: [], cnuSections: [] };
    }

    const currentYearFields = fieldData.filter(
      (item) =>
        item.year === selectedYear || item.academic_year === selectedYear
    );

    const allGroups: CNUGroup[] = [];
    const allSections: CNUSection[] = [];

    currentYearFields.forEach((field) => {
      const groups = field.headcount_per_cnu_group || field.cnuGroups || [];
      const fieldId = field.fieldId || field.field_id;
      const fieldLabel = field.fieldLabel || field.field_label;

      groups.forEach((group) => {
        const groupId = group.cnuGroupId || group.cnu_group_id;
        const groupLabel = group.cnuGroupLabel || group.cnu_group_label;
        const maleCount = group.numberMan || group.maleCount || 0;
        const femaleCount = group.numberWoman || group.femaleCount || 0;
        const unknownCount = group.numberUnknown || group.unknownCount || 0;
        const totalCount = maleCount + femaleCount + unknownCount;

        allGroups.push({
          cnuGroupId: groupId,
          cnuGroupLabel: groupLabel,
          maleCount,
          femaleCount,
          unknownCount,
          totalCount,
          fieldId,
          fieldLabel,
          cnuSections: [],
        });

        const sections =
          group.headcount_per_cnu_section || group.cnuSections || [];

        sections.forEach((section) => {
          if (!section) return;

          const sectionId =
            section.cnuSectionId || section.cnu_section_id || "N/A";
          const sectionLabel =
            section.cnuSectionLabel ||
            section.cnu_section_label ||
            "Non spécifié";

          if (sectionId === "N/A" || sectionLabel === "Non spécifié") return;

          const secMaleCount = section.numberMan || section.maleCount || 0;
          const secFemaleCount =
            section.numberWoman || section.femaleCount || 0;
          const secUnknownCount =
            section.numberUnknown || section.unknownCount || 0;

          allSections.push({
            cnuSectionId: sectionId,
            cnuSectionLabel: sectionLabel,
            maleCount: secMaleCount,
            femaleCount: secFemaleCount,
            unknownCount: secUnknownCount,
            totalCount: secMaleCount + secFemaleCount + secUnknownCount,
            cnuGroupId: groupId,
            cnuGroupLabel: groupLabel,
            fieldId,
            fieldLabel,
          });
        });
      });
    });

    const mergedGroups = Object.values(
      allGroups.reduce<Record<string, CNUGroup>>((acc, group) => {
        const key = group.cnuGroupId;
        if (!acc[key]) {
          acc[key] = { ...group };
        } else {
          acc[key].maleCount += group.maleCount;
          acc[key].femaleCount += group.femaleCount;
          acc[key].unknownCount += group.unknownCount;
          acc[key].totalCount += group.totalCount;
        }
        return acc;
      }, {})
    ).sort((a, b) => b.totalCount - a.totalCount);

    return {
      cnuGroups: mergedGroups,
      cnuSections: allSections.sort((a, b) => b.totalCount - a.totalCount),
    };
  }, [fieldData, selectedYear]);

  const disciplinesData = useMemo(() => {
    if (!fieldData?.length || !selectedYear) return [];

    return fieldData
      .filter(
        (item) =>
          item.year === selectedYear || item.academic_year === selectedYear
      )
      .map((field) => {
        const hasNumberMan = "numberMan" in field;
        return {
          fieldId: hasNumberMan ? field.field_id : field.fieldId,
          fieldLabel: hasNumberMan ? field.field_label : field.fieldLabel,
          maleCount: hasNumberMan ? field.numberMan : field.maleCount,
          femaleCount: hasNumberMan ? field.numberWoman : field.femaleCount,
          unknownCount: hasNumberMan
            ? field.numberUnknown || 0
            : field.unknownCount || 0,
          totalCount: hasNumberMan
            ? field.numberMan + field.numberWoman + (field.numberUnknown || 0)
            : field.totalCount ||
              field.maleCount + field.femaleCount + (field.unknownCount || 0),
        };
      })
      .sort((a, b) => b.totalCount - a.totalCount);
  }, [fieldData, selectedYear]);

  const isLoading = allDataLoading || dataLoading;
  if (isLoading) return <div>Chargement des données...</div>;
  if (isError) return <div>Erreur : {error?.message}</div>;

  return (
    <Container as="main">
      <Row>
        <Col md={9}>
          <Breadcrumb className="fr-m-0 fr-mt-1w">
            <Link href="/personnel-enseignant">Personnel enseignant</Link>
            <Link>
              <strong>Vue Grandes disciplines</strong>
            </Link>
          </Breadcrumb>
        </Col>
        <Col md={3} style={{ textAlign: "right" }}>
          {availableYears.length > 0 && (
            <YearSelector
              years={availableYears}
              selectedYear={selectedYear}
              onYearChange={setSelectedYear}
            />
          )}
        </Col>
      </Row>
      <Row gutters className="fr-mt-5w">
        <Col>
          <Title as="h4" look="h5" className="fr-mb-3w">
            Explorer par grande discipline
          </Title>

          <div className="disciplines-grid">
            {availableFields.map((field) => (
              <Link
                key={field.fieldId}
                href={`/personnel-enseignant/discipline/vue-d'ensemble/${field.fieldId}`}
                className="discipline-card"
              >
                <div className="discipline-content">
                  <span className="discipline-name">{field.fieldLabel}</span>
                  <span className="discipline-id">{field.fieldId}</span>
                </div>
              </Link>
            ))}
          </div>
        </Col>
      </Row>
      <Row gutters>
        <Col md={2}>
          <Text className="fr-mt-1w">
            Cette page présente la répartition des personnels enseignants par
            discipline. Les données permettent d'analyser la distribution par
            genre et par champ disciplinaire universitaire.
          </Text>
        </Col>
        <Col md={10} style={{ textAlign: "center" }}>
          <GenderByDiscipline disciplinesData={disciplinesData} />
        </Col>
      </Row>
      <Row>
        <Col md={12} style={{ textAlign: "center" }}>
          {fieldData && selectedYear && (
            <FieldsDistributionTreemap
              fieldsData={fieldData}
              selectedYear={selectedYear}
            />
          )}
        </Col>
      </Row>
      <Row className="fr-mt-5w">
        <Col>
          <CnuGroupsTable cnuGroups={cnuGroups} />
        </Col>
      </Row>
      <Row className="fr-mt-5w fr-mb-5w">
        <Col>
          <CnuSectionsTable cnuSections={cnuSections} maxDisplay={30} />
        </Col>
      </Row>
    </Container>
  );
}
