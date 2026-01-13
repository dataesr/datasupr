import { Summary, SummaryItem, SummaryWrapper } from "../../../../components/summary";

import "./styles.scss";

export default function CustomSideMenu() {
  return (
    <SummaryWrapper className="sticky-summary">
      <Summary title="Sommaire" className="sticky-summary">
        <SummaryItem href="#id1" label="Gestion des URLs" />
        <SummaryItem href="#id2" label="Liste des ids" />
        <SummaryItem href="#id3" label="Ajout d'un graphique" />
        <SummaryItem href="#id4" label="Liste des composants" />
        <SummaryItem href="#id5" label="Serveur" />
        <SummaryItem href="#id6" label="Gestion des CSS" />
      </Summary>
    </SummaryWrapper>
  );
}
