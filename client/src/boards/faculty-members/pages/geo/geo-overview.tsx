import {
  Container,
  Row,
  Col,
  Title,
  Breadcrumb,
  Link,
  Notice,
} from "@dataesr/dsfr-plus";
import { useState, useEffect } from "react";
import YearSelector from "../../filters";
import GenderPieChart from "./charts/gender/gender";
import CNUPieChart from "./charts/cnu/cnu";
import useFacultyMembersGeoData from "../../use-faculty-members-general";
import ProfessionalCategoriesChart from "./charts/professional-categories/professional-categories";

export default function GeoOverview() {
  const [selectedYear, setSelectedYear] = useState("");

  const {
    data: geoData,
    isLoading: isGeoDataLoading,
    isError: isGeoDataError,
    error: geoDataError,
  } = useFacultyMembersGeoData();

  const [availableYears, setAvailableYears] = useState<string[]>([]);
  const [availableGeos, setAvailableGeos] = useState<
    { geo_id: string; geo_nom: string }[]
  >([]);

  useEffect(() => {
    if (geoData) {
      const years: string[] = geoData.years ? geoData.years.map(String) : [];
      const geos = geoData.geos ? geoData.geos : [];

      const uniqueGeos = [
        ...new Map(geos.map((geo) => [geo.geo_id, geo])).values(),
      ] as { geo_id: string; geo_nom: string }[];

      setAvailableYears([...new Set(years)]);
      setAvailableGeos(uniqueGeos);

      if (years.length > 0 && !selectedYear) {
        setSelectedYear(years[years.length - 1]);
      }
    }
  }, [geoData, selectedYear]);

  if (isGeoDataLoading) {
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
        <Col md={8} style={{ textAlign: "center" }}>
          <Notice closeMode={"disallow"} type={"info"}>
            Lorem ipsum dolor sit, amet consectetur adipisicing elit. Corporis,
            aut, omnis animi eos est dolores sint, minus culpa libero neque
            placeat vitae quas deserunt optio minima. Architecto aut earum modi?
            placeat vitae quas deserunt optio minima. Architecto aut earum modi?
            placeat vitae quas deserunt optio minima. Architecto aut earum modi?
            placeat vitae quas deserunt optio minima. Architecto aut earum modi?
            placeat vitae quas deserunt optio minima. Architecto aut earum modi?
            placeat vitae quas deserunt optio minima. Architecto aut earum modi?
            placeat vitae quas deserunt optio minima. Architecto aut earum modi?
          </Notice>
        </Col>
        <Col md={4} style={{ textAlign: "center" }}>
          <GenderPieChart maleCount={maleCount} femaleCount={femaleCount} />
        </Col>
      </Row>
      <Row>
        <Col md={4} style={{ textAlign: "center" }}>
          <Notice closeMode={"disallow"} type={"info"}>
            Lorem ipsum dolor sit, amet consectetur adipisicing elit. Corporis,
            aut, omnis animi eos est dolores sint, minus culpa libero neque
            placeat vitae quas deserunt optio minima. Architecto aut earum modi?
            placeat vitae quas deserunt optio minima. Architecto aut earum modi?
            placeat vitae quas deserunt optio minima. Architecto aut earum modi?
            placeat vitae quas deserunt optio minima. Architecto aut earum modi?
            placeat vitae quas deserunt optio minima. Architecto aut earum modi?
            placeat vitae quas deserunt optio minima. Architecto aut earum modi?
            placeat vitae quas deserunt optio minima. Architecto aut earum modi?
          </Notice>
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
          <Notice closeMode={"disallow"} type={"info"}>
            Lorem ipsum dolor sit, amet consectetur adipisicing elit. Corporis,
            aut, omnis animi eos est dolores sint, minus culpa libero neque
            placeat vitae quas deserunt optio minima. Architecto aut earum modi?
            placeat vitae quas deserunt optio minima. Architecto aut earum modi?
            placeat vitae quas deserunt optio minima. Architecto aut earum modi?
            placeat vitae quas deserunt optio minima. Architecto aut earum modi?
          </Notice>
        </Col>
      </Row>
      <Row>
        <Col>
          <Title as="h4" look="h6">
            Sélectionner une région ou une académie:
          </Title>
          <ul>
            {availableGeos.map((geo) => (
              <li key={geo.geo_id}>
                <Link
                  href={`/personnel-enseignant/vue-d'ensemble/geo/${geo.geo_id}`}
                >
                  {geo.geo_nom} ({geo.geo_id})
                </Link>
              </li>
            ))}
          </ul>
        </Col>
      </Row>
    </Container>
  );
}
