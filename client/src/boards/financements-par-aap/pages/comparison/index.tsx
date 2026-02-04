import { Alert, Col, Container, Row, Text, Title } from "@dataesr/dsfr-plus";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

import Breadcrumb from "../../components/breadcrumb";
import { years } from "../../utils";
import ClassificationsByStructures from "./charts/classifications-by-structures";
import Dispersion from "./charts/dispersion";
import ProjectsByStructures from "./charts/projects-by-structures";
import StructuresSelector from "./components/structures-selector";

import "./styles.scss";


export default function Comparison() {
  const [searchParams, setSearchParams] = useSearchParams({});
  const section = searchParams.get("section");
  const structures = searchParams.getAll("structure");
  const yearMax = searchParams.get("yearMax") ?? String(years[years.length - 2]);
  const yearMin = searchParams.get("yearMin") ?? String(years[years.length - 2]);
  const [isOpen, setIsOpen] = useState(false);
  const sections = [
    { id: "financements", label: "Volume et répartition des financements" },
    { id: "disciplines", label: "Disciplines" },
  ];

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

  useEffect(() => {
    if (!searchParams.get("section")) {
      searchParams.set("section", "financements");
      setSearchParams(searchParams);
    }
  }, [searchParams, setSearchParams]);

  return (
    <>
      <Container fluid className="funding-gradient fr-mb-3w">
        <Container as="section">
          <Row gutters>
            <Col>
              <Breadcrumb items={[
                { href: "/financements-par-aap/accueil", label: "Financements par AAP" },
                { label: "Comparaison entre établissements" },
              ]} />
            </Col>
          </Row>
          <Row gutters>
            <Col>
              <Title as="h1" look="h4">
                Comparaison entre établissements
              </Title>
            </Col>
          </Row>
          <Row gutters>
            <Col>
              <StructuresSelector />
            </Col>
          </Row>
        </Container>
      </Container>
      <Container className="fr-mb-3w">
        {(Number(yearMin) <= Number(yearMax)) && (
          (structures && structures.length >= 2) ? (
            <>
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
              {(section === "financements") && (
                <>
                  <Row gutters>
                    <Col>
                      <ProjectsByStructures />
                    </Col>
                  </Row>
                  <Row gutters>
                    <Col>
                      <Dispersion />
                    </Col>
                  </Row>
                </>
              )}
              {(section === "disciplines") && (
                <Row gutters>
                  <Col>
                    <ClassificationsByStructures />
                  </Col>
                </Row>
              )}
            </>
          ) : (
            <Alert
              description="Sélectionner plusieurs établissements dans la liste déroulante pour visualiser
              leurs financements via les appels à projets. Vous pouvez filtrer par région et par typologie."
              className="fr-mt-3w"
              title="Sélectionner plusieurs établissements"
              variant="info"
            />
          )
        )}
      </Container>
    </>
  )
}