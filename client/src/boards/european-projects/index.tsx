// import { Outlet, useLocation } from "react-router-dom";
import { Container, Nav, Link, Button } from "@dataesr/dsfr-plus";
import Home from "./pages/home";
// import CustomBreadcrumb from "./components/custom-breadcrumb";
// import CustomSideMenu from "./components/side-menu";
// import Filters from "./components/filters";

function MainMenu() {
  return (
    <div style={{ backgroundColor: "#f5f5f5" }}>
      <Container>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <Nav
            aria-label="Main navigation"
            style={{ backgroundColor: "#f5f5f5" }}
          >
            <Link current href="#">
              <span
                className="fr-icon-home-4-line fr-mr-1w"
                aria-hidden="true"
              />
              Accueil
            </Link>
            <Link href="#">Global</Link>
            <Link href="#">MSCA</Link>
            <Link href="#">ERC</Link>
          </Nav>
          <Button icon="global-line" size="sm" variant="tertiary">
            Pays sélectionné : France
          </Button>
        </div>
      </Container>
    </div>
  );
}

export default function Main() {
  // const { pathname } = useLocation();

  return (
    <main>
      <MainMenu />
      <Home />
      {/* <Container>
        <Row>
          <Col className="fr-ml-1w">
            <CustomBreadcrumb pageKey={pathname.split("/").slice(-1)[0]} />
            <Filters />
          </Col>
        </Row>
        <Row>
          <Col xs={12} md={4} className="fr-pl-2w">
            <CustomSideMenu />
          </Col>
          <Col xs={12} md={8} className="fr-pt-6w">
            <Outlet />
          </Col>
        </Row>
      </Container> */}
    </main>
  );
}
