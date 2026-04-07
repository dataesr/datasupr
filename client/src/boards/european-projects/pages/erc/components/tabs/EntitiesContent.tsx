import ErcMainEntities from "../../charts/main-entities";
import ErcDomainPanelEntities from "../../charts/domain-panel-entities";
import ErcGenderByDestination from "../../charts/gender-by-destination";
import ErcGenderEvolution from "../../charts/gender-evolution";
import ErcGenderByDomain from "../../charts/gender-by-domain";

export default function EntitiesContent() {
  return (
    <div>
      <div className="fr-my-5w">
        <ErcMainEntities />
      </div>
      <div className="fr-my-5w">
        <ErcDomainPanelEntities />
      </div>
      <div className="fr-my-5w">
        <ErcGenderByDestination />
      </div>
      <div className="fr-my-5w">
        <ErcGenderEvolution />
      </div>
      <div className="fr-my-5w">
        <ErcGenderByDomain />
      </div>
    </div>
  );
}
