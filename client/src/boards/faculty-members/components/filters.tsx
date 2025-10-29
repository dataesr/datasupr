import { Badge, Button } from "@dataesr/dsfr-plus";
import { useState, useEffect, useMemo } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useFacultyMembersYears } from "../api/general-queries";
import type { NavigationItem } from "../../../types/faculty-members";
import { useContextDetection } from "../utils";
import YearModal from "./modals/year-modal";
import ContextExplorerModal from "./modals/context-explorer-modal";

const YearSelector = () => {
  const [isYearModalOpen, setIsYearModalOpen] = useState(false);
  const [isContextModalOpen, setIsContextModalOpen] = useState(false);

  const { data: yearsData, isLoading, error } = useFacultyMembersYears();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  useEffect(() => {
    if (
      yearsData?.complete_years &&
      yearsData.complete_years.length > 0 &&
      !searchParams.get("annee_universitaire")
    ) {
      const newParams = new URLSearchParams(searchParams);
      newParams.set("annee_universitaire", yearsData.complete_years[0]);
      navigate({ search: newParams.toString() }, { replace: true });
    }
  }, [yearsData, searchParams, navigate]);

  const years = useMemo(
    () => yearsData?.available_years || [],
    [yearsData?.available_years]
  );
  const completeYears = useMemo(
    () => yearsData?.complete_years || [],
    [yearsData?.complete_years]
  );

  const initialYear =
    searchParams.get("annee_universitaire") ||
    (completeYears.length > 0
      ? completeYears[0]
      : years.length > 0
      ? years[0]
      : "");

  const [selectedYear, setSelectedYear] = useState(initialYear);

  const { contextId, contextName } = useContextDetection();
  const badgeText = useMemo(() => {
    if (!contextId) return "Vue d'ensemble";

    return `${contextName}`;
  }, [contextId, contextName]);

  const handleApplyYearFilter = (newYear: string) => {
    setSelectedYear(newYear);
    const newParams = new URLSearchParams(searchParams);
    newParams.set("annee_universitaire", newYear);
    navigate({ search: newParams.toString() }, { replace: true });
    setIsYearModalOpen(false);
  };

  const handleExplore = (item: NavigationItem) => {
    let path = "";
    const params = new URLSearchParams();
    params.set("annee_universitaire", initialYear);

    const itemType = item.type as string | undefined;
    if (!itemType) return;

    switch (itemType) {
      case "discipline":
        path = "/personnel-enseignant/discipline/vue-d'ensemble";
        params.set("field_id", item.id);
        break;
      case "region":
      case "academie":
        path = "/personnel-enseignant/geo/vue-d'ensemble";
        params.set("geo_id", item.id);
        break;
      case "structure":
        path = "/personnel-enseignant/universite/vue-d'ensemble";
        params.set("structure_id", item.id);
        break;
      default:
        return;
    }
    navigate(`${path}?${params.toString()}`);
    setIsContextModalOpen(false);
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
      <div style={{ textAlign: "right" }}>
        <Badge size="sm" className="fr-mt-1w" color="green-emeraude">
          {initialYear}
        </Badge>
        <br />
        <Badge size="sm" color="green-emeraude">
          {badgeText}
        </Badge>
      </div>
      <YearModal
        isOpen={isYearModalOpen}
        years={years}
        currentYear={selectedYear}
        onClose={() => setIsYearModalOpen(false)}
        onApply={(y) => handleApplyYearFilter(y)}
      />

      <ContextExplorerModal
        isOpen={isContextModalOpen}
        year={selectedYear}
        onClose={() => setIsContextModalOpen(false)}
        onExplore={handleExplore}
      />
    </div>
  );
};

export default YearSelector;
