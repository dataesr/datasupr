import {
  Container,
  Row,
  Col,
  Title,
  Breadcrumb,
  Link,
  Badge,
} from "@dataesr/dsfr-plus";
import { useState, useEffect, useMemo } from "react";
import { useParams } from "react-router-dom";
import YearSelector from "../../filters";
import useFacultyMembersByFields from "./api/use-by-fields";
import { FieldData } from "../../types";
import useFacultyMembersByStatus from "./api/use-by-status";
import DisciplineStatusSummary from "./components/fields-by-status";
import StatusDistribution from "./charts/status/status";
import useFacultyMembersAgeDistribution from "./api/use-by-age";
import { AgeDistributionPieChart } from "./charts/age/age";
import GeneralIndicatorsCard from "../../components/general-indicators-card";

export default function SpecificFieldsOverview() {
  const [selectedYear, setSelectedYear] = useState<string>("");
  const [specificFieldData, setSpecificFieldData] = useState<FieldData | null>(
    null
  );
  const [availableYears, setAvailableYears] = useState<string[]>([]);
  const { fieldId } = useParams<{ fieldId: string }>();

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

  const filteredAgeData = useMemo(() => {
    if (!ageDistributionData || !fieldId) return null;

    const disciplineAgeData = ageDistributionData.find(
      (item) => item.fieldId === fieldId
    );

    if (!disciplineAgeData) return null;

    return [disciplineAgeData];
  }, [ageDistributionData, fieldId]);

  const disciplineStatusData = useMemo(() => {
    if (!statusData || statusData.length === 0 || !fieldId) return null;

    const discipline = statusData[0].disciplines?.find(
      (d) => d.fieldId === fieldId || d.field_id === fieldId
    );

    if (!discipline) return null;

    return {
      totalCount: discipline.totalCount || discipline.total_count || 0,
      aggregatedStats: {
        titulairesPercent:
          discipline.status?.titulaires?.percent ||
          discipline.titulaires_percent ||
          0,
        enseignantsChercheursPercent:
          discipline.status?.enseignantsChercheurs?.percent ||
          discipline.enseignants_chercheurs_percent ||
          0,
        ecTitulairesPercent:
          ((discipline.status?.ecTitulaires?.count || 0) /
            (discipline.totalCount || discipline.total_count || 1)) *
            100 ||
          ((discipline.ec_titulaires || 0) /
            (discipline.totalCount || discipline.total_count || 1)) *
            100,
        totalTitulaires:
          discipline.status?.titulaires?.count || discipline.titulaires || 0,
        totalNonTitulaires:
          discipline.status?.nonTitulaires?.count ||
          discipline.non_titulaires ||
          0,
        nonTitulairesPercent: discipline.status?.nonTitulaires?.percent || 0,
        totalEnseignantsChercheurs:
          discipline.status?.enseignantsChercheurs?.count ||
          discipline.enseignants_chercheurs ||
          0,
        totalEcTitulaires:
          discipline.status?.ecTitulaires?.count ||
          discipline.ec_titulaires ||
          0,
      },
      fields: [discipline],
    };
  }, [statusData, fieldId]);

  useEffect(() => {
    if (
      allFieldsData &&
      Array.isArray(allFieldsData) &&
      allFieldsData.length > 0
    ) {
      const filteredData = (allFieldsData as FieldData[]).filter(
        (field) => field.fieldId === fieldId
      );

      if (filteredData.length === 0) {
        return;
      }

      const uniqueYears = Array.from(
        new Set(filteredData.map((item) => item.year))
      );

      const sortedYears = [...uniqueYears].sort((a, b) => {
        const yearA = parseInt(a.split("-")[0]);
        const yearB = parseInt(b.split("-")[0]);
        return yearB - yearA;
      });

      setAvailableYears(sortedYears);

      if (sortedYears.length > 0 && !selectedYear) {
        setSelectedYear(sortedYears[0]);
      }
    }
  }, [allFieldsData, fieldId, selectedYear]);

  useEffect(() => {
    if (fieldData && Array.isArray(fieldData) && fieldId && selectedYear) {
      const foundField = (fieldData as FieldData[]).find(
        (field) => field.fieldId === fieldId && field.year === selectedYear
      );

      setSpecificFieldData(foundField || null);
    } else {
      setSpecificFieldData(null);
    }
  }, [fieldData, fieldId, selectedYear]);

  const isLoading = allDataLoading || dataLoading || statusLoading;
  if (isLoading) return <div>Chargement des données...</div>;
  if (isError) return <div>Erreur : {error?.message}</div>;
  if (statusError)
    return <div>Erreur de chargement des statuts : {statusError.message}</div>;
  if (!specificFieldData) {
    return (
      <Container as="main">
        <Row>
          <Col>
            <div className="fr-alert fr-alert--warning fr-my-5w">
              <p>
                Aucune donnée trouvée pour la discipline {fieldId} en{" "}
                {selectedYear}.
              </p>
              <p>
                Veuillez vérifier l'identifiant de la discipline ou sélectionner
                une autre année.
              </p>
              {availableYears.length > 0 && (
                <div className="fr-mt-3w">
                  <p>Années disponibles pour cette discipline:</p>
                  <YearSelector
                    years={availableYears}
                    selectedYear={selectedYear}
                    onYearChange={setSelectedYear}
                  />
                </div>
              )}
            </div>
          </Col>
        </Row>
      </Container>
    );
  }

  const fieldLabel = specificFieldData.fieldLabel;

  return (
    <Container as="main">
      <Row>
        <Col md={9}>
          <Breadcrumb className="fr-m-0 fr-mt-1w">
            <Link href="/personnel-enseignant">Personnel enseignant</Link>
            <Link href="/personnel-enseignant/discipline/vue-d'ensemble/">
              Vue disciplinaire
            </Link>
            <Link>
              <strong>{fieldLabel}</strong>
            </Link>
          </Breadcrumb>
          <Title as="h3" look="h5" className="fr-mt-5w">
            {fieldLabel} <Badge color="blue-cumulus">{fieldId}</Badge>
          </Title>
        </Col>
        <Col md={3} style={{ textAlign: "right" }}>
          <YearSelector
            years={availableYears}
            selectedYear={selectedYear}
            onYearChange={setSelectedYear}
          />
        </Col>
      </Row>
      <Row gutters className="fr-mt-2w fr-mb-3w">
        <Col md={8}>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam,
          tempora sapiente in, nam autem fugiat voluptatem, illo accusantium
          consequuntur odit minima repellat at. Similique laboriosam totam dolor
          cupiditate quo nostrum.
          {disciplineStatusData && (
            <StatusDistribution
              disciplinesData={[
                {
                  fieldId: fieldId || "",
                  fieldLabel: specificFieldData?.fieldLabel || "",
                  totalCount: disciplineStatusData.totalCount,
                  enseignants_chercheurs:
                    disciplineStatusData.aggregatedStats
                      .totalEnseignantsChercheurs,
                  titulaires:
                    disciplineStatusData.aggregatedStats.totalTitulaires,
                  non_titulaires:
                    disciplineStatusData.totalCount -
                    disciplineStatusData.aggregatedStats.totalTitulaires,
                },
              ]}
              title={`Répartition par statut : ${specificFieldData?.fieldLabel}`}
            />
          )}
        </Col>
        <Col md={4}>
          <GeneralIndicatorsCard structureData={fieldData} />
          {disciplineStatusData && (
            <>
              <DisciplineStatusSummary
                totalCount={disciplineStatusData.totalCount || 0}
                aggregatedStats={disciplineStatusData.aggregatedStats || {}}
                fields={disciplineStatusData.fields || []}
                isSingleDiscipline={true}
              />
              <i>
                <Link
                  href={`/personnel-enseignant/discipline/enseignants-chercheurs/${fieldId}`}
                >
                  Pour plus de détails sur les enseignant-chercheurs, cliquez
                  ici
                </Link>
              </i>
            </>
          )}
        </Col>
      </Row>

      <Row className="fr-mt-5w fr-mb-5w"></Row>

      {filteredAgeData && filteredAgeData.length > 0 && (
        <Row gutters className="fr-mt-4w fr-mb-5w">
          <Col md={7}>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Id eum
            mollitia exercitationem ullam maxime a illo, cupiditate nostrum
            laudantium possimus doloribus iure dolor, laborum itaque, asperiores
            molestias similique natus! Blanditiis!
          </Col>
          <Col md={5}>
            <AgeDistributionPieChart
              ageData={filteredAgeData}
              isLoading={ageDistributionLoading}
              year={selectedYear}
              forcedSelectedField={fieldId}
            />
          </Col>
        </Row>
      )}
    </Container>
  );
}
