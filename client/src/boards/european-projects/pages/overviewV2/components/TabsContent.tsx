import SmartTabContent from "./SmartTabContent";
import { ViewConditions } from "../utils/displayRules";

interface TabsContentProps {
  overviewParams: ViewConditions;
}

export default function TabsContent({ overviewParams }: TabsContentProps) {
  return (
    <div className="fr-tabs">
      <ul className="fr-tabs__list" role="tablist" aria-label="[A modifier | nom du système d'onglet]">
        <li role="presentation">
          <button type="button" id="tab-1" className="fr-tabs__tab" tabIndex={0} role="tab" aria-selected="true" aria-controls="tab-1-panel">
            Synthèse
          </button>
        </li>
        <li role="presentation">
          <button type="button" id="tab-2" className="fr-tabs__tab" tabIndex={-1} role="tab" aria-selected="false" aria-controls="tab-2-panel">
            Positionnement
          </button>
        </li>
        <li role="presentation">
          <button type="button" id="tab-3" className="fr-tabs__tab" tabIndex={-1} role="tab" aria-selected="false" aria-controls="tab-3-panel">
            Collaborations
          </button>
        </li>
      </ul>

      <div id="tab-1-panel" className="fr-tabs__panel fr-tabs__panel--selected" role="tabpanel" aria-labelledby="tab-1" tabIndex={0}>
        <SmartTabContent {...overviewParams} tabType="synthese" />
      </div>

      <div id="tab-2-panel" className="fr-tabs__panel" role="tabpanel" aria-labelledby="tab-2" tabIndex={0}>
        <SmartTabContent {...overviewParams} tabType="positionnement" />
      </div>

      <div id="tab-3-panel" className="fr-tabs__panel" role="tabpanel" aria-labelledby="tab-3" tabIndex={0}>
        <SmartTabContent {...overviewParams} tabType="collaborations" />
      </div>
    </div>
  );
}
