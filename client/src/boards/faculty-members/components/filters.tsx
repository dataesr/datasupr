import {
  Button,
  Col,
  Modal,
  ModalContent,
  Row,
  Tab,
  Tabs,
} from "@dataesr/dsfr-plus";
import { useState, useEffect, useMemo } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useFacultyMembersYears } from "../api/general-queries";
import { NavigationItem, useNavigation } from "../api/use-navigation";
import { getColorForDiscipline } from "../utils";

const YearFilter = ({
  years,
  selectedYear,
  onYearChange,
}: {
  years: string[];
  selectedYear: string;
  onYearChange: (year: string) => void;
}) => (
  <Row>
    <Col className="fr-select-group">
      <label className="fr-label" htmlFor="year-select">
        Sélectionnez l'année universitaire
      </label>
      <select
        className="fr-select text-center"
        value={selectedYear}
        id="year-select"
        name="year-select"
        onChange={(e) => onYearChange(e.target.value)}
      >
        {years?.map((value: string) => (
          <option key={value} value={value}>
            {`Année universitaire ${value}`}
          </option>
        ))}
      </select>
    </Col>
  </Row>
);

const ContextFilter = ({
  data,
  onSelect,
  selectedItem,
  searchTerm,
  type,
}: {
  data: NavigationItem[];
  onSelect: (item: NavigationItem | null) => void;
  selectedItem: NavigationItem | null;
  searchTerm: string;
  type: "discipline" | "region" | "academie" | "structure";
}) => {
  const filteredData = useMemo(
    () =>
      data?.filter((item) =>
        item?.name?.toLowerCase().includes(searchTerm.toLowerCase())
      ) || [],
    [data, searchTerm]
  );

  return (
    <div
      style={{
        height: "350px",
        overflowY: "auto",
        padding: "0.5rem",
        display: "flex",
        flexWrap: "wrap",
        gap: "0.5rem",
        alignContent: "flex-start",
      }}
    >
      {filteredData.map((item) => {
        const isSelected = selectedItem?.id === item.id;
        const disciplineColor =
          type === "discipline" ? getColorForDiscipline(item.name) : undefined;

        const getBackgroundColor = () => {
          if (isSelected) return "var(--background-action-low-blue-france)";
          if (disciplineColor) return disciplineColor;
          return "var(--blue-ecume-moon-675)";
        };

        return (
          <div
            key={item.id}
            onClick={() => onSelect(item)}
            style={{
              cursor: "pointer",
              padding: "0.25rem 0.75rem",
              border: "1px solid transparent",
              borderRadius: "1rem",
              fontSize: "0.85rem",
              color: "var(--text-action-high-grey)",
              backgroundColor: getBackgroundColor(),
              transition: "background-color 0.2s ease-in-out",
            }}
          >
            {item.name}
          </div>
        );
      })}
    </div>
  );
};

const YearSelector = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { data: yearsData, isLoading, error } = useFacultyMembersYears();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const years = useMemo(
    () => yearsData?.academic_years || [],
    [yearsData?.academic_years]
  );
  const initialYear =
    searchParams.get("annee_universitaire") ||
    (years.length > 0 ? years[0] : "");

  const [selectedYear, setSelectedYear] = useState(initialYear);
  const [selectedContextItem, setSelectedContextItem] =
    useState<NavigationItem | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const { data: disciplines } = useNavigation({
    type: "fields",
    annee_universitaire: selectedYear,
    enabled: isOpen,
  });
  const { data: regions } = useNavigation({
    type: "regions",
    annee_universitaire: selectedYear,
    enabled: isOpen,
  });
  const { data: academies } = useNavigation({
    type: "academies",
    annee_universitaire: selectedYear,
    enabled: isOpen,
  });
  const { data: structures } = useNavigation({
    type: "structures",
    annee_universitaire: selectedYear,
    enabled: isOpen,
  });

  useEffect(() => {
    if (years.length > 0 && !searchParams.get("annee_universitaire")) {
      setSelectedYear(years[0]);
    }
  }, [years, searchParams]);

  useEffect(() => {
    if (isOpen) {
      setSelectedYear(initialYear);
      setSelectedContextItem(null);
      setSearchTerm("");
    }
  }, [isOpen, initialYear]);

  const handleYearChange = (newYear: string) => {
    setSelectedYear(newYear);
    setSelectedContextItem(null);
  };

  const handleApplyFilters = () => {
    if (selectedContextItem) {
      let path = "";
      const params = new URLSearchParams();
      params.set("annee_universitaire", selectedYear);

      switch (selectedContextItem.type) {
        case "discipline":
          path = "/personnel-enseignant/discipline/vue-d'ensemble";
          params.set("field_id", selectedContextItem.id);
          break;
        case "region":
        case "academie":
          path = "/personnel-enseignant/geo/vue-d'ensemble";
          params.set("geo_id", selectedContextItem.id);
          break;
        case "structure":
          path = "/personnel-enseignant/universite/vue-d'ensemble";
          params.set("structure_id", selectedContextItem.id);
          break;
        default:
          return;
      }
      navigate(`${path}?${params.toString()}`);
    }
    // on garde ce else si juste l'année est changé, mais ça peut changer en fait
    else if (selectedYear !== initialYear) {
      const newParams = new URLSearchParams(searchParams);
      newParams.set("annee_universitaire", selectedYear);
      navigate({ search: newParams.toString() }, { replace: true });
    }
    setIsOpen(false);
  };

  const handleContextSelect = (item: NavigationItem, type: string) => {
    setSelectedContextItem({ ...item, type });
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  if (isLoading)
    return (
      <Button disabled size="sm">
        Chargement...
      </Button>
    );
  if (error)
    return (
      <Button color="error" disabled size="sm">
        Erreur
      </Button>
    );

  return (
    <>
      <Button
        className="button"
        color="blue-cumulus"
        icon="filter-line"
        onClick={() => setIsOpen(true)}
        size="sm"
      >
        Filtrer les données
      </Button>
      <Modal isOpen={isOpen} hide={handleClose} size="lg">
        <ModalContent>
          <div>
            <h1 className="fr-modal__title" style={{ fontSize: "1.5rem" }}>
              Filtrer les données
            </h1>
          </div>
          <div style={{ padding: "1.5rem", flexGrow: 1, overflowY: "hidden" }}>
            <YearFilter
              years={years}
              selectedYear={selectedYear}
              onYearChange={handleYearChange}
            />
            <hr />
            <input
              type="search"
              placeholder="Rechercher..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="fr-input"
              style={{ marginBottom: "1rem" }}
            />
            <Tabs>
              <Tab label="Disciplines">
                <ContextFilter
                  type="discipline"
                  data={disciplines?.items || []}
                  onSelect={(item) =>
                    item && handleContextSelect(item, "discipline")
                  }
                  selectedItem={selectedContextItem}
                  searchTerm={searchTerm}
                />
              </Tab>
              <Tab label="Régions">
                <ContextFilter
                  type="region"
                  data={regions?.items || []}
                  onSelect={(item) =>
                    item && handleContextSelect(item, "region")
                  }
                  selectedItem={selectedContextItem}
                  searchTerm={searchTerm}
                />
              </Tab>
              <Tab label="Académies">
                <ContextFilter
                  type="academie"
                  data={academies?.items || []}
                  onSelect={(item) =>
                    item && handleContextSelect(item, "academie")
                  }
                  selectedItem={selectedContextItem}
                  searchTerm={searchTerm}
                />
              </Tab>
              <Tab label="Établissements">
                <ContextFilter
                  type="structure"
                  data={structures?.items || []}
                  onSelect={(item) =>
                    item && handleContextSelect(item, "structure")
                  }
                  selectedItem={selectedContextItem}
                  searchTerm={searchTerm}
                />
              </Tab>
            </Tabs>
          </div>
          <div
            style={{
              padding: "1.5rem",
              borderTop: "1px solid var(--border-default-grey)",
              display: "flex",
              justifyContent: "flex-end",
              gap: "1rem",
            }}
          >
            <Button variant="secondary" onClick={handleClose}>
              Annuler
            </Button>
            <Button
              onClick={handleApplyFilters}
              disabled={!selectedContextItem && selectedYear === initialYear}
            >
              Appliquer les filtres
            </Button>
          </div>
        </ModalContent>
      </Modal>
    </>
  );
};
export default YearSelector;
