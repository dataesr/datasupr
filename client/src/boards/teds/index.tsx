import { Container, Title } from "@dataesr/dsfr-plus";
import { useSearchParams } from "react-router-dom";
import { getLabel } from "./charts/utils";

import "./styles.scss"; // Assuming you have some styles for the welcome page

export default function Welcome() {
  const [searchParams] = useSearchParams();
  const currentLang = searchParams.get("language") || "FR";

  return (
    <>
      <Container as="main">
        <Title as="h1" className="fr-mb-2w">
          {getLabel("index", "title", currentLang)}
        </Title>
      </Container>
    </>
  );
}
