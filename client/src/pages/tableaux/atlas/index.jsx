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
import EffectifEtudiantsInscritsParFilliere from "./tabs/effectif-etudiants-inscrits-par-filliere";
import EffectifEtudiantsInsritsParSecteurDEtablissement from "./tabs/effectif-etudiants-insrits-par-secteur-d-etablissement";
import EffectifEtudiantsInscritsParSexe from "./tabs/effectif-etudiants-inscrits-par-sexe";
import Ressources from "./tabs/ressources";
import EnUnClinDOeil from "./tabs/en-un-clin-d-oeil";
import TitleComponent from "../../../components/title/index"
// import { useQuery } from "@tanstack/react-query";
import getCountryName from '../../../utils/getCountryName';


export default function Atlas() {
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const structureID = query.get("structureId");
  const countryCode = query.get("countryCode");
  const tab = query.get("tab");
  const [graphData, setGraphData] = useState([]);
  const [selectedTab, setSelectedTab] = useState(tab || "en-un-clin-d-oeil");

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
      case "effectif-etudiants-inscrits-par-filliere":
        return <EffectifEtudiantsInscritsParFilliere data={graphData} />
      case "effectif-etudiants-insrits-par-secteur-d-etablissement":
        return <EffectifEtudiantsInsritsParSecteurDEtablissement data={graphData} />
      case "effectif-etudiants-inscrits-par-sexe":
        return <EffectifEtudiantsInscritsParSexe data={graphData} />
      case "ressources":
        return <Ressources data={graphData} />

      default:
        return <EnUnClinDOeil data={graphData} />;
    }
  };

  const resetFilters = () => {
    const query = new URLSearchParams(location.search);
    query.delete("countryCode");
    query.delete("tab");
    // query.delete("structureId");
    window.location.href = `/tableaux/atlas?tab=${selectedTab}`;
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
          <TitleComponent as="h1" look="h1" title="Atlas des étudiants" />
        </Col>
      </Row>
      {countryCode && (
        <Row>
          <Col n="12">
            <Tag
              closable
              onClick={() => resetFilters()}
            >
              {getCountryName(countryCode)}
            </Tag>
          </Col>
        </Row>
      )}
      <Row>
        <Col n="3">
          <SideMenu buttonLabel="Navigation">
            <SideMenuLink onClick={() => setSelectedTab("en-un-clin-d-oeil")} current={selectedTab === 'en-un-clin-d-oeil'}>
              <Icon name="ri-eye-2-line" size="1x" />
              En un clin d'oeil
            </SideMenuLink>
            <SideMenuLink onClick={() => setSelectedTab("effectif-etudiants-inscrits-par-filliere")} current={selectedTab === 'effectif-etudiants-inscrits-par-filliere'}>
              <Icon name="ri-map-pin-user-line" size="1x" />
              Effectif d'étudiants inscrits par fillière
            </SideMenuLink>
            <SideMenuLink onClick={() => setSelectedTab("effectif-etudiants-insrits-par-secteur-d-etablissement")} current={selectedTab === 'effectif-etudiants-insrits-par-secteur-d-etablissement'}>
              <Icon name="ri-service-line" size="1x" />
              Effectif d'étudiants inscrits par secteur d'établissement
            </SideMenuLink>
            <SideMenuLink onClick={() => setSelectedTab("effectif-etudiants-inscrits-par-sexe")} current={selectedTab === 'effectif-etudiants-inscrits-par-sexe'}>
              <Icon name="ri-line-chart-line" size="1x" />
              Effectif d'étudiants inscrits par sexe
            </SideMenuLink>
            <SideMenuLink onClick={() => setSelectedTab("ressources")} current={selectedTab === 'ressources'}>
              <Icon name="ri-article-line" size="1x" />
              Ressources
            </SideMenuLink>
          </SideMenu>
        </Col>
        <Col n="9">{renderTab()}</Col>
      </Row>
    </Container>
  );
}

Atlas.propTypes = {
  query: PropTypes.object,
};
Atlas.defaultProps = {
  query: {},
};
