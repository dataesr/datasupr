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
import CNUPieChart from "./charts/cnu/cnu";
import FacultyFranceMap from "./map";
import GenderPieChart from "./charts/gender/gender";
import GeneralIndicatorsCard from "../../components/general-indicators-card";
import ProfessionalCategoriesChart from "./charts/professional-categories/professional-categories";
import useFacultyMembersGeoData from "../../use-faculty-members-general";
import YearSelector from "../../filters";
import { formatDataForIndicatorsCard } from "./utils";
import AgeDistributionByRegion from "./charts/age";
import useFacultyMembersByRegion from "./api/use-by-regions";

export default function GeoOverview() {
  const [selectedYear, setSelectedYear] = useState("");

  const {
    data: geoData,
    isLoading: isGeoDataLoading,
    isError: isGeoDataError,
    error: geoDataError,
  } = useFacultyMembersGeoData();

  const { data: regionData, isLoading: isRegionDataLoading } =
    useFacultyMembersByRegion(undefined, selectedYear);

  const [availableYears, setAvailableYears] = useState<string[]>([]);
  const [availableGeos, setAvailableGeos] = useState<
    {
      femaleCount: number;
      femalePercent: number;
      geo_id: string;
      geo_nom: string;
      maleCount: number;
      malePercent: number;
      totalCount: number;
    }[]
  >([]);
  const [regionsWithAgeData, setRegionsWithAgeData] = useState<
    {
      geo_id: string;
      geo_nom: string;
      age_distribution: {
        age_class: string;
        headcount: number;
        femaleCount: number;
        maleCount: number;
      }[];
    }[]
  >([]);

  useEffect(() => {
    if (geoData) {
      const years: string[] = geoData.years ? geoData.years.map(String) : [];
      const geos = geoData.geos
        ? geoData.geos.filter(
            (geo) => geo.niveau_geo === "Région" && geo.geo_nom !== null
          )
        : [];
      const yearData = geoData.data?.find(
        (item) => String(item.annee_universitaire) === selectedYear
      );

      if (yearData?.regions && geos.length > 0) {
        const enrichedGeos = geos.map((geo) => {
          const regionData = yearData.regions.find(
            (r) => r.geo_id === geo.geo_id
          );

          if (regionData) {
            return {
              ...geo,
              femaleCount: regionData.totalHeadcountWoman,
              femalePercent: regionData.femalePercent,
              maleCount: regionData.totalHeadcountMan,
              malePercent: regionData.malePercent,
              totalCount: regionData.totalHeadcount,
            };
          }

          return {
            ...geo,
            femaleCount: 0,
            femalePercent: 0,
            maleCount: 0,
            malePercent: 0,
            totalCount: 0,
          };
        });

        setAvailableGeos(enrichedGeos);
      }
      if (years.length > 0 && !selectedYear) {
        setSelectedYear(years[years.length - 1]);
      }

      setAvailableYears(years);
    }
  }, [geoData, selectedYear]);

  useEffect(() => {
    if (regionData && selectedYear) {
      const regionsData = Array.isArray(regionData.data) ? regionData.data : [];

      const transformedRegionsData = regionsData
        .filter(
          (region) =>
            region.age_distribution && region.age_distribution.length > 0
        )
        .map((region) => ({
          geo_id: region.geo_id,
          geo_nom: region.geo_nom,
          totalHeadcount: region.demographie?.total || 0,
          totalHeadcountWoman: region.demographie?.femmes?.nombre || 0,
          totalHeadcountMan: region.demographie?.hommes?.nombre || 0,
          age_distribution: region.age_distribution || [],
        }))
        .filter((region) => region.totalHeadcount > 0);

      setRegionsWithAgeData(transformedRegionsData);
    } else {
      setRegionsWithAgeData([]);
    }
  }, [regionData, selectedYear]);

  if (isGeoDataLoading || isRegionDataLoading) {
    return <div>Chargement des données...</div>;
  }

  if (isGeoDataError) {
    return <div>Erreur: {geoDataError?.message}</div>;
  }

  const displayedYearData = geoData.data?.find(
    (item) => String(item.annee_universitaire) === selectedYear
  );

  const maleCount = displayedYearData ? displayedYearData.totalHeadcountMan : 0;
  const femaleCount = displayedYearData
    ? displayedYearData.totalHeadcountWoman
    : 0;

  return (
    <Container as="main">
      <Row>
        <Col md={9}>
          <Breadcrumb className="fr-m-0 fr-mt-1w">
            <Link href="/personnel-enseignant">Personnel enseignant</Link>
            <Link>
              <strong>En un coup d'oeil</strong>
            </Link>
          </Breadcrumb>
          <Title as="h3" look="h5" className="fr-mt-5w">
            Donnée au niveau national
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
        <Col md={8} className="fr-mb-3w">
          <FacultyFranceMap availableGeos={availableGeos} />
        </Col>
        <Col md={4} style={{ textAlign: "center" }}>
          <GeneralIndicatorsCard
            structureData={formatDataForIndicatorsCard(geoData, selectedYear)}
          />
          <GenderPieChart maleCount={maleCount} femaleCount={femaleCount} />
        </Col>
      </Row>
      <Row>
        <Col md={4} style={{ textAlign: "center" }}>
          <Text>
            Lorem ipsum dolor sit, amet consectetur adipisicing elit. Corporis,
            aut, omnis animi eos est dolores sint, minus culpa libero neque
            placeat vitae quas deserunt optio minima. Architecto aut earum modi?
            placeat vitae quas deserunt optio minima. Architecto aut earum modi?
            placeat vitae quas deserunt optio minima. Architecto aut earum modi?
            placeat vitae quas deserunt optio minima. Architecto aut earum modi?
            placeat vitae quas deserunt optio minima. Architecto aut earum modi?
            placeat vitae quas deserunt optio minima. Architecto aut earum modi?
            placeat vitae quas deserunt optio minima. Architecto aut earum modi?
          </Text>
        </Col>
        <Col md={8} style={{ textAlign: "center" }}>
          <ProfessionalCategoriesChart
            categories={displayedYearData?.professional_categories}
          />
        </Col>
      </Row>
      <Row gutters className="fr-mt-3w">
        <Col md={8}>
          {displayedYearData && (
            <CNUPieChart subjects={displayedYearData.subjects} />
          )}
        </Col>
        <Col md={4} style={{ textAlign: "center" }}>
          <Text>
            Lorem ipsum dolor sit, amet consectetur adipisicing elit. Corporis,
            aut, omnis animi eos est dolores sint, minus culpa libero neque
            placeat vitae quas deserunt optio minima. Architecto aut earum modi?
            placeat vitae quas deserunt optio minima. Architecto aut earum modi?
            placeat vitae quas deserunt optio minima. Architecto aut earum modi?
            placeat vitae quas deserunt optio minima. Architecto aut earum modi?
          </Text>
        </Col>
      </Row>
      {regionsWithAgeData.length > 0 && (
        <Row className="fr-mt-4w">
          <Col>
            <AgeDistributionByRegion
              regionsData={regionsWithAgeData}
              year={selectedYear}
            />
          </Col>
        </Row>
      )}
      <Row>
        <Col>
          <Title as="h4" look="h6">
            Sélectionner une région ou une académie:
          </Title>
          <div
            className="fr-container"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
              gap: "1rem",
            }}
          >
            {availableGeos.map((geo) => (
              <Link
                key={geo.geo_id}
                href={`/personnel-enseignant/geo/vue-d'ensemble/${geo.geo_id}`}
                title={`Voir les détails de ${geo.geo_id}`}
                style={{
                  borderRadius: "12px",
                  padding: "1rem",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "start",
                  textDecoration: "none",
                  transition: "all 0.2s ease",
                  boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "scale(1.03)";
                  e.currentTarget.style.boxShadow =
                    "0 4px 12px rgba(0,0,0,0.1)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "scale(1)";
                  e.currentTarget.style.boxShadow = "0 1px 3px rgba(0,0,0,0.1)";
                }}
              >
                <div
                  style={{
                    fontSize: "0.9rem",
                    fontWeight: "600",
                  }}
                >
                  {geo.geo_nom}
                </div>
              </Link>
            ))}
          </div>
        </Col>
      </Row>
    </Container>
  );
}
