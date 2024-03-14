import { Container, Row, Col } from "@dataesr/dsfr-plus";
import { useSearchParams } from "react-router-dom";
import { useEffect } from "react";
import CustomSideMenu from "./components/side-menu";
import Filters from "./components/filters";

export default function Main() {
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    if (!searchParams.get('structure_code')) {
      setSearchParams({ structure_code: '0752744A' });
    }
  }, [searchParams, setSearchParams]);

  return (
    <main>
      <Container>
        <Row>
          <Col className="fr-ml-1w">
            <Filters />
          </Col>
        </Row>
      </Container>
      <CustomSideMenu />
    </main>
  );
}