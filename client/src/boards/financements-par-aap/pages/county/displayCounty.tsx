import { Alert, Button, Col, Container, Row, Text, Title } from "@dataesr/dsfr-plus";
import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import Select from "../../../../components/select";
import Breadcrumb from "../../components/breadcrumb";
import { years } from "../../utils";
// import ClassificationsByStructure from "./charts/classifications-by-structure";
// import Classifications2ByStructure from "./charts/classifications2-by-structure";
// import CountiesByStructure from "./charts/counties-by-structure";
// import FrenchPartnersByStructure from "./charts/french-partners-by-structure";
// import InstrumentsForAnr from "./charts/instruments-for-anr";
// import InstrumentsForEurope from "./charts/instruments-for-europe";
// import InstrumentsOverTimeForAnr from "./charts/instruments-over-time-for-anr";
// import InstrumentsOverTimeForEurope from "./charts/instruments-over-time-for-europe";
// import InternationalPartnersByStructure from "./charts/international-partners-by-structure";
// import LaboratoriesByStructure from "./charts/laboratories-by-structure";
// import OverviewByStructure from "./charts/overview-by-structure";
// import ProjectsByStructure from "./charts/projects-by-structure";
// import ProjectsOverTimeByStructure from "./charts/projects-over-time-by-structure";
import Cards from "../../components/cards";
// import ProjectsData from "./components/projects-data";

import "./styles.scss";

export default function DisplayCounty() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const section = searchParams.get("section");
  const county = searchParams.get("region");
  const yearMax = searchParams.get("yearMax") ?? String(years[years.length - 2]);
  const yearMin = searchParams.get("yearMin") ?? String(years[years.length - 2]);
  const [isOpen, setIsOpen] = useState(false);
  const sections = [
    { id: "apercu", label: "Aperçu" },
    // { id: "financements", label: "Volume et répartition des financements" },
    // { id: "evolution", label: "Evolution temporelle" },
    // { id: "partenaires", label: "Institutions partenaires" },
    // { id: "laboratoires", label: "Laboratoires" },
    // { id: "disciplines", label: "Disciplines" },
    // { id: "instruments", label: "Instruments" },,
    // { id: "regions", label: "Régions" },
    // { id: "donnees", label: "Données" },
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

  return (
    <main>
      <Container fluid className="funding-gradient fr-mb-3w">
        <Container as="section">
          <Row gutters>
            <Col>
              <Breadcrumb items={[
                { href: "/financements-par-aap/accueil", label: "Financements par AAP" },
                { href: "/financements-par-aap/region", label: "Vue par région" },
                { label: county }
              ]} />
            </Col>
          </Row>
          <Row gutters className="fr-grid-row--middle fr-mb-2w">
            <Col xs="12" md="6">
              <Title as="h1" className="fr-mb-1v" look="h4">
                {county}
              </Title>
            </Col>
            <Col xs="12" md="6" style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "0.5rem" }}>
              <Button
                icon="arrow-go-back-line"
                iconPosition="left"
                onClick={() => navigate("/financements-par-aap/region")}
                size="sm"
                variant="tertiary"
              >
                Changer de région
              </Button>
              <div style={{ alignItems: "center", display: "flex", gap: "0.5rem" }}>
                <Select
                  aria-label="Année de début"
                  icon="calendar-line"
                  label={yearMin}
                  outline={false}
                  size="sm"
                >
                  {[...years].sort((a, b) => b - a).map((year) => (
                    <Select.Option
                      key={year}
                      onClick={() => handleYearMinChange(String(year))}
                      selected={yearMin === String(year)}
                      value={String(year)}
                    >
                      {year}
                    </Select.Option>
                  ))}
                </Select>
                <Text className="fr-mb-0">à</Text>
                <Select
                  aria-label="Année de fin"
                  icon="calendar-line"
                  label={yearMax}
                  outline={false}
                  size="sm"
                >
                  {[...years].sort((a, b) => b - a).map((year) => (
                    <Select.Option
                      key={year}
                      onClick={() => handleYearMaxChange(String(year))}
                      selected={yearMax === String(year)}
                      value={String(year)}
                    >
                      {year}
                    </Select.Option>
                  ))}
                </Select>
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
        {((Number(yearMax) >= 2024) || (Number(yearMin) >= 2024)) && (
          <Alert
            className="fr-mb-4w fr-mt-4w"
            description="Les sources disponibles ne fournissent que des données provisoires pour 2024 et 2025."
            size="sm"
            variant="warning"
          />
        )}
        {(yearMax < yearMin) ?
          (<Alert description="Merci de choisir une année de fin supérieure ou égale à l'année de début" title="Erreur dans le choix des années" variant="error" />) :
          (
            <>
              {(section === "apercu") && (
                <Cards />
              )}
              {/*
              {(section === "financements") && (
                <>
                  <Row gutters style={{ clear: "both" }}>
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
              */}
              {/*
              {(section === "evolution") && (
                <Row gutters style={{ clear: "both" }}>
                  <Col>
                    <ProjectsOverTimeByStructure name={name} />
                  </Col>
                </Row>
              )}
              */}
              {/*
              {(section === "partenaires") && (
                <>
                  <Row gutters style={{ clear: "both" }}>
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
              */}
              {/*
              {(section === "laboratoires") && (
                <Row gutters style={{ clear: "both" }}>
                  <Col>
                    <LaboratoriesByStructure name={name} />
                  </Col>
                </Row>
              )}
              */}
              {/*
              {(section === "disciplines") && (
                <>
                  <Row gutters style={{ clear: "both" }}>
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
              */}
              {/*
              {(section === "instruments") && (
                <>
                  <Row gutters style={{ clear: "both" }}>
                    <Col>
                      <InstrumentsForAnr name={name} />
                    </Col>
                  </Row>
                  <Row gutters>
                    <Col>
                      <InstrumentsForEurope name={name} />
                    </Col>
                  </Row>
                  <Row gutters>
                    <Col>
                      <InstrumentsOverTimeForAnr name={name} />
                    </Col>
                  </Row>
                  <Row gutters>
                    <Col>
                      <InstrumentsOverTimeForEurope name={name} />
                    </Col>
                  </Row>
                </>
              )}
              */}
              {/*
              {(section === "regions") && (
                <>
                  <Row gutters style={{ clear: "both" }}>
                    <Col>
                      <CountiesByStructure name={name} />
                    </Col>
                  </Row>
                </>
              )}
              */}
              {/*
              {(section === "donnees") && (
                <ProjectsData />
              )}
              */}
            </>
          )}
      </Container>
    </main>
  );
}
