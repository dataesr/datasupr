import { Container } from "@dataesr/dsfr-plus";
import SectionHeader from "../../components/layouts/section-header";
import EtablissementSelector from "./components/etablissement-selector";
import EtablissementDetails from "./components/etablissement-details";
import "./styles.scss";

export default function StructuresView() {
  return (
    <Container fluid className="fr-px-2w fr-py-2w">
      <SectionHeader title="Établissement" />
      <EtablissementSelector />
      <EtablissementDetails />
    </Container>
  );
}
