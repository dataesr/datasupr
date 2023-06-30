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
import { useLocation } from "react-router-dom";
import { useState } from "react";
import ProjectSynthesis from "./tabs/projects-synthesis";
import EvolutionFundingSigned from "./tabs/evolution-funding-signed";
import FinancialGoals from "./tabs/financial-goals";
import situationData from "../../../assets/data/situations-cards.json"
import SituationCard from "./tabs/situations-cards";
import TitleComponent from "../../../components/title/index"
import { useQuery } from "@tanstack/react-query";


async function getData(countryCode) {
let url = "/api/european-projects"
if (countryCode) {
  url += `?countryCode=${countryCode}`
}
  return fetch(url).then((response) => {
    if (response.ok) return response.json();
    return "Oops... La requète d'initialiation n'a pas fonctionné";
  });
}


export default function EuropeanProjects() {
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const structureID = query.get("structureID");
  const tab = query.get("tab");
  const countryCode = query.get("countryCode");

  const { data: graphData, isLoading } = useQuery({
    queryKey: ["european-projects", countryCode],
    queryFn: () => getData(countryCode), 
  });

  const situation = situationData;
  const [selectedTab, setSelectedTab] = useState("");

  const renderTab = () => {
    switch (selectedTab) {
      case "evolution-funding-signed":
        return <EvolutionFundingSigned data={graphData["evol_all_pc_funding_SIGNED"]}  />;
        break;
     case "financial-goals":
        return <FinancialGoals data={graphData["funding_programme"]} />;
        break;
 case "situation-cards":
        return <SituationCard data={situation} />;
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
        <BreadcrumbItem href={`/tableaux?structureID=${structureID}`}>
          Vers les tableaux
        </BreadcrumbItem>
      </Breadcrumb>
      <Row className="fr-mb-3w" gutters>
        <Col n="12">
          <TitleComponent as="h1" look="h1" title="Les projets européens" />
        </Col>
      </Row>
      <Row>
            <Col n="3">
              <SideMenu title={`Liste de projets européens de ${structureID}`}>
                <SideMenuLink onClick={() => setSelectedTab("")}>
                  Retour à la synthese de {structureID}
                </SideMenuLink>
                  <SideMenuLink
                  onClick={() => setSelectedTab("financial-goals")}
                >
                  Objectifs financés
                </SideMenuLink>
                   <SideMenuLink
                  onClick={() => setSelectedTab("situation-cards")}
                >
                  Situations
                </SideMenuLink>
                    <SideMenuLink
                  onClick={() => setSelectedTab("evolution-funding-signed")}
                >
                  "Evolution funding signed"
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
