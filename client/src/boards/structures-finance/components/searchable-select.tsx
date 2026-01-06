import { useState, useRef, useEffect } from "react";
import "./searchable-select.scss";

interface SearchableSelectProps {
  options: Array<{
    id: string;
    label: string;
    searchableText?: string;
    subtitle?: string;
  }>;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
}

export default function SearchableSelect({
  options,
  value,
  onChange,
  placeholder = "Rechercher...",
  label,
}: SearchableSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const filteredOptions = options.filter((option) => {
    const searchText = option.searchableText || option.label;
    return searchText.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const selectedOption = options.find((opt) => opt.id === value);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setSearchTerm("");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (optionId: string) => {
    onChange(optionId);
    setIsOpen(false);
    setSearchTerm("");
  };

  const handleInputClick = () => {
    setIsOpen(true);
    if (inputRef.current) {
      inputRef.current.select();
    }
  };

  return (
    <div
      className="fr-select-group searchable-select-container"
      ref={containerRef}
    >
      {label && (
        <label className="fr-label">
          <strong>{label}</strong>
        </label>
      )}
      <div style={{ position: "relative" }}>
        <input
          ref={inputRef}
          type="text"
          className="fr-input searchable-select-input"
          value={isOpen ? searchTerm : selectedOption?.label || ""}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            if (!isOpen) setIsOpen(true);
          }}
          onClick={handleInputClick}
          placeholder={!isOpen && !selectedOption ? placeholder : ""}
          style={{
            cursor: "pointer",
            backgroundColor: "var(--background-default-grey)",
          }}
        />
        <span className={`searchable-select-arrow ${isOpen ? "open" : ""}`}>
          ▼
        </span>
        {isOpen && (
          <div className="searchable-select-dropdown">
            {filteredOptions.length === 0 ? (
              <div className="searchable-select-no-results">
                Aucun résultat trouvé
              </div>
            ) : (
              filteredOptions.map((option) => (
                <div
                  key={option.id}
                  onClick={() => handleSelect(option.id)}
                  className={`searchable-select-option ${
                    option.id === value ? "selected" : ""
                  }`}
                >
                  <div>{option.label}</div>
                  {option.subtitle && (
                    <div
                      style={{
                        fontSize: "0.875rem",
                        color: "var(--text-mention-grey)",
                        marginTop: "0.25rem",
                      }}
                    >
                      {option.subtitle}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
