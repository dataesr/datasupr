import { Alert, Col, Container, Row, Title } from "@dataesr/dsfr-plus";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

import YearSelector from "../../components/year-selector";
import ClassificationsByStructure from "./charts/classifications-by-structure";
import Classifications2ByStructure from "./charts/classifications2-by-structure";
import FrenchPartnersByStructure from "./charts/french-partners-by-structure";
import InternationalPartnersByStructure from "./charts/international-partners-by-structure";
import LaboratoriesByStructure from "./charts/laboratories-by-structure";
import OverviewByStructure from "./charts/overview-by-structure";
import ProjectsByStructure from "./charts/projects-by-structure";
import ProjectsOverTimeByStructure from "./charts/projects-over-time-by-structure";
import Cards from "./components/cards";
import StructureSelector from "./components/structure-selector";
import { years } from "../../utils";

import "./styles.scss";


export default function Structures() {
  const [searchParams, setSearchParams] = useSearchParams();
  const structure = searchParams.get("structure");
  const yearMax = searchParams.get("yearMax") ?? String(years[years.length - 2]);
  const yearMin = searchParams.get("yearMin") ?? String(years[years.length - 2]);
  const section = searchParams.get("section");
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState("");
  const tabs = [
    { id: "financements", label: "Volume et répartition des financements" },
    { id: "evolution", label: "Evolution temporelle" },
    { id: "partenaires", label: "Institutions partenaires" },
    { id: "laboratoires", label: "Laboratoires" },
    { id: "disciplines", label: "Disciplines" },
  ];

  const scanrUrl = `https://scanr.enseignementsup-recherche.gouv.fr/search/projects?filters=%257B%2522year%2522%253A%257B%2522values%2522%253A%255B%257B%2522value%2522%253A${yearMin}%257D%252C%257B%2522value%2522%253A${yearMax}%257D%255D%252C%2522type%2522%253A%2522range%2522%257D%252C%2522participants_id_search%2522%253A%257B%2522values%2522%253A%255B%257B%2522value%2522%253A%2522${structure}%2522%252C%2522label%2522%253A%2522${name}%2522%257D%255D%252C%2522type%2522%253A%2522terms%2522%252C%2522operator%2522%253A%2522or%2522%257D%252C%2522type%2522%253A%257B%2522values%2522%253A%255B%257B%2522value%2522%253A%2522Horizon%25202020%2522%252C%2522label%2522%253Anull%257D%252C%257B%2522value%2522%253A%2522ANR%2522%252C%2522label%2522%253Anull%257D%252C%257B%2522value%2522%253A%2522PIA%2520hors%2520ANR%2522%252C%2522label%2522%253Anull%257D%252C%257B%2522value%2522%253A%2522Horizon%2520Europe%2522%252C%2522label%2522%253Anull%257D%252C%257B%2522value%2522%253A%2522PIA%2520ANR%2522%252C%2522label%2522%253Anull%257D%255D%252C%2522type%2522%253A%2522terms%2522%252C%2522operator%2522%253A%2522or%2522%257D%257D`;

  const onSectionChange = (newSection: string) => {
    searchParams.set("section", newSection);
    setSearchParams(searchParams);
  };

  const handleNavClick = (id: string) => {
    onSectionChange(id);
    setIsOpen(false);
  };

  useEffect(() => {
    if (!searchParams.get("section")) {
      searchParams.set("section", "financements");
      setSearchParams(searchParams);
    }
  }, [searchParams, setSearchParams]);

  return (
    <Container className="board-fundings fr-pt-3w">
      <Row gutters>
        <Col>
          <StructureSelector setName={setName} />
        </Col>
      </Row>
      <Row gutters>
        <Col>
          <YearSelector />
        </Col>
      </Row>
      {(Number(yearMin) <= Number(yearMax)) && (
        structure ? (
          <>
            <Row gutters>
              <Col>
                <nav
                  className="fr-nav fr-mb-1w"
                  id="section-navigation"
                  role="navigation"
                  aria-label="Navigation secondaire"
                  style={{ borderBottom: "1px solid var(--border-default-grey)" }}
                >
                  {/* Burger button - visible only on mobile */}
                  <button
                    className="fr-btn fr-btn--secondary fr-btn--sm fr-icon-menu-fill"
                    onClick={() => setIsOpen(!isOpen)}
                    aria-expanded={isOpen}
                    aria-controls="section-nav-list"
                    data-mobile-burger
                  >
                    Menu
                  </button>
                  <ul
                    id="section-nav-list"
                    className="fr-nav__list"
                    style={{ alignItems: "center" }}
                    data-nav-list
                    data-open={isOpen}
                  >
                    {tabs.map((item) => (
                      <li key={item.id} className="fr-nav__item">
                        <a
                          className="fr-nav__link"
                          href={`#${item.id}`}
                          aria-current={section === item.id ? "page" : undefined}
                          onClick={(e) => {
                            e.preventDefault();
                            handleNavClick(item.id);
                          }}
                        >
                          {item.label}
                        </a>
                      </li>
                    ))}
                    <li>
                      <select
                        className="fr-select"
                        value={yearMin}
                      >
                        {years.map((year) => (
                          <option
                            key={year}
                            value={year}
                          >
                            {year}
                          </option>
                        ))}
                      </select>
                    </li>
                    <li>
                      <select
                        className="fr-select"
                        value={yearMax}
                      >
                        {years.map((year) => (
                          <option
                            key={year}
                            value={year}
                          >
                            {year}
                          </option>
                        ))}
                      </select>
                    </li>
                  </ul>
                </nav>
              </Col>
            </Row>
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
            <Row gutters>
              <Col>
                <ProjectsOverTimeByStructure name={name} />
              </Col>
            </Row>
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
            <Row gutters>
              <Col>
                <LaboratoriesByStructure name={name} />
              </Col>
            </Row>
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
          </>
        ) : (
          <Alert
            className="fr-mt-3w"
            description="Choisissez une structure dans la liste déroulante pour visualiser
            ses financements via les appels à projets. Vous pouvez filtrer par région et par typologie."
            title="Sélectionner une structure"
            variant="info"
          />
        )
      )}
    </Container >
  );
}
