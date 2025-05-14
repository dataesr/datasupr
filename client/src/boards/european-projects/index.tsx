import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
  Container,
  Nav,
  Link,
  Button,
  Modal,
  ModalTitle,
  ModalContent,
  ModalFooter,
  ButtonGroup,
} from "@dataesr/dsfr-plus";
import Home from "./pages/home";
import "./styles.css";

function MainMenu({ selectedCountry }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="ep-main-menu">
      <Container>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <Nav aria-label="Main navigation" style={{ backgroundColor: "#f5f5f5" }}>
            <Link current href="#">
              <span className="fr-icon-home-4-line fr-mr-1w" aria-hidden="true" />
              Accueil
            </Link>
            <Link href="#">Global</Link>
            <Link href="#">MSCA</Link>
            <Link href="#">ERC</Link>
          </Nav>
          <Button
            onClick={(e) => {
              setIsOpen(true);
              e.preventDefault();
            }}
            icon="global-line"
            size="sm"
            variant="tertiary"
          >
            Pays sélectionné : {selectedCountry}
          </Button>
          <Modal isOpen={isOpen} hide={() => setIsOpen(false)}>
            <ModalTitle>Opened Controlled</ModalTitle>
            <ModalContent>Hello Modal</ModalContent>
            <ModalFooter>
              <ButtonGroup isInlineFrom="xs" align="right">
                <Button>Hello</Button>
                <Button variant="secondary">Bye Bye</Button>
              </ButtonGroup>
            </ModalFooter>
          </Modal>
        </div>
      </Container>
    </div>
  );
}

export default function Main() {
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedCountry = searchParams.get("country_code") || "FRA";

  useEffect(() => {
    if (!searchParams.get("country_code")) {
      searchParams.set("country_code", "FRA"); // default value
      setSearchParams(searchParams);
    }
  }, []);

  return (
    <main>
      <MainMenu selectedCountry={selectedCountry} />
      <Home />
    </main>
  );
}
