import { Link, useLocation } from "react-router-dom";
import {
  Title,
  Row,
  Container,
  Breadcrumb,
  BreadcrumbItem,
  Col,
} from "@dataesr/react-dsfr";

export default function Tableaux() {
  const location = useLocation();
  const { search } = location;
  const structureID = new URLSearchParams(search).get("structureID");
  const countryId = new URLSearchParams(search).get("countryId");

  const tableauxItems = [
    { path: "/tableaux/european-projects", label: "Projet Européen" },
    { path: "/tableaux/erc", label: "ERC" },
    { path: "/tableaux/msca", label: "MSCA" },
    {
      path: "/tableaux/tableau-de-bord-financier",
      label: "Tableaux de bord financier",
    },
  ];

  return (
    <Container>
      <Row className="fr-mt-3w">
        <Title as="h3" look="h5" spacing="mb-0">
          Liste des Tableaux
        </Title>
      </Row>
      <Breadcrumb>
        <BreadcrumbItem href="/">Page d'accueil</BreadcrumbItem>
      </Breadcrumb>
      {tableauxItems.map(({ path, label }) => (
        <Row key={path} className="fr-mt-3w">
          <Col>
            {console.log(path)}
            <div className="fr-card fr-card--xs fr-card--grey fr-card--no-border">
              <div className={`fr-card__body`}>
                <div className="fr-card__content">
                  <p className={`fr-card__title`}>
                    <Link to={`${path}?structureID=${structureID}`}>
                      {label}
                    </Link>
                  </p>
                </div>
              </div>
            </div>
          </Col>
        </Row>
      ))}
    </Container>
  );
}
