import { Container, Title } from "@dataesr/dsfr-plus";
import EtablissementSelector from "./components/etablissement-selector";
import EtablissementDetails from "./components/etablissement-details";
import "./styles.scss";

export default function StructuresView() {
  return (
    <Container fluid className="fr-px-2w fr-py-2w">
      <Title as="h2" look="h4" className="fr-mb-5">
        Établissement
      </Title>
      <EtablissementSelector />
      <EtablissementDetails />
    </Container>
  );
}
