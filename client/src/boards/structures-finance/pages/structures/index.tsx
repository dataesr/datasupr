import { Container } from "@dataesr/dsfr-plus";
import EtablissementDetails from "./components/etablissement-details";
import EtablissementSelector from "./components/etablissement-selector";

export default function StructuresView() {
  return (
    <>
      <EtablissementSelector />
      <Container>
        <EtablissementDetails />
      </Container>
    </>
  );
}
