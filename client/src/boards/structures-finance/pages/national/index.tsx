import { Container } from "@dataesr/dsfr-plus";
import SectionHeader from "../../components/layouts/section-header";
import NationalSelector from "./components/national-selector";
import NationalContent from "./components/national-content";

export default function NationalView() {
  return (
    <Container fluid className="fr-px-2w fr-py-2w">
      <SectionHeader title="Vue nationale" />

      <p className="fr-text--lead fr-mb-3w">
        Visualisez et comparez les indicateurs financiers et d'effectifs des
        établissements d'enseignement supérieur au niveau national.
      </p>

      <NationalSelector />
      <NationalContent />
    </Container>
  );
}
