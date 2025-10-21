import {
  Badge,
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
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                width: "100%",
              }}
            >
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
};

const YearSelector = () => {
  const [isYearModalOpen, setIsYearModalOpen] = useState(false);
  const [isContextModalOpen, setIsContextModalOpen] = useState(false);

  const { data: yearsData, isLoading, error } = useFacultyMembersYears();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  useEffect(() => {
    if (
      yearsData?.last_complete_year &&
      !searchParams.get("annee_universitaire")
    ) {
      const newParams = new URLSearchParams(searchParams);
      newParams.set("annee_universitaire", yearsData.last_complete_year);
      navigate({ search: newParams.toString() }, { replace: true });
    }
  }, [yearsData, searchParams, navigate]);

  const years = useMemo(
    () => yearsData?.complete_years || [],
    [yearsData?.complete_years]
  );
  const lastCompleteYear = yearsData?.last_complete_year;

  const initialYear =
    searchParams.get("annee_universitaire") ||
    lastCompleteYear ||
    (years.length > 0 ? years[0] : "");

  const [selectedYear, setSelectedYear] = useState(initialYear);
  const [selectedContextItem, setSelectedContextItem] =
    useState<NavigationItem | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const { data: disciplines } = useNavigation({
    type: "fields",
    annee_universitaire: selectedYear,
    enabled: isContextModalOpen,
  });
  const { data: regions } = useNavigation({
    type: "regions",
    annee_universitaire: selectedYear,
    enabled: isContextModalOpen,
  });
  const { data: academies } = useNavigation({
    type: "academies",
    annee_universitaire: selectedYear,
    enabled: isContextModalOpen,
  });
  const { data: structures } = useNavigation({
    type: "structures",
    annee_universitaire: "", // Pas de filtre par année pour les structures
    enabled: isContextModalOpen,
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
    if (isContextModalOpen) {
      setSelectedContextItem(null);
      setSearchTerm("");
    }
  }, [isContextModalOpen]);

  useEffect(() => {
    if (isYearModalOpen) {
      setSelectedYear(initialYear);
    }
  }, [isYearModalOpen, initialYear]);

  const handleYearChange = (newYear: string) => {
    setSelectedYear(newYear);
  };

  const handleApplyYearFilter = () => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set("annee_universitaire", selectedYear);
    navigate({ search: newParams.toString() }, { replace: true });
    setIsYearModalOpen(false);
  };

  const handleApplyContextFilter = () => {
    if (selectedContextItem) {
      let path = "";
      const params = new URLSearchParams();
      params.set("annee_universitaire", initialYear);

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
    setIsContextModalOpen(false);
  };

  const handleContextSelect = (item: NavigationItem, type: string) => {
    setSelectedContextItem({ ...item, type });
  };

  if (isLoading)
    return (
      <Button disabled size="sm">
        Chargement...
      </Button>
    );
  if (error) {
    console.log(error);
    return (
      <Button color="error" disabled size="sm">
        Erreur
      </Button>
    );
  }

  return (
    <div>
      <div className="fr-grid-row fr-grid-row--right">
        <Button
          className="button fr-mr-2w"
          color="blue-cumulus"
          icon="calendar-line"
          onClick={() => setIsYearModalOpen(true)}
          size="sm"
        ></Button>

        <Button
          className="button"
          color="blue-cumulus"
          icon="filter-line"
          onClick={() => setIsContextModalOpen(true)}
          size="sm"
        ></Button>
      </div>
      <Badge className="fr-mt-1w" color="green-emeraude">
        Année universitaire {initialYear}
      </Badge>

      <Modal
        isOpen={isYearModalOpen}
        hide={() => setIsYearModalOpen(false)}
        size="md"
      >
        <ModalTitle>Changer l'année universitaire</ModalTitle>
        <ModalContent>
          <YearFilter
            years={years}
            selectedYear={selectedYear}
            onYearChange={handleYearChange}
          />
        </ModalContent>
        <ModalFooter>
          <Button
            size="sm"
            variant="secondary"
            onClick={() => setIsYearModalOpen(false)}
          >
            Annuler
          </Button>
          <Button
            size="sm"
            onClick={handleApplyYearFilter}
            disabled={!selectedYear}
          >
            Appliquer
          </Button>
        </ModalFooter>
      </Modal>

      <Modal
        isOpen={isContextModalOpen}
        hide={() => setIsContextModalOpen(false)}
        size="lg"
      >
        <ModalTitle>Explorer par entité</ModalTitle>
        <ModalContent>
          <input
            type="search"
            placeholder="Rechercher..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="fr-input"
            style={{ marginBottom: "1rem" }}
          />
          <Tabs>
            <Tab label={`Disciplines (${filteredDisciplines.length})`}>
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
            <Tab label={`Établissements (${filteredStructures.length})`}>
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
        <ModalFooter>
          <Button
            size="sm"
            variant="secondary"
            onClick={() => setIsContextModalOpen(false)}
          >
            Annuler
          </Button>
          <Button
            size="sm"
            onClick={handleApplyContextFilter}
            disabled={!selectedContextItem}
          >
            Explorer
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
};

export default YearSelector;
