import {
<<<<<<< HEAD
  Breadcrumb,
  Button,
  Col,
  Container,
  Link,
  Row,
  Title,
} from "@dataesr/dsfr-plus";
import { useNavigate } from "react-router-dom";

export function FacultyMembers() {
  const navigate = useNavigate();

  const handleClick =
    (url: string) => (event: React.MouseEvent<HTMLButtonElement>) => {
      event.preventDefault();
      navigate(url);
    };

  return (
    <Container>
      <Breadcrumb className="fr-m-0 fr-mt-1w">
        <Link href="/">Accueil</Link>
        <Link>
          <strong>Dashboard </strong>
        </Link>
      </Breadcrumb>
      <Title as="h2" look="h5" className="fr-mt-5w">
        Le personnel enseignant
      </Title>
      <Row>
        <Col md={10} className="search">
          <label className="fr-label" htmlFor="text-input-text">
            Saisissez un établissement, une discipline, un nom de region ou une
            académie.
          </label>
          <input
            className="fr-input"
            type="text"
            id="text-input-text"
            name="text-input-text"
          />
        </Col>
        <Col md={2}>
          <Button
            className="fr-mt-4w"
            color="pink-tuile"
            icon="search-line"
            onClick={() => {}}
          >
            Rechercher
          </Button>
        </Col>
      </Row>
      <Row gutters className="fr-mt-5w">
        <Col style={{ textAlign: "center" }}>
          <Button
            onClick={handleClick(
              "/personnel-enseignant/discipline/vue-d'ensemble"
            )}
          >
            Par discipline
          </Button>
          <div>
            <svg
              className="fr-artwork"
              aria-hidden="true"
              viewBox="0 0 80 80"
              width="200px"
              height="200px"
            >
              <use
                className="fr-artwork-decorative"
                href="/artwork/pictograms/leisure/book.svg#artwork-decorative"
              />
              <use
                className="fr-artwork-minor"
                href="/artwork/pictograms/leisure/book.svg#artwork-minor"
              />
              <use
                className="fr-artwork-major"
                href="/artwork/pictograms/leisure/book.svg#artwork-major"
              />
            </svg>
          </div>
        </Col>
        <Col style={{ textAlign: "center" }}>
          <Button
            onClick={handleClick("/personnel-enseignant/geo/vue-d'ensemble")}
          >
            Par géographie
          </Button>
          <div>
            <svg
              className="fr-artwork"
              aria-hidden="true"
              viewBox="0 0 80 80"
              width="200px"
              height="200px"
            >
              <use
                className="fr-artwork-decorative"
                href="/artwork/pictograms/map/location-france.svg#artwork-decorative"
              />
              <use
                className="fr-artwork-minor"
                href="/artwork/pictograms/map/location-france.svg#artwork-minor"
              />
              <use
                className="fr-artwork-major"
                href="/artwork/pictograms/map/location-france.svg#artwork-major"
              />
            </svg>
          </div>
        </Col>
        <Col style={{ textAlign: "center" }}>
          <Button
            onClick={handleClick(
              "/personnel-enseignant/universite/vue-d'ensemble/"
            )}
          >
            Par université
          </Button>
          <div>
            <svg
              className="fr-artwork"
              aria-hidden="true"
              viewBox="0 0 80 80"
              width="200px"
              height="200px"
            >
              <use
                className="fr-artwork-decorative"
                href="/artwork/pictograms/buildings/school.svg#artwork-decorative"
              />
              <use
                className="fr-artwork-minor"
                href="/artwork/pictograms/buildings/school.svg#artwork-minor"
              />
              <use
                className="fr-artwork-major"
                href="/artwork/pictograms/buildings/school.svg#artwork-major"
              />
            </svg>
          </div>
        </Col>
      </Row>
    </Container>
=======
  Container,
  Row,
  Col,
  Title,
  Breadcrumb,
  Link,
  Text,
} from "@dataesr/dsfr-plus";
import { useState, useEffect } from "react";
import useFacultyMembersByStructures from "./api/use-faculty-members-by-structures";
import YearFilter from "./filters";
import GenderPieChart from "./charts/gender";
import CNUPieChart from "./charts/cnu";

export default function FacultyMembers() {
  const [selectedYear, setSelectedYear] = useState("");
  const {
    data: facultyByYear,
    isLoading,
    isError,
    error,
  } = useFacultyMembersByStructures(selectedYear);

  const [availableYears, setAvailableYears] = useState<string[]>([]);

  useEffect(() => {
    if (facultyByYear) {
      const years: string[] = facultyByYear
        .map((item) => String(item.annee_universitaire))
        .filter((year): year is string => typeof year === "string");

      setAvailableYears([...new Set(years)]);
    }
  }, [facultyByYear, selectedYear]);

  if (isLoading) {
    return <div>Chargement des données...</div>;
  }

  if (isError) {
    return <div>Erreur: {error?.message}</div>;
  }

  const displayedYear = selectedYear
    ? selectedYear
    : facultyByYear && facultyByYear.length > 0
    ? facultyByYear[facultyByYear.length - 1].annee_universitaire
    : "Année non disponible";

  const displayedYearData = facultyByYear?.find(
    (item) => item.annee_universitaire === displayedYear
  );
  const totalFaculty = displayedYearData ? displayedYearData.totalFaculty : 0;

  const numMaitresDeConferencesConference = displayedYearData
    ? displayedYearData.numMaitresDeConferencesConference
    : 0;

  const numProfessor = displayedYearData ? displayedYearData.numProfessor : 0;

  const maleCount = displayedYearData ? displayedYearData.maleCount : 0;
  const femaleCount = displayedYearData ? displayedYearData.femaleCount : 0;

  const MainFields = displayedYearData
    ? displayedYearData.grande_discipline
    : {};

  return (
    <>
      <Container as="main">
        <Row gutters>
          <Col>
            <Breadcrumb className="fr-m-0 fr-mt-1w">
              <Link href="/">Accueil</Link>
              <Link>
                <strong>Dashboard </strong>
              </Link>
            </Breadcrumb>
            <Title as="h3" look="h5">
              Niveaux d'agrégation : Universitaire - Vue Globale
            </Title>
          </Col>
        </Row>
        <Row gutters>
          <Col>
            <YearFilter
              key={availableYears.join(",")}
              years={availableYears}
              selectedYear={selectedYear}
              onYearChange={(year) => setSelectedYear(year)}
            />
          </Col>
        </Row>
        <Row gutters>
          <Col sm="6" md="2">
            <div className="fr-card fr-card--grey fr-card--body">
              <div className="fr-card__body">
                <div className="fr-card__content">
                  <Text size="sm">Total enseignants :</Text>
                  <strong>{totalFaculty}</strong>
                </div>
              </div>
            </div>
          </Col>
          <Col sm="6" md="2">
            <div className="fr-card fr-card--grey fr-card--body">
              <div className="fr-card__body">
                <div className="fr-card__content">
                  <Text size="sm">Maîtres de Conférence :</Text>
                  <strong>{numMaitresDeConferencesConference}</strong>
                </div>
              </div>
            </div>
          </Col>
          <Col sm="6" md="2">
            <div className="fr-card fr-card--grey fr-card--body">
              <div className="fr-card__body">
                <div className="fr-card__content">
                  <Text size="sm">Professeurs :</Text>
                  <strong>{numProfessor}</strong>
                </div>
              </div>
            </div>
          </Col>
          <Col sm="6" md="2">
            <div className="fr-card fr-card--grey fr-card--body">
              <div className="fr-card__body">
                <div className="fr-card__content">
                  <Text size="sm">Hommes :</Text>
                  <strong>{maleCount}</strong>
                </div>
              </div>
            </div>
          </Col>
          <Col sm="3" md="2">
            <div className="fr-card fr-card--grey fr-card--body">
              <div className="fr-card__body">
                <div className="fr-card__content">
                  <Text size="sm">Femmes :</Text>
                  <strong>{femaleCount}</strong>
                </div>
              </div>
            </div>
          </Col>
          <Col md="2">
            <GenderPieChart maleCount={maleCount} femaleCount={femaleCount} />
          </Col>
        </Row>
        <Col md="3">
          <Text size="sm">Répartition par Grande Discipline :</Text>
          <div style={{ width: "150px", height: "150px" }}>
            <CNUPieChart MainFields={MainFields} />
          </div>
        </Col>
      </Container>
    </>
>>>>>>> 4a5458f6 (from staging to faculty members)
  );
}
