import PropTypes from "prop-types";
import {
  Container,
  Row,
  Col,
  SideMenu,
  SideMenuLink,
  Breadcrumb,
  BreadcrumbItem,
  SideMenuItem,
} from "@dataesr/react-dsfr";
import TitleComponent from "../../../components/title";
import RandomIdProject from "./tabs/randomIdProject";
import ProjectSynthesis from "./tabs/projects-synthesis";
import { useLocation } from "react-router-dom";
import EvolutionFundingSigned from "./tabs/evolution-funding-signed";
import graphData from "../../../assets/data/evol_all_pc_funding_SIGNED (1).json";

import { useState } from "react";

export default function EuropeanProjects() {
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const structureID = query.get("structureID");
  const tab = query.get("tab");
  const data = graphData;
  const title = data[0].label;

  const [selectedTab, setSelectedTab] = useState("");

  const renderTab = () => {
    switch (selectedTab) {
      case "evolution-funding-signed":
        return <EvolutionFundingSigned data={data} title={title} />;
        break;

      case "projectIdevolution":
        return <RandomIdProject />;
        break;

      default:
        return <ProjectSynthesis />;
        break;
    }
  };

  return (
    <Container>
      <Breadcrumb>
        <BreadcrumbItem href="/">Page d'accueil</BreadcrumbItem>
        <BreadcrumbItem href="/search">Rechercher</BreadcrumbItem>
        <BreadcrumbItem href={`/tableaux?structureId=${structureID}`}>
          Vers les tableaux
        </BreadcrumbItem>
      </Breadcrumb>
      <Row className="fr-mb-3w" gutters>
        <Col n="12">
          <TitleComponent as="h1" look="h1" title="Les projets européens" />
        </Col>
      </Row>
      <Row>
        {!structureID ? (
          <>
            <Col n="3">
              <SideMenu title="Liste de projets européens">
                <SideMenuLink onClick={() => setSelectedTab("")}>
                  Retour à la synthese des projets européens
                </SideMenuLink>
                <SideMenuLink
                  onClick={() => setSelectedTab("evolution-funding-signed")}
                >
                  {title}
                </SideMenuLink>
              </SideMenu>
            </Col>
            <Col n="9">{renderTab()}</Col>
          </>
        ) : (
          <>
            <Col n="3">
              <SideMenu title={`Liste de projets européens de ${structureID}`}>
                <SideMenuLink onClick={() => setSelectedTab("")}>
                  Retour à la synthese de {structureID}
                </SideMenuLink>
                <SideMenuLink
                  onClick={() => setSelectedTab("projectIdevolution")}
                >
                  Nom du tableau de {structureID} qu'on veut afficher
                </SideMenuLink>
              </SideMenu>
            </Col>
            <Col n="9">{renderTab()}</Col>
          </>
        )}
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
