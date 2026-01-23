import { useState, useRef, useEffect } from "react";

import "./searchable-select.scss";

interface SearchableSelectProps {
  canSelectAll?: boolean,
  canSelectAllPlaceholder?: string,
  options: Array<{
    id: string;
    label: string;
    searchableText?: string;
    subtitle?: string;
  }>;
  value: string | string[];
  onChange: (value?: string) => void;
  placeholder?: string;
  label?: string;
}

export default function SearchableSelect({
  canSelectAll = false,
  canSelectAllPlaceholder = "Tout sélectionner",
  options,
  value,
  onChange,
  placeholder = "Rechercher...",
  label,
}: SearchableSelectProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const newValue = Array.isArray(value) ? value : [value];

  const filteredOptions = options.filter((option) => {
    const searchText = option.searchableText || option.label;
    return searchText.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const selectedOption = options.filter((opt) => newValue.includes(opt.id));

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (optionId: string) => {
    onChange(optionId);
    setSearchTerm("");
    setIsOpen(false);
  };

  const handleSelectAll = () => {
    onChange();
    setSearchTerm("");
    setIsOpen(false);
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setIsOpen(true);
  };

  const displayValue = selectedOption[selectedOption.length - 1]?.label || "";

  return (
    <div className="searchable-select-wrapper" ref={containerRef}>
      <div className="fr-search-bar" role="search">
        {label && (
          <label className="fr-label" htmlFor="searchable-select-input">
            {label}
          </label>
        )}
        <input
          id="searchable-select-input"
          type="search"
          className="fr-input"
          value={isOpen ? searchTerm : displayValue}
          onChange={handleInputChange}
          onFocus={() => {
            setSearchTerm("");
            setIsOpen(true);
          }}
          placeholder={placeholder}
          autoComplete="off"
        />
      </div>

      {isOpen && (
        <div className="searchable-select-dropdown">
          {filteredOptions.length === 0 ? (
            <div className="searchable-select-no-results">
              Aucun résultat trouvé
            </div>
          ) : (
            <>
              {canSelectAll && (
                <div
                  className="searchable-select-option"
                  key="select-all"
                  onClick={() => handleSelectAll()}
                >
                  <span aria-hidden="true" className="fr-icon-add-circle-line fr-icon--sm fr-mr-1w"></span>
                  <i>{canSelectAllPlaceholder}</i>
                </div>
              )}
              {
                filteredOptions.map((option) => (
                  <div
                    className={`searchable-select-option ${newValue.includes(option.id) ? "selected" : ""
                      }`}
                    key={option.id}
                    onClick={() => handleSelect(option.id)}
                  >
                    <div>{option.label}</div>
                    {option.subtitle && (
                      <div className="searchable-select-subtitle">
                        {option.subtitle}
                      </div>
                    )}
                  </div>
                ))
              }
            </>
          )}
        </div>
      )}
    </div>
  );
}
