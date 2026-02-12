import { Alert, Col, Container, Link, Row, Text, Title } from "@dataesr/dsfr-plus";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useSearchParams } from "react-router-dom";

import { isInProduction } from "../../../../utils";
import Breadcrumb from "../../components/breadcrumb";
import { getEsQuery, years } from "../../utils";
import ClassificationsByStructure from "./charts/classifications-by-structure";
import Classifications2ByStructure from "./charts/classifications2-by-structure";
import FrenchPartnersByStructure from "./charts/french-partners-by-structure";
import InstrumentsByFunder from "./charts/instruments-by-funder";
import InternationalPartnersByStructure from "./charts/international-partners-by-structure";
import LaboratoriesByStructure from "./charts/laboratories-by-structure";
import OverviewByStructure from "./charts/overview-by-structure";
import ProjectsByStructure from "./charts/projects-by-structure";
import ProjectsOverTimeByStructure from "./charts/projects-over-time-by-structure";
import Cards from "./components/cards";

import "./styles.scss";

const { VITE_APP_ES_INDEX_PARTICIPATIONS, VITE_APP_SERVER_URL } = import.meta.env;

export default function DisplayStructure() {
  const [searchParams, setSearchParams] = useSearchParams();
  const section = searchParams.get("section");
  const structure = searchParams.get("structure");
  const yearMax = searchParams.get("yearMax") ?? String(years[years.length - 2]);
  const yearMin = searchParams.get("yearMin") ?? String(years[years.length - 2]);
  const [isOpen, setIsOpen] = useState(false);
  const sections = [
    { id: "financements", label: "Volume et répartition des financements" },
    { id: "evolution", label: "Evolution temporelle" },
    { id: "partenaires", label: "Institutions partenaires" },
    { id: "laboratoires", label: "Laboratoires" },
    { id: "disciplines", label: "Disciplines" },
  ];
  if (!isInProduction()) {
    sections.push({ id: "instrument", label: "Instruments" });
  }

  const handleNavClick = (section: string) => {
    searchParams.set("section", section);
    setSearchParams(searchParams);
    setIsOpen(false);
  };

  const handleYearMaxChange = (year: string) => {
    searchParams.set("yearMax", year);
    setSearchParams(searchParams);
  };

  const handleYearMinChange = (year: string) => {
    searchParams.set("yearMin", year);
    setSearchParams(searchParams);
  };

  const body = {
    ...getEsQuery({ structures: [structure], yearMax, yearMin }),
    size: 1,
  };
  const { data } = useQuery({
    queryKey: ["fundings-structure", structure, yearMax, yearMin],
    queryFn: () =>
      fetch(`${VITE_APP_SERVER_URL}/elasticsearch?index=${VITE_APP_ES_INDEX_PARTICIPATIONS}`, {
        body: JSON.stringify(body),
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
        method: "POST",
      }).then((response) => response.json()),
  });
  const structureInfo = Object.fromEntries(new URLSearchParams(data?.hits?.hits?.[0]?._source?.participant_encoded_key ?? ""));
  const label = structureInfo?.label ?? "";
  const scanrUrl = `https://scanr.enseignementsup-recherche.gouv.fr/search/projects?filters=%257B%2522year%2522%253A%257B%2522values%2522%253A%255B%257B%2522value%2522%253A${yearMin}%257D%252C%257B%2522value%2522%253A${yearMax}%257D%255D%252C%2522type%2522%253A%2522range%2522%257D%252C%2522participants_id_search%2522%253A%257B%2522values%2522%253A%255B%257B%2522value%2522%253A%2522${structure}%2522%252C%2522label%2522%253A%2522${label}%2522%257D%255D%252C%2522type%2522%253A%2522terms%2522%252C%2522operator%2522%253A%2522or%2522%257D%252C%2522type%2522%253A%257B%2522values%2522%253A%255B%257B%2522value%2522%253A%2522Horizon%25202020%2522%252C%2522label%2522%253Anull%257D%252C%257B%2522value%2522%253A%2522ANR%2522%252C%2522label%2522%253Anull%257D%252C%257B%2522value%2522%253A%2522PIA%2520hors%2520ANR%2522%252C%2522label%2522%253Anull%257D%252C%257B%2522value%2522%253A%2522Horizon%2520Europe%2522%252C%2522label%2522%253Anull%257D%252C%257B%2522value%2522%253A%2522PIA%2520ANR%2522%252C%2522label%2522%253Anull%257D%255D%252C%2522type%2522%253A%2522terms%2522%252C%2522operator%2522%253A%2522or%2522%257D%257D`;

  return (
    <>
      <Container fluid className="funding-gradient fr-mb-3w">
        <Container as="section">
          <Row gutters>
            <Col>
              <Breadcrumb items={[
                { href: "/financements-par-aap/accueil", label: "Financements par AAP" },
                { href: "/financements-par-aap/etablissement", label: "Vue par établissement" },
                { label }
              ]} />
            </Col>
          </Row>
          <Row gutters>
            <Col xs="12" md="8">
              <Title as="h1" className="fr-mb-1w" look="h4">
                {label}
              </Title>
              <Text size="xs">
                {structureInfo?.typologie_2}
              </Text>
              <Text>
                <span aria-hidden="true" className="fr-icon-map-pin-2-fill fr-mr-1w"></span>
                {structureInfo?.region}
              </Text>

            </Col>
            <Col>
              <div className="fr-mb-2w">
                <Link href="/financements-par-aap/etablissement">
                  <span aria-hidden="true" className="fr-icon-arrow-go-back-line fr-mr-1w" />
                  Changer d'établissement
                </Link>
              </div>
              <div>
                <Link href={scanrUrl} target="_blank">
                  Voir la liste de ces projets sur scanR
                </Link>
              </div>
            </Col>
          </Row>
        </Container>
      </Container>
      <Container className="fr-mb-3w">
        <Row gutters>
          <Col>
            <nav
              aria-label="Navigation secondaire"
              className="fr-nav fr-mb-1w"
              role="navigation"
            >
              <button
                aria-controls="section-nav-list"
                aria-expanded={isOpen}
                className="fr-btn fr-btn--secondary fr-btn--sm fr-icon-menu-fill data-mobile-burger"
                onClick={() => setIsOpen(!isOpen)}
              >
                Menu
              </button>
              <Row horizontalAlign="right" style={{ float: "right" }}>
                <Col md="1" style={{ display: "contents" }}>
                  <select
                    className="fr-select"
                    onChange={(e) => handleYearMinChange(e.target.value)}
                    style={{ width: "fit-content" }}
                    value={yearMin}
                  >
                    {[...years].sort((a, b) => b - a).map((year) => (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    ))}
                  </select>
                </Col>
                <Col md="1" style={{ display: "contents" }}>
                  <>
                    <Text className="fr-mx-1w" style={{ margin: "auto" }}>
                      à
                    </Text>
                    <select
                      className="fr-select"
                      onChange={(e) => handleYearMaxChange(e.target.value)}
                      style={{ width: "fit-content" }}
                      value={yearMax}
                    >
                      {[...years].sort((a, b) => b - a).map((year) => (
                        <option key={year} value={year}>
                          {year}
                        </option>
                      ))}
                    </select>
                  </>
                </Col>
              </Row>
              <ul className={`fr-nav__list ${isOpen ? 'fr-nav__list-open' : ''}`}>
                {sections.map((item) => (
                  <li key={item.id} className="fr-nav__item">
                    <button
                      aria-current={section === item.id ? "page" : undefined}
                      className="fr-nav__link"
                      onClick={() => handleNavClick(item.id)}
                    >
                      {item.label}
                    </button>
                  </li>
                ))}
              </ul>
            </nav>
          </Col>
        </Row>
        {((Number(yearMax) >= 2024) || (Number(yearMin) >= 2024)) &&
          <div style={{ float: "right" }}>
            <div>
              <Alert description="Les sources disponibles ne fournissent que des données provisoires pour 2024 et 2025" size="sm" variant="warning" />
            </div>
          </div>
        }
        {(yearMax < yearMin) ?
          (<Alert description="Merci de choisir une année de fin supérieure ou égale à l'année de début" title="Erreur dans le choix des années" variant="error" />) :
          (
            <>
              {(section === "financements") && (
                <>
                  <Cards />
                  <Row gutters>
                    <Col>
                      <ProjectsByStructure name={label} />
                    </Col>
                  </Row>
                  <Row gutters>
                    <Col>
                      <OverviewByStructure name={label} />
                    </Col>
                  </Row>
                </>
              )}
              {(section === "evolution") && (
                <Row gutters style={{ clear: "both" }}>
                  <Col>
                    <ProjectsOverTimeByStructure name={label} />
                  </Col>
                </Row>
              )}
              {(section === "partenaires") && (
                <>
                  <Row gutters style={{ clear: "both" }}>
                    <Col>
                      <FrenchPartnersByStructure name={label} />
                    </Col>
                  </Row>
                  <Row gutters>
                    <Col>
                      <InternationalPartnersByStructure name={label} />
                    </Col>
                  </Row>
                </>
              )}
              {(section === "laboratoires") && (
                <Row gutters style={{ clear: "both" }}>
                  <Col>
                    <LaboratoriesByStructure name={label} />
                  </Col>
                </Row>
              )}
              {(section === "disciplines") && (
                <>
                  <Row gutters style={{ clear: "both" }}>
                    <Col>
                      <ClassificationsByStructure name={label} />
                    </Col>
                  </Row>
                  <Row gutters>
                    <Col>
                      <Classifications2ByStructure name={label} />
                    </Col>
                  </Row>
                </>
              )}
              {(section === "instrument") && (
                <Row gutters style={{ clear: "both" }}>
                  <Col>
                    <InstrumentsByFunder name={label} />
                  </Col>
                </Row>
              )}
            </>
          )}
      </Container>
    </>
  );
}
