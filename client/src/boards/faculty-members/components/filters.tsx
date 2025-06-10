import {
  Button,
  Col,
  Modal,
  ModalContent,
  ModalTitle,
  Row,
} from "@dataesr/dsfr-plus";
import { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { useFacultyMembersYears } from "../api/general-queries";

const YearFilter = ({
  years,
  selectedYear,
  onYearChange,
}: {
  years: string[];
  selectedYear: string;
  onYearChange: (year: string) => void;
}) => {
  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    onYearChange(event.target.value);
  };

  return (
    <Row>
      <Col className="fr-select-group">
        <label className="fr-label fr-sr-only" htmlFor="select">
          Sélectionnez l'année universitaire souhaitée
        </label>
        <select
          className="fr-select text-center"
          value={selectedYear}
          id="select"
          name="select"
          onChange={handleChange}
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
};

const YearSelector = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { data: yearsData, isLoading, error } = useFacultyMembersYears();
  const [searchParams, setSearchParams] = useSearchParams();

  const years = useMemo(
    () => yearsData?.academic_years || [],
    [yearsData?.academic_years]
  );

  const selectedYear =
    searchParams.get("année_universitaire") ||
    (years.length > 0 ? years[0] : "");

  const handleYearChange = (année_universitaire: string) => {
    setSearchParams((prev) => {
      const newParams = new URLSearchParams(prev);
      newParams.set("année_universitaire", année_universitaire);
      return newParams;
    });
  };

  useEffect(() => {
    if (years.length > 0 && !searchParams.get("année_universitaire")) {
      setSearchParams((prev) => {
        const newParams = new URLSearchParams(prev);
        newParams.set("année_universitaire", years[0]);
        return newParams;
      });
    }
  }, [years, searchParams, setSearchParams]);

  if (isLoading) {
    return (
      <Button
        className="button"
        color="blue-cumulus"
        icon="calendar-2-line"
        disabled
        size="sm"
      >
        Chargement...
      </Button>
    );
  }

  if (error) {
    return (
      <Button
        className="button"
        color="error"
        icon="calendar-2-line"
        disabled
        size="sm"
      >
        Erreur
      </Button>
    );
  }

  return (
    <>
      <Button
        className="button"
        color="blue-cumulus"
        icon="calendar-2-line"
        onClick={() => setIsOpen(true)}
        size="sm"
      >
        Année universitaire&nbsp;<strong>{selectedYear}</strong>
      </Button>
      <Modal isOpen={isOpen} hide={() => setIsOpen(false)} size="lg">
        <ModalTitle>Sélection d'une année universitaire</ModalTitle>
        <ModalContent>
          <YearFilter
            years={years}
            selectedYear={selectedYear}
            onYearChange={handleYearChange}
          />
        </ModalContent>
      </Modal>
    </>
  );
};

export default YearSelector;
