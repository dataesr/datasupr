import {
  Button,
  Col,
  Modal,
  ModalContent,
  ModalFooter,
  ModalTitle,
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
  type,
}: {
  data: NavigationItem[];
  onSelect: (item: NavigationItem | null) => void;
  selectedItem: NavigationItem | null;
  type: "discipline" | "region" | "academie" | "structure";
}) => {
  return (
    <div
      style={{
        height: "350px",
        overflowY: "auto",
        paddingRight: "1rem",
      }}
    >
      {data.map((item) => {
        const isSelected = selectedItem?.id === item.id;
        const disciplineColor =
          type === "discipline" ? getColorForDiscipline(item.name) : undefined;

        return (
          <div
            key={item.id}
            onClick={() => onSelect(item)}
            style={{
              cursor: "pointer",
              padding: "0.75rem 1rem",
              backgroundColor: isSelected
                ? "var(--background-action-low-blue-france)"
                : "transparent",
              borderLeft: "4px solid",
              borderColor: isSelected
                ? "var(--blue-cumulus-sun-368)"
                : disciplineColor || "var(--border-default-grey)",
              marginBottom: "0.25rem",
              transition: "background-color 0.2s ease-in-out",
            }}
            onMouseEnter={(e) => {
              if (!isSelected) {
                e.currentTarget.style.backgroundColor =
                  "var(--background-alt-grey)";
              }
            }}
            onMouseLeave={(e) => {
              if (!isSelected) {
                e.currentTarget.style.backgroundColor = "transparent";
              }
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
        <ModalTitle>Filtrer les données</ModalTitle>
        <ModalContent>
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
            <Tab
              label={`Disciplines (${filteredDisciplines.length})`}
            >
              <ContextFilter
                type="discipline"
                data={filteredDisciplines}
                onSelect={(item) =>
                  item && handleContextSelect(item, "discipline")
                }
                selectedItem={selectedContextItem}
              />
            </Tab>
            <Tab label={`Régions (${filteredRegions.length})`}>
              <ContextFilter
                type="region"
                data={filteredRegions}
                onSelect={(item) => item && handleContextSelect(item, "region")}
                selectedItem={selectedContextItem}
              />
            </Tab>
            <Tab label={`Académies (${filteredAcademies.length})`}>
              <ContextFilter
                type="academie"
                data={filteredAcademies}
                onSelect={(item) =>
                  item && handleContextSelect(item, "academie")
                }
                selectedItem={selectedContextItem}
              />
            </Tab>
            <Tab
              label={`Établissements (${filteredStructures.length})`}
            >
              <ContextFilter
                type="structure"
                data={filteredStructures}
                onSelect={(item) =>
                  item && handleContextSelect(item, "structure")
                }
                selectedItem={selectedContextItem}
              />
            </Tab>
          </Tabs>
        </ModalContent>
        <ModalFooter >
          <Button variant="secondary"  onClick={handleClose}>
            Annuler
          </Button>
          <Button
            onClick={handleApplyFilters}
            disabled={!selectedContextItem && selectedYear === initialYear}
          >
            Appliquer les filtres
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
};
export default YearSelector;