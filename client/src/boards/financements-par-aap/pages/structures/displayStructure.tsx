import { Col, Container, Row, Title } from "@dataesr/dsfr-plus";
import { useState } from "react";
import { useSearchParams } from "react-router-dom";

import { years } from "../../utils";
import ClassificationsByStructure from "./charts/classifications-by-structure";
import Classifications2ByStructure from "./charts/classifications2-by-structure";
import FrenchPartnersByStructure from "./charts/french-partners-by-structure";
import InternationalPartnersByStructure from "./charts/international-partners-by-structure";
import LaboratoriesByStructure from "./charts/laboratories-by-structure";
import OverviewByStructure from "./charts/overview-by-structure";
import ProjectsByStructure from "./charts/projects-by-structure";
import ProjectsOverTimeByStructure from "./charts/projects-over-time-by-structure";
import Cards from "./components/cards";


export default function DisplayStructure() {
  const [searchParams, setSearchParams] = useSearchParams();
  const section = searchParams.get("section");
  const structure = searchParams.get("structure");
  const yearMax = searchParams.get("yearMax") ?? String(years[years.length - 2]);
  const yearMin = searchParams.get("yearMin") ?? String(years[years.length - 2]);
  const [isOpen, setIsOpen] = useState(false);
  const [name] = useState("");
  const sections = [
    { id: "financements", label: "Volume et répartition des financements" },
    { id: "evolution", label: "Evolution temporelle" },
    { id: "partenaires", label: "Institutions partenaires" },
    { id: "laboratoires", label: "Laboratoires" },
    { id: "disciplines", label: "Disciplines" },
  ];

  const scanrUrl = `https://scanr.enseignementsup-recherche.gouv.fr/search/projects?filters=%257B%2522year%2522%253A%257B%2522values%2522%253A%255B%257B%2522value%2522%253A${yearMin}%257D%252C%257B%2522value%2522%253A${yearMax}%257D%255D%252C%2522type%2522%253A%2522range%2522%257D%252C%2522participants_id_search%2522%253A%257B%2522values%2522%253A%255B%257B%2522value%2522%253A%2522${structure}%2522%252C%2522label%2522%253A%2522${name}%2522%257D%255D%252C%2522type%2522%253A%2522terms%2522%252C%2522operator%2522%253A%2522or%2522%257D%252C%2522type%2522%253A%257B%2522values%2522%253A%255B%257B%2522value%2522%253A%2522Horizon%25202020%2522%252C%2522label%2522%253Anull%257D%252C%257B%2522value%2522%253A%2522ANR%2522%252C%2522label%2522%253Anull%257D%252C%257B%2522value%2522%253A%2522PIA%2520hors%2520ANR%2522%252C%2522label%2522%253Anull%257D%252C%257B%2522value%2522%253A%2522Horizon%2520Europe%2522%252C%2522label%2522%253Anull%257D%252C%257B%2522value%2522%253A%2522PIA%2520ANR%2522%252C%2522label%2522%253Anull%257D%255D%252C%2522type%2522%253A%2522terms%2522%252C%2522operator%2522%253A%2522or%2522%257D%257D`;

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

  return (
    <Container className="board-fundings">
      <Row gutters>
        <Col>
          <Title as="h1" look="h4">
            {name}
          </Title>
        </Col>
      </Row>
      <Row gutters>
        <Col>
          <div className="chart-container chart-container--default" id="projects-list">
            <Title as="h2" look="h6">
              {`Liste des projets de ${name}`}
            </Title>
            <div>
              <a href={scanrUrl} target="_blank">Voir ces projets sur scanR</a>
            </div>
          </div>
        </Col>
      </Row>
      <Row gutters>
        <Col>
          <nav
            aria-label="Navigation secondaire"
            className="fr-nav fr-mb-1w"
            role="navigation"
          >
            <button
              className="fr-btn fr-btn--secondary fr-btn--sm fr-icon-menu-fill data-mobile-burger"
              onClick={() => setIsOpen(!isOpen)}
              aria-expanded={isOpen}
              aria-controls="section-nav-list"
            >
              Menu
            </button>
            <ul className={`fr-nav__list ${isOpen ? 'fr-nav__list-open' : ''}`}>
              {sections.map((item) => (
                <li key={item.id} className="fr-nav__item">
                  <a
                    aria-current={section === item.id ? "page" : undefined}
                    className="fr-nav__link"
                    onClick={() => handleNavClick(item.id)}
                  >
                    {item.label}
                  </a>
                </li>
              ))}
              <li className="fr-ml-auto">
                <select
                  className="fr-select"
                  onChange={(e) => handleYearMinChange(e.target.value)}
                  value={yearMin}
                >
                  {[...years].sort((a, b) => b - a).map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
              </li>
              <li className="fr-ml-1w">
                <select
                  className="fr-select"
                  onChange={(e) => handleYearMaxChange(e.target.value)}
                  value={yearMax}
                >
                  {[...years].sort((a, b) => b - a).map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
              </li>
            </ul>
          </nav>
        </Col>
      </Row>
      {(section === "financements") && (
        <>
          <Cards />
          <Row gutters>
            <Col>
              <ProjectsByStructure name={name} />
            </Col>
          </Row>
          <Row gutters>
            <Col>
              <OverviewByStructure name={name} />
            </Col>
          </Row>
        </>
      )}
      {(section === "evolution") && (
        <Row gutters>
          <Col>
            <ProjectsOverTimeByStructure name={name} />
          </Col>
        </Row>
      )}
      {(section === "partenaires") && (
        <>
          <Row gutters>
            <Col>
              <FrenchPartnersByStructure name={name} />
            </Col>
          </Row>
          <Row gutters>
            <Col>
              <InternationalPartnersByStructure name={name} />
            </Col>
          </Row>
        </>
      )}
      {(section === "laboratoires") && (
        <Row gutters>
          <Col>
            <LaboratoriesByStructure name={name} />
          </Col>
        </Row>
      )}
      {(section === "disciplines") && (
        <>
          <Row gutters>
            <Col>
              <ClassificationsByStructure name={name} />
            </Col>
          </Row>
          <Row gutters>
            <Col>
              <Classifications2ByStructure name={name} />
            </Col>
          </Row>
        </>
      )}
    </Container>
  );
}