import { TabButton } from "../../../components/tab-button";

interface TabNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export default function TabNavigation({
  activeTab,
  onTabChange,
}: TabNavigationProps) {
  return (
    <div className="fr-mb-3w">
      <div className="fr-tabs">
        <ul
          className="fr-tabs__list"
          role="tablist"
          aria-label="Analyses disponibles"
        >
          <TabButton
            id="tab-produits-vs-etudiants"
            label="Produits vs Effectifs d'étudiants"
            isActive={activeTab === "produits-vs-etudiants"}
            tabPanelId="tabpanel-produits-vs-etudiants"
            onClick={() => onTabChange("produits-vs-etudiants")}
          />
          <TabButton
            id="tab-scsp-vs-encadrement"
            label="SCSP vs Encadrement"
            isActive={activeTab === "scsp-vs-encadrement"}
            tabPanelId="tabpanel-scsp-vs-encadrement"
            onClick={() => onTabChange("scsp-vs-encadrement")}
          />
          <TabButton
            id="tab-scsp-vs-ressources-propres"
            label="SCSP vs Ressources propres"
            isActive={activeTab === "scsp-vs-ressources-propres"}
            tabPanelId="tabpanel-scsp-vs-ressources-propres"
            onClick={() => onTabChange("scsp-vs-ressources-propres")}
          />
          <TabButton
            id="tab-comparison"
            label="Comparaison de métriques"
            isActive={activeTab === "comparison"}
            tabPanelId="tabpanel-comparison"
            onClick={() => onTabChange("comparison")}
          />
        </ul>
      </div>
    </div>
  );
}
