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
    <div>
      <nav className="fr-nav" role="navigation" aria-label="Menu principal">
        <ul className="fr-nav__list">
          <li className="fr-nav__item">
            <button
              className="fr-nav__link"
              onClick={(e) => {
                e.preventDefault();
                handleTabChange("synthesis");
              }}
              aria-current={activeTab === "synthesis" ? "page" : undefined}
            >
              {getIntlLabel("synthesis")}
            </button>
          </li>
          <li className="fr-nav__item">
            <button
              className="fr-nav__link"
              onClick={(e) => {
                e.preventDefault();
                handleTabChange("positioning");
              }}
              aria-current={activeTab === "positioning" ? "page" : undefined}
            >
              {getIntlLabel("positioning")}
            </button>
          </li>
          <li className="fr-nav__item">
            <button
              className="fr-nav__link"
              onClick={(e) => {
                e.preventDefault();
                handleTabChange("collaborations");
              }}
              aria-current={activeTab === "collaborations" ? "page" : undefined}
            >
              {getIntlLabel("collaborations")}
            </button>
          </li>
        </ul>
      </nav>

      <div className="fr-mt-3w">
        {activeTab === "synthesis" && <SmartTabContent {...overviewParams} tabType="synthesis" />}
        {activeTab === "positioning" && <SmartTabContent {...overviewParams} tabType="positioning" />}
        {activeTab === "collaborations" && <SmartTabContent {...overviewParams} tabType="collaborations" />}
      </div>
    </div>
  );
}
