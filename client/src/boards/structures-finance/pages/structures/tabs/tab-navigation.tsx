import { TabButton } from "../../../components/tab-button";

interface TabNavigationProps {
  activeTab: string;
  onTabChange: (
    tab:
      | "financements"
      | "moyens-humains"
      | "etudiants"
      | "analyses"
      | "recettes-propres"
  ) => void;
}

export default function TabNavigation({
  activeTab,
  onTabChange,
}: TabNavigationProps) {
  return (
    <div className="fr-mb-3w">
      <div className="fr-tabs">
        <ul className="fr-tabs__list" role="tablist">
          <TabButton
            id="tab-financements"
            label="Financements"
            isActive={activeTab === "financements"}
            tabPanelId="tabpanel-financements"
            onClick={() => onTabChange("financements")}
          />
          <TabButton
            id="tab-moyens-humains"
            label="Moyens humains"
            isActive={activeTab === "moyens-humains"}
            tabPanelId="tabpanel-moyens-humains"
            onClick={() => onTabChange("moyens-humains")}
          />
          <TabButton
            id="tab-recettes-propres"
            label="Ressources propres"
            isActive={activeTab === "recettes-propres"}
            tabPanelId="tabpanel-recettes-propres"
            onClick={() => onTabChange("recettes-propres")}
          />
          <TabButton
            id="tab-etudiants"
            label="Étudiants inscrits"
            isActive={activeTab === "etudiants"}
            tabPanelId="tabpanel-etudiants"
            onClick={() => onTabChange("etudiants")}
          />
          <TabButton
            id="tab-analyses"
            label="Analyses et évolutions"
            isActive={activeTab === "analyses"}
            tabPanelId="tabpanel-analyses"
            onClick={() => onTabChange("analyses")}
          />
        </ul>
      </div>
    </div>
  );
}
