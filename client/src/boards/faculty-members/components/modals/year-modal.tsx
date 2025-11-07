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
import "./styles.scss";

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
        <div className="year-modal__content">
          <Row>
            <Col className="year-modal__select-group">
              <select
                className="year-modal__select fr-select"
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
        </div>
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
