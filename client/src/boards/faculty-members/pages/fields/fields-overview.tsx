import {
  Container,
  Row,
  Col,
  Title,
  Breadcrumb,
  Link,
  Text,
  Notice,
} from "@dataesr/dsfr-plus";
import { useState, useEffect, useMemo } from "react";
import YearSelector from "../../filters";
import useFacultyMembersByFields from "./api/use-by-fields";
import FieldsDistributionBar from "./charts/general/general";
import DisciplineStatsSidebar from "./components/top-fields-indicators";
import FieldCardsGrid from "./components/fields-cards";
import CnuGroupsChart from "./charts/cnu-group/cnu-chart";
import useFacultyMembersByStatus from "./api/use-by-status";
import DisciplineStatusSummary from "./components/fields-by-status";
import StatusDistribution from "./charts/status/status";
import useFacultyMembersAgeDistribution from "./api/use-by-age";
import { AgeDistributionPieChart } from "./charts/age/age";
import GeneralIndicatorsCard from "../../components/general-indicators-card";
import { CNUGroup, CNUSection, FieldSimple } from "./types";

export default function FieldOverview() {
  const [selectedYear, setSelectedYear] = useState<string>("");
  const [availableYears, setAvailableYears] = useState<string[]>([]);
  const [availableFields, setAvailableFields] = useState<FieldSimple[]>([]);

  const { data: allFieldsData, isLoading: allDataLoading } =
    useFacultyMembersByFields(undefined, true);
  const {
    data: fieldData,
    isLoading: dataLoading,
    isError,
    error,
  } = useFacultyMembersByFields(selectedYear);
  const {
    data: statusData,
    isLoading: statusLoading,
    error: statusError,
  } = useFacultyMembersByStatus(selectedYear);

  const { data: ageDistributionData, isLoading: ageDistributionLoading } =
    useFacultyMembersAgeDistribution(selectedYear);

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

  const { cnuGroups } = useMemo(() => {
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
          maleCount: maleCount || 0,
          femaleCount: femaleCount || 0,
          unknownCount: unknownCount || 0,
          totalCount: totalCount || 0,
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
        if (!key) return acc;

        if (!acc[key]) {
          acc[key] = { ...group };
        } else {
          acc[key]!.maleCount =
            (acc[key]!.maleCount || 0) + (group.maleCount || 0);
          acc[key]!.femaleCount =
            (acc[key]!.femaleCount || 0) + (group.femaleCount || 0);
          acc[key]!.unknownCount =
            (acc[key]!.unknownCount || 0) + (group.unknownCount || 0);
          acc[key]!.totalCount =
            (acc[key]!.totalCount || 0) + (group.totalCount || 0);
        }
        return acc;
      }, {})
    ).sort((a, b) => (b.totalCount || 0) - (a.totalCount || 0));

    return {
      cnuGroups: mergedGroups,
      cnuSections: allSections.sort(
        (a, b) => (b.totalCount ?? 0) - (a.totalCount ?? 0)
      ),
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

  const isLoading = allDataLoading || dataLoading || statusLoading;
  if (isLoading) return <div>Chargement des données...</div>;
  if (isError) return <div>Erreur : {error?.message}</div>;
  if (statusError) return <div>Erreur : {statusError?.message}</div>;

  const shareTitulaire = statusData?.[0]?.aggregatedStats?.titulairesPercent;

  return (
    <Container as="main">
      <Row>
        <Col md={9}>
          <Breadcrumb className="fr-m-0 fr-pt-3w">
            <Link href="/personnel-enseignant">Personnel enseignant</Link>
            <Link>
              <strong>Les Grandes disciplines</strong>
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

      <Row className="fr-mt-3w">
        {shareTitulaire == 100 && (
          <Notice closeMode={"disallow"} type={"warning"}>
            Les données des personnels enseignants non permanents ne sont pas
            prises en compte pour l'année {selectedYear} car elles ne sont pas
            disponibles.
          </Notice>
        )}
        <Title as="h3" look="h5" className="fr-mt-2w">
          Explorer le personnel enseignant par grande discipline
        </Title>
      </Row>

      <Row>
        <Col md={8} className="fr-pr-8w">
          <Text>
            Desriptif de notre référentiel des disciplines, limites et
            périmètres. <br />
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus
            vitae lobortis sem. Quisque vel ex a elit facilisis rhoncus. Morbi
            eleifend bibendum orci vel aliquet. Fusce a neque dui. Cras molestie
            quam quis libero ullamcorper viverra. Sed rutrum placerat nibh ut
            tristique. Cras egestas felis a scelerisque dignissim. Donec
            placerat nulla dapibus, efficitur ex non, vehicula sapien. Aenean
            vehicula vitae eros ut egestas. Maecenas lorem massa, vulputate id
            leo id, aliquet ornare mi. Etiam vitae ipsum ipsum. Cras fermentum
            lobortis mauris eget malesuada. Sed in consequat elit, eu fringilla
            magna.
          </Text>
          {fieldData && selectedYear && (
            <FieldsDistributionBar
              fieldsData={fieldData}
              selectedYear={selectedYear}
            />
          )}
          <CnuGroupsChart cnuGroups={cnuGroups} />
          <StatusDistribution
            disciplinesData={statusData?.[0].disciplines ?? []}
          />
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Ea repellat
          corporis est laudantium consequuntur consectetur, odit temporibus!
          Eligendi, vitae. Vero, harum molestias? Repellendus voluptatem non
          aperiam? Enim ab obcaecati non?
          {selectedYear && (
            <div className="fr-mt-3w">
              {ageDistributionData && (
                <AgeDistributionPieChart
                  ageData={ageDistributionData}
                  isLoading={ageDistributionLoading}
                  year={selectedYear}
                  forcedSelectedField={undefined}
                />
              )}
            </div>
          )}
        </Col>

        <Col md={4} style={{ textAlign: "center" }}>
          <GeneralIndicatorsCard structureData={disciplinesData} />
          <DisciplineStatsSidebar disciplinesData={disciplinesData} />
          {statusData && statusData.length > 0 && (
            <>
              <DisciplineStatusSummary
                totalCount={statusData[0].total_count ?? 0}
                aggregatedStats={statusData[0].aggregatedStats}
                fields={statusData[0].disciplines ?? []}
              />
            </>
          )}
        </Col>
      </Row>

      <Row className="fr-mt-4w fr-mb-5w">
        <Col>
          <Title as="h4" look="h5">
            Explorer par discipline
          </Title>
          <FieldCardsGrid fields={availableFields} />
        </Col>
      </Row>
    </Container>
  );
}
