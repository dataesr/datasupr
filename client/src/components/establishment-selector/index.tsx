import { useState } from "react";
import { Row, Col } from "@dataesr/dsfr-plus";
import "./styles.scss";

interface SelectOption {
  id: string;
  label: string;
  searchableText: string;
  subtitle?: string;
}

interface EstablishmentSelectorProps {
  title?: string;
  typeOptions: string[];
  typologieOptions: string[];
  regionValue: string;
  regionOptions: string[];
  onRegionChange: (value: string) => void;
  searchValue: string;
  searchOptions: SelectOption[];
  onSearchChange: (value: string) => void;
  searchLabel?: string;
  searchPlaceholder?: string;
  SearchComponent: React.ComponentType<any>;
  onTypeChange?: (type: string) => void;
  onTypologieChange?: (typologie: string) => void;
}

export default function EstablishmentSelector({
  title,
  typeOptions,
  typologieOptions,
  regionValue,
  regionOptions,
  onRegionChange,
  searchValue,
  searchOptions,
  onSearchChange,
  searchLabel = "Établissement",
  searchPlaceholder = "Rechercher...",
  SearchComponent,
  onTypeChange: externalOnTypeChange,
  onTypologieChange: externalOnTypologieChange,
}: EstablishmentSelectorProps) {
  const [selectedType, setSelectedType] = useState("tous");
  const [selectedTypologie, setSelectedTypologie] = useState("toutes");

  const handleTypeChange = (type: string) => {
    setSelectedType(type);
    setSelectedTypologie("toutes");
    externalOnTypeChange?.(type);
  };

  const handleTypologieChange = (typologie: string) => {
    setSelectedTypologie(typologie);
    externalOnTypologieChange?.(typologie);
  };
  return (
    <div className="establishment-selector">
      {title && (
        <h3 className="fr-h5 establishment-selector__title">{title}</h3>
      )}

      <Row gutters className="establishment-selector__filters">
        <Col xs="12" sm="6" md="4">
          <div className="fr-select-group">
            <label className="fr-label">
              <strong>Type</strong>
            </label>
            <select
              className="fr-select"
              value={selectedType}
              onChange={(e) => handleTypeChange(e.target.value)}
            >
              <option value="tous">Tous les types</option>
              {typeOptions.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>
        </Col>
        <Col xs="12" sm="6" md="4">
          <div className="fr-select-group">
            <label className="fr-label">
              <strong>Typologie</strong>
            </label>
            <select
              className="fr-select"
              value={selectedTypologie}
              onChange={(e) => handleTypologieChange(e.target.value)}
            >
              <option value="toutes">Toutes les typologies</option>
              {typologieOptions.map((typologie) => (
                <option key={typologie} value={typologie}>
                  {typologie}
                </option>
              ))}
            </select>
          </div>
        </Col>
        <Col xs="12" sm="6" md="4">
          <div className="fr-select-group">
            <label className="fr-label">
              <strong>Région</strong>
            </label>
            <select
              className="fr-select"
              value={regionValue}
              onChange={(e) => onRegionChange(e.target.value)}
            >
              <option value="toutes">Toutes les régions</option>
              {regionOptions.map((region) => (
                <option key={region} value={region}>
                  {region}
                </option>
              ))}
            </select>
          </div>
        </Col>
      </Row>

      <Row gutters>
        <Col>
          <SearchComponent
            label={searchLabel}
            options={searchOptions}
            value={searchValue}
            onChange={onSearchChange}
            placeholder={searchPlaceholder}
          />
        </Col>
      </Row>
    </div>
  );
}
