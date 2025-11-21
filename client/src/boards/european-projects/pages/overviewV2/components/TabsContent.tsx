import SmartTabContent from "./SmartTabContent";
import { ViewConditions } from "../utils/displayRules";
import { useSearchParams } from "react-router-dom";

import i18n from "../../../i18n-global.json";

interface TabsContentProps {
  overviewParams: ViewConditions;
}

export default function TabsContent({ overviewParams }: TabsContentProps) {
  const { activeTab, view } = overviewParams;
  const [searchParams, setSearchParams] = useSearchParams();
  const currentLang = searchParams.get("language") || "en";

  function getIntlLabel(key: string): string {
    return i18n[key][currentLang as "fr" | "en"] || i18n[key]["en"];
  }

  // Fonction pour changer d'onglet
  const handleTabChange = (newTab: "synthesis" | "positioning" | "collaborations") => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set("view", `${newTab}|${view}`);
    setSearchParams(newParams);
  };

  return (
    <div className="fr-tabs">
      <ul className="fr-tabs__list" role="tablist" aria-label="Sélection des onglets">
        <li role="presentation">
          <button
            type="button"
            id="tab-1"
            className="fr-tabs__tab"
            tabIndex={activeTab === "synthesis" ? 0 : -1}
            role="tab"
            aria-selected={activeTab === "synthesis"}
            aria-controls="tab-1-panel"
            onClick={() => handleTabChange("synthesis")}
          >
            {getIntlLabel("synthesis")}
          </button>
        </li>
        <li role="presentation">
          <button
            type="button"
            id="tab-2"
            className="fr-tabs__tab"
            tabIndex={activeTab === "positioning" ? 0 : -1}
            role="tab"
            aria-selected={activeTab === "positioning"}
            aria-controls="tab-2-panel"
            onClick={() => handleTabChange("positioning")}
          >
            {getIntlLabel("positioning")}
          </button>
        </li>
        <li role="presentation">
          <button
            type="button"
            id="tab-3"
            className="fr-tabs__tab"
            tabIndex={activeTab === "collaborations" ? 0 : -1}
            role="tab"
            aria-selected={activeTab === "collaborations"}
            aria-controls="tab-3-panel"
            onClick={() => handleTabChange("collaborations")}
          >
            {getIntlLabel("collaborations")}
          </button>
        </li>
      </ul>

      <div
        id="tab-1-panel"
        className={`fr-tabs__panel ${activeTab === "synthesis" ? "fr-tabs__panel--selected" : ""}`}
        role="tabpanel"
        aria-labelledby="tab-1"
        tabIndex={0}
      >
        <SmartTabContent {...overviewParams} tabType="synthesis" />
      </div>

      <div
        id="tab-2-panel"
        className={`fr-tabs__panel ${activeTab === "positioning" ? "fr-tabs__panel--selected" : ""}`}
        role="tabpanel"
        aria-labelledby="tab-2"
        tabIndex={0}
      >
        <SmartTabContent {...overviewParams} tabType="positioning" />
      </div>

      <div
        id="tab-3-panel"
        className={`fr-tabs__panel ${activeTab === "collaborations" ? "fr-tabs__panel--selected" : ""}`}
        role="tabpanel"
        aria-labelledby="tab-3"
        tabIndex={0}
      >
        <SmartTabContent {...overviewParams} tabType="collaborations" />
      </div>
    </div>
  );
}
