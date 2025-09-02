import { useState, useEffect, useRef, KeyboardEvent } from "react";
import { useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Row, Col, TextInput, Button, Link } from "@dataesr/dsfr-plus";

import i18n from "./i18n.json";
import "./styles.scss";

export default function EntitySearchBar() {
  const [searchParams] = useSearchParams();
  const currentLang = searchParams.get("language") || "fr";
  const country_code = searchParams.get("country_code") || "FRA";
  const [query, setQuery] = useState("");
  const [isVisible, setIsVisible] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const resultsRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const { data = [], isLoading } = useQuery({
    queryKey: ["ep/get-entities", "pillars", query, country_code],
    queryFn: async () => {
      const response = await fetch(
        `http://localhost:3000/api/european-projects/collaborations/get-entities?entityName=${query}&country_code=${country_code}`
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    },
    enabled: query.length >= 3,
  });

  useEffect(() => {
    if (query.length >= 3) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  }, [query]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (resultsRef.current && !resultsRef.current.contains(event.target)) {
        setIsVisible(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  function getI18nLabel(key) {
    return i18n[key][currentLang];
  }

  const scrollSelectedIntoView = (index: number) => {
    if (index === -1) return;

    const resultsElement = resultsRef.current;
    const selectedElement = resultsElement?.querySelector(`li:nth-child(${index + 1})`);

    if (selectedElement && resultsElement) {
      const containerRect = resultsElement.getBoundingClientRect();
      const elementRect = selectedElement.getBoundingClientRect();

      if (elementRect.bottom > containerRect.bottom) {
        // Scroll vers le bas si l'élément est en dessous
        selectedElement.scrollIntoView({ block: "nearest" });
      } else if (elementRect.top < containerRect.top) {
        // Scroll vers le haut si l'élément est au-dessus
        selectedElement.scrollIntoView({ block: "nearest" });
      }
    }
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (!data || !isVisible) return;

    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        setSelectedIndex((prev) => {
          const newIndex = prev < data.length - 1 ? prev + 1 : prev;
          setTimeout(() => scrollSelectedIntoView(newIndex), 0);
          return newIndex;
        });
        break;
      case "ArrowUp":
        event.preventDefault();
        if (selectedIndex <= 0) {
          // Retour au champ de saisie
          setSelectedIndex(-1);
          inputRef.current?.focus();
        } else {
          setSelectedIndex((prev) => {
            const newIndex = prev - 1;
            setTimeout(() => scrollSelectedIntoView(newIndex), 0);
            return newIndex;
          });
        }
        break;
      case "Enter":
        if (selectedIndex >= 0) {
          const selectedEntity = data[selectedIndex];
          // Naviguer vers la page de l'entité
          window.location.href = `/european-projects/collaborations/${selectedEntity.entities_id}?language=${currentLang}&country_code=${country_code}`;
        }
        break;
      case "Escape":
        setIsVisible(false);
        setSelectedIndex(-1);
        break;
    }
  };

  // Réinitialiser l'index sélectionné quand la requête change
  useEffect(() => {
    setSelectedIndex(-1);
  }, [query]);

  const handleResetClick = () => {
    setQuery("");
    setIsVisible(false);
    setSelectedIndex(-1);
    inputRef.current?.focus();
  };

  return (
    <div style={{ position: "relative" }}>
      <Row>
        <Col>
          <label className="fr-label" htmlFor="entity-search-input">
            {getI18nLabel("find-entity")}
          </label>
          <div style={{ display: "flex", gap: "0.5rem", alignItems: "flex-end" }}>
            <div style={{ flex: 1 }}>
              <TextInput
                id="entity-search-input"
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={getI18nLabel("find-entity-placeholder")}
                ref={inputRef}
                value={query}
              />
            </div>
            <Button
              icon="delete-line"
              size="sm"
              variant="secondary"
              onClick={handleResetClick}
              disabled={query.length === 0}
              className="fr-btn--icon-only"
            >
              {getI18nLabel("reset")}
            </Button>
          </div>
        </Col>
      </Row>
      {query.length >= 3 && (
        <div ref={resultsRef} className={`results-dropdown ${isVisible ? "visible" : "hidden"}`}>
          {isLoading ? (
            <div className="fr-p-2w">Loading...</div>
          ) : (
            <ul className="fr-p-2w fr-m-0">
              {data.map((entity, index) => (
                <li
                  className={`fr-py-1w fr-px-2w ${index === selectedIndex ? "selected" : ""}`}
                  key={entity.entities_id}
                  onMouseOver={() => setSelectedIndex(index)}
                  onMouseOut={() => {
                    if (index !== selectedIndex) {
                      setSelectedIndex(-1);
                    }
                  }}
                >
                  <Link href={`/european-projects/collaborations/${entity.entities_id}?language=${currentLang}&country_code=${country_code}`}>
                    {entity.entities_name}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
