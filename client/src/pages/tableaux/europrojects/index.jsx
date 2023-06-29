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
import { useState } from "react";

export default function EuropeanProjects() {
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const structureID = query.get("structureID");
  const tab = query.get("tab");

  const [selectedTab, setSelectedTab] = useState("");

  console.log(structureID);

  const renderTab = () => {
    switch (selectedTab) {
      case "evolution-funding-signed":
        return <EvolutionFundingSigned />;
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
      </Breadcrumb>
      <Row className="fr-mb-3w">
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
                  retour à la synthese
                </SideMenuLink>
                <SideMenuLink
                  onClick={() => setSelectedTab("evolution-funding-signed")}
                >
                  Evolution des financements signés
                </SideMenuLink>
              </SideMenu>
            </Col>
            <Col n="9">{renderTab()}</Col>
          </>
        ) : (
          <Col n="9">
            <RandomIdProject />
          </Col>
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
