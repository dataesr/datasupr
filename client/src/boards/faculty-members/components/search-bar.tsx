import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useFacultyMembersSearchBar } from "../api/use-search-bar";
import "./styles.scss";

interface SearchResult {
  id: string;
  name: string;
  type: "univ" | "region" | "discipline";
  subtype?: string;
  region?: string;
  total_count: number;
  href: string;
}

const normalizeText = (text: string) =>
  text
    ?.toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

const getTypeIcon = (type: string) => {
  const icons = { univ: "🏫", region: "🗺️", discipline: "📚" };
  return icons[type as keyof typeof icons] || "📋";
};

const getTypeLabel = (type: string, subtype?: string) => {
  const labels = {
    univ: subtype || "Université",
    region: "Région",
    discipline: "Discipline",
  };
  return labels[type as keyof typeof labels] || "Autre";
};

export function SearchBar() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  const { data, isLoading, error } = useFacultyMembersSearchBar();

  const getFilteredResults = () => {
    if (!data || !query.trim()) return [];

    const searchTerm = normalizeText(query.trim());
    const allResults: SearchResult[] = [
      ...data.universities,
      ...data.regions,
      ...data.fields,
    ];

    return allResults
      .filter((item) => normalizeText(item.name)?.includes(searchTerm))
      .sort((a, b) => {
        const aName = normalizeText(a.name);
        const bName = normalizeText(b.name);
        const aStartsWith = aName.startsWith(searchTerm);
        const bStartsWith = bName.startsWith(searchTerm);

        if (aStartsWith && !bStartsWith) return -1;
        if (!aStartsWith && bStartsWith) return 1;
        return b.total_count - a.total_count;
      })
      .slice(0, 10);
  };

  const filteredResults = getFilteredResults();

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen || filteredResults.length === 0) return;

    const actions = {
      ArrowDown: () =>
        setSelectedIndex((prev) =>
          prev < filteredResults.length - 1 ? prev + 1 : 0
        ),
      ArrowUp: () =>
        setSelectedIndex((prev) =>
          prev > 0 ? prev - 1 : filteredResults.length - 1
        ),
      Enter: () =>
        selectedIndex >= 0 && handleResultClick(filteredResults[selectedIndex]),
      Escape: () => {
        setIsOpen(false);
        setSelectedIndex(-1);
        inputRef.current?.blur();
      },
    };

    if (actions[e.key as keyof typeof actions]) {
      e.preventDefault();
      actions[e.key as keyof typeof actions]();
    }
  };

  const handleResultClick = (result: SearchResult) => {
    setQuery(result.name);
    setIsOpen(false);
    setSelectedIndex(-1);
    navigate(result.href);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    setIsOpen(value.trim().length > 0);
    setSelectedIndex(-1);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        resultsRef.current &&
        !resultsRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setSelectedIndex(-1);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="search-bar" ref={resultsRef}>
      <div className="search-bar__input-container">
        <input
          ref={inputRef}
          className="fr-input search-bar__input"
          type="text"
          placeholder="Rechercher un établissement, une région ou une discipline..."
          value={query}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsOpen(query.trim().length > 0)}
          aria-expanded={isOpen}
          aria-haspopup="listbox"
          aria-autocomplete="list"
        />
        <div className="search-bar__icon">{isLoading ? "⏳" : "🔍"}</div>
      </div>

      {isOpen && (
        <div className="search-bar__dropdown" role="listbox">
          {error && (
            <div className="search-bar__error">Erreur lors de la recherche</div>
          )}

          {filteredResults.length === 0 && query.trim() && !isLoading && (
            <div className="search-bar__no-results">
              Aucun résultat pour "{query}"
            </div>
          )}

          {filteredResults.map((result, index) => (
            <div
              key={`${result.type}-${result.id}`}
              className={`search-bar__result ${
                index === selectedIndex ? "search-bar__result--selected" : ""
              }`}
              role="option"
              aria-selected={index === selectedIndex}
              onClick={() => handleResultClick(result)}
              onMouseEnter={() => setSelectedIndex(index)}
            >
              <div className="search-bar__result-icon">
                {getTypeIcon(result.type)}
              </div>
              <div className="search-bar__result-content">
                <div className="search-bar__result-name">{result.name}</div>
                <div className="search-bar__result-meta">
                  <span className="search-bar__result-type">
                    {getTypeLabel(result.type, result.subtype)}
                  </span>
                  {result.region && result.type === "univ" && (
                    <span className="search-bar__result-region">
                      • {result.region}
                    </span>
                  )}
                  <span className="search-bar__result-count">
                    • {result.total_count.toLocaleString()} enseignants pour
                    l'année universitaire {data?.latest_year}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
