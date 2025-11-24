import { useEffect, useMemo, useState } from "react";
import {
  Badge,
  Button,
  Modal,
  ModalContent,
  ModalFooter,
  ModalTitle,
} from "@dataesr/dsfr-plus";
import { NavigationItem, useNavigation } from "../../api/use-navigation";
import { ContextExplorerModalProps } from "../../../../types/faculty-members";
import "./styles.scss";

type ContextType = "discipline" | "region" | "academie" | "structure";

function ContextFilter({
  data,
  onSelect,
  selectedItem,
  type,
}: {
  data: NavigationItem[];
  onSelect: (item: NavigationItem | null) => void;
  selectedItem: NavigationItem | null;
  type: "discipline" | "region" | "academie" | "structure";
}) {
  return (
    <div className="context-filter-list">
      {data.map((item, index) => {
        const isSelected = selectedItem?.id === item.id;
        return (
          <div
            key={`${type}-${item.id}-${index}`}
            onClick={() => onSelect(item)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onSelect(item);
              }
            }}
            role="button"
            tabIndex={0}
            aria-pressed={isSelected}
            className={`context-filter-item context-filter-item--${type} fr-mt-3w  ${
              isSelected ? "selected" : ""
            }`}
          >
            <div className="context-filter-item__row">
              <span className="context-filter-item__name fr-ml-2w">
                {item.name}
              </span>
              {type === "structure" && item.is_active === false && (
                <Badge
                  color="error"
                  size="sm"
                  className="context-filter-item__badge"
                >
                  Inactive
                </Badge>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export function ContextExplorerModal({
  isOpen,
  year,
  onClose,
  onExplore,
}: ContextExplorerModalProps) {
  const [selectedContextItem, setSelectedContextItem] =
    useState<NavigationItem | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState<ContextType>("discipline");

  const { data: disciplines, isLoading: loadingDisciplines } = useNavigation({
    type: "fields",
    annee_universitaire: year,
    enabled: isOpen,
  });
  const { data: regions, isLoading: loadingRegions } = useNavigation({
    type: "regions",
    annee_universitaire: year,
    enabled: isOpen,
  });
  const { data: academies, isLoading: loadingAcademies } = useNavigation({
    type: "academies",
    annee_universitaire: year,
    enabled: isOpen,
  });
  const { data: structures, isLoading: loadingStructures } = useNavigation({
    type: "structures",
    annee_universitaire: "",
    enabled: isOpen,
  });

  const filteredDisciplines = useMemo(
    () =>
      disciplines?.items?.filter((item) =>
        item?.name?.toLowerCase().includes(searchTerm.toLowerCase())
      ) || [],
    [disciplines?.items, searchTerm]
  );
  const filteredRegions = useMemo(
    () =>
      regions?.items?.filter((item) =>
        item?.name?.toLowerCase().includes(searchTerm.toLowerCase())
      ) || [],
    [regions?.items, searchTerm]
  );
  const filteredAcademies = useMemo(
    () =>
      academies?.items?.filter((item) =>
        item?.name?.toLowerCase().includes(searchTerm.toLowerCase())
      ) || [],
    [academies?.items, searchTerm]
  );
  const filteredStructures = useMemo(
    () =>
      structures?.items?.filter((item) =>
        item?.name?.toLowerCase().includes(searchTerm.toLowerCase())
      ) || [],
    [structures?.items, searchTerm]
  );

  useEffect(() => {
    if (isOpen) {
      setSelectedContextItem(null);
      setSearchTerm("");
      setActiveTab("discipline");
    }
  }, [isOpen]);

  const tabs = [
    {
      id: "discipline" as ContextType,
      label: "Disciplines",
      icon: "📚",
      count: filteredDisciplines.length,
      loading: loadingDisciplines,
      data: filteredDisciplines,
    },
    {
      id: "region" as ContextType,
      label: "Régions",
      icon: "🗺️",
      count: filteredRegions.length,
      loading: loadingRegions,
      data: filteredRegions,
    },
    {
      id: "academie" as ContextType,
      label: "Académies",
      icon: "🏛️",
      count: filteredAcademies.length,
      loading: loadingAcademies,
      data: filteredAcademies,
    },
    {
      id: "structure" as ContextType,
      label: "Établissements",
      icon: "🏫",
      count: filteredStructures.length,
      loading: loadingStructures,
      data: filteredStructures,
    },
  ];

  const currentTab = tabs.find((tab) => tab.id === activeTab);

  return (
    <Modal isOpen={isOpen} hide={onClose} size="lg">
      <ModalTitle>Explorer</ModalTitle>
      <ModalContent>
        <input
          type="search"
          placeholder="Rechercher..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="fr-input context-explorer__search fr-mb-3w"
        />

        <div className="context-explorer-nav">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`context-nav-button context-nav-button--${tab.id} ${
                activeTab === tab.id ? "active" : ""
              }`}
              type="button"
            >
              <span className="context-nav-button__icon">{tab.icon}</span>
              <span className="context-nav-button__label">
                {tab.label}{" "}
                <span className="context-nav-button__count">
                  {tab.loading ? "…" : tab.count}
                </span>
              </span>
            </button>
          ))}
        </div>

        <div className="context-explorer-content">
          {currentTab?.loading ? (
            <div className="context-filter-skeleton">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="skeleton-item" />
              ))}
            </div>
          ) : (
            <ContextFilter
              type={activeTab}
              data={currentTab?.data || []}
              onSelect={(item) =>
                item && setSelectedContextItem({ ...item, type: activeTab })
              }
              selectedItem={selectedContextItem}
            />
          )}
        </div>
      </ModalContent>
      <ModalFooter>
        <Button size="sm" variant="secondary" onClick={onClose}>
          Annuler
        </Button>
        <Button
          size="sm"
          onClick={() => selectedContextItem && onExplore(selectedContextItem)}
          disabled={!selectedContextItem}
        >
          Explorer
        </Button>
      </ModalFooter>
    </Modal>
  );
}

export default ContextExplorerModal;
