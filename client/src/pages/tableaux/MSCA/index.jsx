import PropTypes from "prop-types";
import {
  Container,
  Row,
  Col,
  SideMenu,
  SideMenuLink,
  Breadcrumb,
  BreadcrumbItem,
} from "@dataesr/react-dsfr";
import TitleComponent from "../../../components/title";
import { useLocation } from "react-router-dom";
import { useState } from "react";

export default function MSCA() {
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const structureID = query.get("structureID");
  const tab = query.get("tab");

  const [selectedTab, setSelectedTab] = useState("");

  const renderTab = () => {
    switch (selectedTab) {
      default:
        return null;
        break;
    }
  };

  return (
    <Container>
      <Breadcrumb>
        <BreadcrumbItem href="/">Page d'accueil</BreadcrumbItem>
        <BreadcrumbItem href="/search">Rechercher</BreadcrumbItem>
        <BreadcrumbItem href={`/tableaux?structureID=${structureID}`}>
          Vers les tableaux
        </BreadcrumbItem>
      </Breadcrumb>
      <Row className="fr-mb-3w" gutters>
        <Col n="12">
          <TitleComponent as="h1" look="h1" title="Les projets MSCA" />
        </Col>
      </Row>
      <Row>
        {structureID === null ? (
          <>
            <Col n="3">
              <SideMenu title="Liste de projets MSCA">
                <SideMenuLink onClick={() => setSelectedTab("")}>
                  Retour à la synthese des ERC
                </SideMenuLink>
                <SideMenuLink onClick={() => setSelectedTab("")}>
                  coucou MSCA
                </SideMenuLink>
              </SideMenu>
            </Col>
            <Col n="9">{renderTab()}</Col>
          </>
        ) : (
          <>
            <Col n="3">
              <SideMenu title={`Liste de projets MSCA de ${structureID}`}>
                <SideMenuLink onClick={() => setSelectedTab("")}>
                  Retour à la synthese de {structureID}
                </SideMenuLink>
                <SideMenuLink onClick={() => setSelectedTab("")}>
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

MSCA.propTypes = {
  query: PropTypes.object,
};
MSCA.defaultProps = {
  query: {},
};
