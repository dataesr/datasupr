import { useEffect, useMemo, useState } from "react";
import {
  Badge,
  Button,
  Modal,
  ModalContent,
  ModalFooter,
  ModalTitle,
  Tab,
  Tabs,
} from "@dataesr/dsfr-plus";
import { NavigationItem, useNavigation } from "../../api/use-navigation";
import { ContextExplorerModalProps } from "../../../../types/faculty-members";
import "./styles.scss";

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
    <div className={`context-filter-list context-filter-list--${type}`}>
      {data.map((item, index) => {
        const isSelected = selectedItem?.id === item.id;
        return (
          <div
            key={`${type}-${item.id}-${index}`}
            onClick={() => onSelect(item)}
            className={`context-filter-item context-filter-item--${type} ${
              isSelected ? "selected" : ""
            }`}
          >
            <div className="context-filter-item__row">
              <span>{item.name}</span>
              {type === "structure" && item.is_active === false && (
                <Badge color="error" size="sm">
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
    }
  }, [isOpen]);

  return (
    <Modal isOpen={isOpen} hide={onClose} size="lg">
      <ModalTitle>Explorer</ModalTitle>
      <ModalContent>
        <input
          type="search"
          placeholder="Rechercher..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="fr-input context-explorer__search"
        />
        <div className="context-explorer-tabs">
          <Tabs>
            <Tab
              icon="edit-box-fill"
              label={`Disciplines (${
                loadingDisciplines ? "…" : filteredDisciplines.length
              })`}
            >
              {loadingDisciplines ? (
                <div className="context-filter-skeleton">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="skeleton-item" />
                  ))}
                </div>
              ) : (
                <ContextFilter
                  type="discipline"
                  data={filteredDisciplines}
                  onSelect={(item) =>
                    item &&
                    setSelectedContextItem({ ...item, type: "discipline" })
                  }
                  selectedItem={selectedContextItem}
                />
              )}
            </Tab>
            <Tab
              label={`Régions (${
                loadingRegions ? "…" : filteredRegions.length
              })`}
              icon="earth-fill"
            >
              {loadingRegions ? (
                <div className="context-filter-skeleton">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="skeleton-item" />
                  ))}
                </div>
              ) : (
                <ContextFilter
                  type="region"
                  data={filteredRegions}
                  onSelect={(item) =>
                    item && setSelectedContextItem({ ...item, type: "region" })
                  }
                  selectedItem={selectedContextItem}
                />
              )}
            </Tab>
            <Tab
              label={`Académies (${
                loadingAcademies ? "…" : filteredAcademies.length
              })`}
              icon="earth-fill"
            >
              {loadingAcademies ? (
                <div className="context-filter-skeleton">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="skeleton-item" />
                  ))}
                </div>
              ) : (
                <ContextFilter
                  type="academie"
                  data={filteredAcademies}
                  onSelect={(item) =>
                    item &&
                    setSelectedContextItem({ ...item, type: "academie" })
                  }
                  selectedItem={selectedContextItem}
                />
              )}
            </Tab>
            <Tab
              label={`Établissements (${
                loadingStructures ? "…" : filteredStructures.length
              })`}
              icon="building-fill"
            >
              {loadingStructures ? (
                <div className="context-filter-skeleton">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="skeleton-item" />
                  ))}
                </div>
              ) : (
                <ContextFilter
                  type="structure"
                  data={filteredStructures}
                  onSelect={(item) =>
                    item &&
                    setSelectedContextItem({ ...item, type: "structure" })
                  }
                  selectedItem={selectedContextItem}
                />
              )}
            </Tab>
          </Tabs>
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
