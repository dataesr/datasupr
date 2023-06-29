import PropTypes from "prop-types";
import {
  Col,
  Container,
  Row,
  Breadcrumb,
  BreadcrumbItem,
  SideMenu,
  SideMenuLink,
} from "@dataesr/react-dsfr";
import { useLocation } from "react-router-dom";
import { useState } from "react";

import Dispersion from "../financial/tabs/tab2";
import financialData from "../../../assets/data/all_treso.json";
import FinanceGraph from "../financial/tabs/tab1";

export default function Financial() {
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const structureID = query.get("structureID");
  const tab = query.get("tab");
  const data = financialData;
  console.log(data);

  const [selectedTab, setSelectedTab] = useState("");

  const renderTab = () => {
    switch (selectedTab) {
      case "tableau-de-bord-financier":
        return <FinanceGraph data={data} />;
        break;

      case "dispersion":
        return <Dispersion data={data} />;
        break;

      default:
        return (
          <div>
            Ici on fait un composant qui synthésise les données financières
          </div>
        );
        break;
    }
  };

  return (
    <Container className="fr-mb-3w">
      <Breadcrumb>
        <BreadcrumbItem href="/">Page d'accueil</BreadcrumbItem>
        <BreadcrumbItem href="/search">Rechercher</BreadcrumbItem>
        <BreadcrumbItem href={`/tableaux?structureId=${structureID}`}>
          Vers les tableaux
        </BreadcrumbItem>
      </Breadcrumb>
      <Row>
        {!structureID ? (
          <>
            <Col n="3">
              <SideMenu title="Tableau de bord financier">
                <SideMenuLink onClick={() => setSelectedTab("")}>
                  Retour à la synthese des finances
                </SideMenuLink>
                <SideMenuLink
                  onClick={() => setSelectedTab("tableau-de-bord-financier")}
                >
                  Evolution de la trésorerie synthèse des structures/pays
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
                  onClick={() => setSelectedTab("tableau-de-bord-financier")}
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

Financial.propTypes = {
  query: PropTypes.object,
};
Financial.defaultProps = {
  query: {},
};
