import { useEffect, useState } from "react";
import {
  Button,
  Modal,
  ModalContent,
  ModalFooter,
  ModalTitle,
  Row,
  Col,
} from "@dataesr/dsfr-plus";
import { YearModalProps } from "../../../../types/faculty-members";

export function YearModal({
  isOpen,
  years,
  currentYear,
  onClose,
  onApply,
}: YearModalProps) {
  const [selectedYear, setSelectedYear] = useState<string>(currentYear || "");

  useEffect(() => {
    if (isOpen) {
      setSelectedYear(currentYear || (years?.[0] ?? ""));
    }
  }, [isOpen, currentYear, years]);

  return (
    <Modal isOpen={isOpen} hide={onClose} size="md">
      <ModalTitle>Changer l'année universitaire</ModalTitle>
      <ModalContent>
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
              onChange={(e) => setSelectedYear(e.target.value)}
            >
              {years?.map((value: string) => (
                <option key={value} value={value}>
                  {`Année universitaire ${value}`}
                </option>
              ))}
            </select>
          </Col>
        </Row>
      </ModalContent>
      <ModalFooter>
        <Button size="sm" variant="secondary" onClick={onClose}>
          Annuler
        </Button>
        <Button
          size="sm"
          onClick={() => onApply(selectedYear)}
          disabled={!selectedYear}
        >
          Appliquer
        </Button>
      </ModalFooter>
    </Modal>
  );
}

export default YearModal;
