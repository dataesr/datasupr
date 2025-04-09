import {
  Button,
  Col,
  Modal,
  ModalContent,
  ModalTitle,
  Row,
} from "@dataesr/dsfr-plus";
import { useState } from "react";

interface YearFilterProps {
  years: string[];
  selectedYear: string;
  onYearChange: (year: string) => void;
}

const YearFilter: React.FC<YearFilterProps> = ({
  years,
  selectedYear,
  onYearChange,
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
          {years.map((value: string) => (
            <option key={value} value={value}>
              {`Année universitaire ${value}`}
            </option>
          ))}
        </select>
      </Col>
    </Row>
  );
};

interface YearSelectorProps {
  years: string[];
  selectedYear: string;
  onYearChange: (year: string) => void;
}

const YearSelector: React.FC<YearSelectorProps> = ({
  years,
  selectedYear,
  onYearChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);

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
            onYearChange={onYearChange}
          />
        </ModalContent>
      </Modal>
    </>
  );
};

export default YearSelector;
