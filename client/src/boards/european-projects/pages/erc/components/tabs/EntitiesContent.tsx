import ErcMainEntities from "../../charts/main-entities";
import ErcDomainPanelEntities from "../../charts/domain-panel-entities";

export default function EntitiesContent() {
  return (
    <div>
      <div className="fr-my-4w">
        <ErcMainEntities />
      </div>
      <div className="fr-my-4w">
        <ErcDomainPanelEntities />
      </div>
    </div>
  );
}
