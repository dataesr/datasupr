import { Row, Col } from "@dataesr/dsfr-plus";

interface Item {
  etablissement_id_paysage_actuel: string;
  etablissement_actuel_lib: string;
  [key: string]: any;
}

interface ComparisonSelectorProps {
  items: Item[];
  selectedIds: string[];
  onSelectionChange: (ids: string[]) => void;
}

export default function ComparisonSelector({
  items,
  selectedIds,
  onSelectionChange,
}: ComparisonSelectorProps) {
  const handleToggle = (id: string) => {
    const newSelection = selectedIds.includes(id)
      ? selectedIds.filter((sid) => sid !== id)
      : [...selectedIds, id];
    onSelectionChange(newSelection);
  };

  return (
    <div className="fr-mb-3w">
      <h3 className="fr-h6 fr-mb-1w">
        Sélectionnez les établissements à comparer
      </h3>
      <Row gutters className="fr-mb-0">
        {items.map((item) => (
          <Col key={item.etablissement_id_paysage_actuel} xs="12" md="6" lg="3">
            <label
              className="fr-checkbox-group fr-checkbox-group--sm fr-mb-0"
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: "0.5rem",
              }}
            >
              <input
                type="checkbox"
                checked={selectedIds.includes(
                  item.etablissement_id_paysage_actuel
                )}
                onChange={() =>
                  handleToggle(item.etablissement_id_paysage_actuel)
                }
                style={{ marginTop: "0.25rem", flexShrink: 0 }}
              />
              <span
                className="fr-label fr-text--sm"
                style={{
                  margin: 0,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
                title={item.etablissement_actuel_lib}
              >
                {item.etablissement_actuel_lib}
              </span>
            </label>
          </Col>
        ))}
      </Row>
    </div>
  );
}
