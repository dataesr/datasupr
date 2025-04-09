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
import { useParams } from "react-router-dom";
import useFacultyMembersByGeo from "./api/use-by-geo";
import useFacultyMembersGeoData from "../../use-faculty-members-general";
import ProfessionalCategoriesChart from "./charts/professional-categories/professional-categories";

export default function SpecificGeoOverview() {
  const [selectedYear, setSelectedYear] = useState("");
  const { geoId } = useParams();

  const {
    data: geoDataGlobal,
    isLoading: isGeoDataLoadingGlobal,
    isError: isGeoDataErrorGlobal,
    error: geoDataErrorGlobal,
  } = useFacultyMembersGeoData();

  const {
    data: geoDataSpecific,
    isLoading: isGeoDataLoadingSpecific,
    isError: isGeoDataErrorSpecific,
    error: geoDataErrorSpecific,
  } = useFacultyMembersByGeo(geoId || "");

  const [availableYears, setAvailableYears] = useState<string[]>([]);
  interface GeoDataItem {
    geo_id: string;
    annee_universitaire: string | number;
    totalHeadcountMan: number;
    totalHeadcountWoman: number;
    subjects: [];
    professional_categories: {
      id: string;
      label_fr: string;
      headcount: number;
    }[];
  }

  const [specificGeoData, setSpecificGeoData] = useState<GeoDataItem[] | null>(
    null
  );

  useEffect(() => {
    if (geoDataGlobal) {
      const years: string[] = geoDataGlobal.years
        ? geoDataGlobal.years.map(String)
        : [];

      setAvailableYears([...new Set(years)]);

      if (years.length > 0 && !selectedYear) {
        setSelectedYear(years[years.length - 1]);
      }

      if (geoDataSpecific && geoDataSpecific.length > 0) {
        setSpecificGeoData(geoDataSpecific);
      }
    }
  }, [geoDataGlobal, selectedYear, geoDataSpecific]);

  if (isGeoDataLoadingGlobal || isGeoDataLoadingSpecific) {
    return <div>Chargement des données...</div>;
  }

  if (isGeoDataErrorGlobal || isGeoDataErrorSpecific) {
    return (
      <div>
        Erreur: {geoDataErrorGlobal?.message || geoDataErrorSpecific?.message}
      </div>
    );
  }

  const displayedYearData = specificGeoData?.find(
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
            <Link href="/personnel-enseignant/vue-d'ensemble/geo">
              En un coup d'oeil
            </Link>
            <Link>
              <strong>
                {geoDataGlobal?.geos?.find((geo) => geo.geo_id === geoId)
                  ?.geo_nom || "Vue par région"}
              </strong>
            </Link>
          </Breadcrumb>
          <Title as="h3" look="h5" className="fr-mt-5w">
            {geoDataGlobal?.geos?.find((geo) => geo.geo_id === geoId)
              ?.geo_nom || "Vue par région"}
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
        <Col md={8} style={{ textAlign: "center" }}>
          <ProfessionalCategoriesChart
            categories={displayedYearData?.professional_categories ?? []}
          />
        </Col>
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
    </Container>
  );
}
