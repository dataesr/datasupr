import PropTypes from "prop-types";
import {
  Breadcrumb, BreadcrumbItem,
  Container, Row, Col,
  Icon,
  SideMenu, SideMenuLink,
  Tag,
} from "@dataesr/react-dsfr";
import { useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import Evolutions from "./tabs/evolutions";
import ProjectSynthesis from "./tabs/projects-synthesis";
import TitleComponent from "../../../components/title/index"
// import { useQuery } from "@tanstack/react-query";

export default function EuropeanProjects() {
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const structureID = query.get("structureId");
  const countryCode = query.get("countryCode");
  const tab = query.get("tab");
  const [graphData, setGraphData] = useState([]);
  const [selectedTab, setSelectedTab] = useState(tab || "synthese");

  useEffect(() => {
    async function getData() {
      let url = "/api/european-projects"
      if (countryCode) {
        url += `?countryCode=${countryCode}`
      }
      const response = await fetch(url);
      const data = await response.json();
      setGraphData(data);
    }

    getData(countryCode);
  }, [])

  useEffect(() => {
    const query = new URLSearchParams(location.search);
    query.set("tab", selectedTab);
    window.history.replaceState({}, "", `${location.pathname}?${query.toString()}`);
  }, [selectedTab]);

  const renderTab = () => {

    switch (selectedTab) {
      case "evolutions":
        return <Evolutions data={graphData} />

      default:
        return <ProjectSynthesis data={graphData} />;
    }
  };

  const resetFilters = () => {
    const query = new URLSearchParams(location.search);
    query.delete("countryCode");
    query.delete("tab");
    // query.delete("structureId");
    window.location.href = `/tableaux/european-projects?tab=${selectedTab}`;
  };


  return (
    <Container as="section">
      <Breadcrumb className="fr-mb-0">
        <BreadcrumbItem href="/">Page d'accueil</BreadcrumbItem>
        <BreadcrumbItem href="/search">Rechercher</BreadcrumbItem>
        <BreadcrumbItem href={`/tableaux?structureID=${structureID}?countryCode=${countryCode}`}>
          Vers les tableaux
        </BreadcrumbItem>
      </Breadcrumb>
      <Row>
        <Col n="12">
          <TitleComponent as="h1" look="h1" title="Les projets européens" />
        </Col>
      </Row>
      {countryCode && (
        <Row>
          <Col n="12">
            filre :
            <Tag
              closable
              onClick={() => resetFilters()}
            >{countryCode}</Tag>
          </Col>
        </Row>
      )}
      <Row>
        <Col n="3">
          <SideMenu buttonLabel="Navigation">
            <SideMenuLink onClick={() => setSelectedTab("synthese")} current={selectedTab === 'synthese'}>
              <Icon name="ri-eye-2-line" size="1x" />
              Synthèse France
            </SideMenuLink>
            <SideMenuLink onClick={() => setSelectedTab("positionnements")} current={selectedTab === 'positionnements'}>
              <Icon name="ri-map-pin-user-line" size="1x" />
              Positionnements
            </SideMenuLink>
            <SideMenuLink onClick={() => setSelectedTab("collaborations")} current={selectedTab === 'collaborations'}>
              <Icon name="ri-service-line" size="1x" />
              Collaborations
            </SideMenuLink>
            <SideMenuLink onClick={() => setSelectedTab("evolutions")} current={selectedTab === 'evolutions'}>
              <Icon name="ri-line-chart-line" size="1x" />
              Evolutions
            </SideMenuLink>
            <SideMenuLink onClick={() => setSelectedTab("appels-a-projets")} current={selectedTab === 'appels-a-projets'}>
              <Icon name="ri-article-line" size="1x" />
              Appels à projets
            </SideMenuLink>
            <SideMenuLink onClick={() => setSelectedTab("beneficiaires")} current={selectedTab === 'beneficiaires'}>
              <Icon name="ri-user-6-line" size="1x" />
              Bénéficiaires
            </SideMenuLink>
            <SideMenuLink onClick={() => setSelectedTab("erc")} current={selectedTab === 'erc'}>
              <Icon name="ri-git-commit-line" size="1x" />
              ERC
            </SideMenuLink>
            <SideMenuLink onClick={() => setSelectedTab("msca")} current={selectedTab === 'msca'}>
              <Icon name="ri-git-commit-line" size="1x" />
              MSCA
            </SideMenuLink>
          </SideMenu>
        </Col>
        <Col n="9">{renderTab()}</Col>
      </Row>
    </Container>
  );
}

EuropeanProjects.propTypes = {
  query: PropTypes.object,
};
EuropeanProjects.defaultProps = {
  query: {},
};
