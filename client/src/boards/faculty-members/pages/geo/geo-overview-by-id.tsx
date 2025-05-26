import {
  Container,
  Row,
  Col,
  Title,
  Breadcrumb,
  Link,
  Text,
} from "@dataesr/dsfr-plus";
import { useState, useEffect } from "react";
import YearSelector from "../../filters";
import GenderPieChart from "./charts/gender/gender";
import CNUPieChart from "./charts/cnu/cnu";
import { useParams } from "react-router-dom";
import ProfessionalCategoriesChart from "./charts/professional-categories/professional-categories";
import AgeDistributionByRegion from "./charts/age";
import useFacultyMembersByRegion from "./api/use-by-regions";
import SubjectDistributionChart from "./charts/fields";
import { RegionApiData, RegionWithAgeData } from "./types";

export default function SpecificGeoOverview() {
  const [selectedYear, setSelectedYear] = useState("");
  const { geo_id } = useParams();

  const {
    data: regionApiData,
    isLoading: isRegionDataLoading,
    isError: isRegionDataError,
    error: regionDataError,
  } = useFacultyMembersByRegion(geo_id, selectedYear);

  const [availableYears, setAvailableYears] = useState<string[]>([]);
  const [regionData, setRegionData] = useState<RegionApiData | null>(null);
  const [ageDistributionData, setAgeDistributionData] = useState<
    RegionWithAgeData[]
  >([]);

  useEffect(() => {
    if (regionApiData) {
      if (!selectedYear && regionApiData.data) {
        if (!Array.isArray(regionApiData.data)) {
          const yearsFromData = Object.keys(regionApiData.data);
          setAvailableYears(yearsFromData);

          if (yearsFromData.length > 0) {
            setSelectedYear(yearsFromData[yearsFromData.length - 1]);
          }
        } else if (regionApiData.years && regionApiData.years.length > 0) {
          const years = regionApiData.years.map(String);
          setAvailableYears(years);

          if (years.length > 0) {
            setSelectedYear(years[years.length - 1]);
          }
        }
      }

      if (regionApiData.data) {
        if (Array.isArray(regionApiData.data)) {
          if (regionApiData.data.length > 0) {
            const regionInfo = regionApiData
              .data[0] as unknown as RegionApiData;
            setRegionData({
              geo_id: regionInfo.geo_id,
              geo_nom: regionInfo.geo_nom,
              annee_universitaire: selectedYear,
              totalHeadcountMan: regionInfo.demographie?.hommes?.nombre || 0,
              totalHeadcountWoman: regionInfo.demographie?.femmes?.nombre || 0,
              subjects: regionInfo.disciplines || [],
              professional_categories:
                regionInfo.categories_professionnelles || [],
              age_distribution: regionInfo.age_distribution || [],
            });

            if (
              regionInfo.age_distribution &&
              regionInfo.age_distribution.length > 0
            ) {
              setAgeDistributionData([
                {
                  geo_id: regionInfo.geo_id,
                  geo_nom: regionInfo.geo_nom,
                  totalHeadcount: regionInfo.demographie?.total || 0,
                  totalHeadcountWoman:
                    regionInfo.demographie?.femmes?.nombre || 0,
                  totalHeadcountMan:
                    regionInfo.demographie?.hommes?.nombre || 0,
                  age_distribution: regionInfo.age_distribution,
                },
              ]);
            }
          }
        } else {
          const yearsFromData = Object.keys(regionApiData.data);
          if (yearsFromData.length > 0) {
            const latestYear = yearsFromData[yearsFromData.length - 1];
            const regionsInYear = regionApiData.data[
              latestYear
            ] as RegionApiData[];

            if (regionsInYear && regionsInYear.length > 0) {
              const specificRegion = regionsInYear.find(
                (r) => r.geo_id === geo_id
              );
              if (specificRegion) {
                setRegionData({
                  geo_id: specificRegion.geo_id,
                  geo_nom: specificRegion.geo_nom,
                  annee_universitaire: latestYear,
                  totalHeadcountMan:
                    specificRegion.demographie?.hommes?.nombre || 0,
                  totalHeadcountWoman:
                    specificRegion.demographie?.femmes?.nombre || 0,
                  demographie: specificRegion.demographie,
                  subjects: specificRegion.disciplines || [],
                  professional_categories:
                    specificRegion.categories_professionnelles || [],
                  age_distribution: specificRegion.age_distribution || [],
                });

                if (
                  specificRegion.age_distribution &&
                  specificRegion.age_distribution.length > 0
                ) {
                  setAgeDistributionData([
                    {
                      geo_id: specificRegion.geo_id,
                      geo_nom: specificRegion.geo_nom,
                      totalHeadcount: specificRegion.demographie?.total || 0,
                      totalHeadcountWoman:
                        specificRegion.demographie?.femmes?.nombre || 0,
                      totalHeadcountMan:
                        specificRegion.demographie?.hommes?.nombre || 0,
                      age_distribution: specificRegion.age_distribution,
                    },
                  ]);
                }
              }
            }
          }
        }
      }
    }
  }, [regionApiData, selectedYear, geo_id]);

  if (isRegionDataLoading) {
    return <div>Chargement des données...</div>;
  }

  if (isRegionDataError) {
    return <div>Erreur: {regionDataError?.message}</div>;
  }

  const regionName = regionData?.geo_nom || "Région";
  const maleCount = regionData ? regionData.totalHeadcountMan : 0;
  const femaleCount = regionData ? regionData.totalHeadcountWoman : 0;

  return (
    <Container as="main">
      <Row>
        <Col md={9}>
          <Breadcrumb className="fr-m-0 fr-mt-1w">
            <Link href="/personnel-enseignant">Personnel enseignant</Link>
            <Link href="/personnel-enseignant/geo/vue-d'ensemble/">France</Link>
            <Link>
              <strong>{regionName}</strong>
            </Link>
          </Breadcrumb>
          <Title as="h3" look="h5" className="fr-mt-5w">
            {regionName}
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
      <Row>
        <Col md={8} style={{ textAlign: "center" }}>
          <SubjectDistributionChart
            subjects={regionData?.subjects || []}
            region={regionName}
            year={selectedYear}
          />
        </Col>
        <Col md={4} style={{ textAlign: "center" }}>
          <GenderPieChart maleCount={maleCount} femaleCount={femaleCount} />
        </Col>
      </Row>
      <Row>
        <Col md={8} style={{ textAlign: "center" }}>
          <ProfessionalCategoriesChart
            categories={regionData?.professional_categories ?? []}
          />
        </Col>
        <Col md={4} style={{ textAlign: "center" }}>
          <Text>
            Visualisation des catégories professionnelles des enseignants de la
            région {regionName}. Les données présentées montrent la répartition
            entre professeurs, maîtres de conférences et autres catégories
            d'enseignants.
          </Text>
        </Col>
      </Row>
      <Row gutters className="fr-mt-3w">
        <Col md={8}>
          {regionData &&
            regionData.subjects &&
            regionData.subjects.length > 0 && (
              <CNUPieChart subjects={regionData.subjects} />
            )}
        </Col>
        <Col md={4} style={{ textAlign: "center" }}>
          <Text>
            Répartition par discipline CNU des enseignants de la région{" "}
            {regionName}. Ces données permettent de visualiser les domaines
            d'expertise présents dans les établissements de la région.
          </Text>
        </Col>
      </Row>
      {ageDistributionData.length > 0 && (
        <Row gutters className="fr-mt-3w">
          <Col>
            <AgeDistributionByRegion
              regionsData={ageDistributionData.map((region) => ({
                ...region,
                annee_universitaire: selectedYear,
                subjects: [],
                professional_categories: [],
                age_distribution: region.age_distribution.map((ageClass) => ({
                  ...ageClass,
                  femaleCount: ageClass.femaleCount ?? 0,
                  maleCount: ageClass.maleCount ?? 0,
                })),
              }))}
              year={selectedYear}
            />
          </Col>
        </Row>
      )}
    </Container>
  );
}
