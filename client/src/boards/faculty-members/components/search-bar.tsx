import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Autocomplete, AutocompleteItem } from "@dataesr/dsfr-plus";
import "./styles.scss";
import { useFacultyMembersSearchBar } from "../api/use-search-bar";

interface SearchResult {
  id: string;
  name: string;
  type: "univ" | "region" | "academie" | "discipline";
  subtype?: string;
  region?: string;
  region_id?: string;
  region_name?: string;
  total_count: number;
  href: string;
}

const normalizeText = (text: string) =>
  text
    ?.toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

const getTypeIcon = (type: string) => {
  const icons = {
    univ: "fr-icon-building-line",
    region: "fr-icon-earth-line",
    academie: "fr-icon-map-pin-2-line",
    discipline: "fr-icon-article-line",
  };

  return icons[type as keyof typeof icons] || "fr-icon-folder-line";
};

const getTypeLabel = (type: string, subtype?: string) => {
  const labels = {
    univ: subtype || "Université",
    region: "Région",
    academie: "Académie",
    discipline: "Discipline",
  };
  return labels[type as keyof typeof labels] || "Autre";
};

export function SearchBar() {
  const navigate = useNavigate();
  const [filterText, setFilterText] = useState("");

  const { data, isLoading, error } = useFacultyMembersSearchBar();

  const allItems = useMemo(() => {
    if (!data) return [];

    const allResults: SearchResult[] = [
      ...data.universities,
      ...data.regions,
      ...data.academies,
      ...data.fields,
    ];

    return allResults.map((result) => ({
      ...result,
      searchableText: normalizeText(result.name),
    }));
  }, [data]);

  const filteredItems = useMemo(() => {
    if (!filterText.trim()) return [];

    const searchTerm = normalizeText(filterText.trim());

    return allItems
      .filter((item) => item.searchableText.includes(searchTerm))
      .sort((a, b) => {
        const aStartsWith = a.searchableText.startsWith(searchTerm);
        const bStartsWith = b.searchableText.startsWith(searchTerm);

        if (aStartsWith && !bStartsWith) return -1;
        if (!aStartsWith && bStartsWith) return 1;
        return b.total_count - a.total_count;
      })
      .slice(0, 10);
  }, [allItems, filterText]);

  const loadingState = isLoading ? "loading" : "idle";

  const handleSelectionChange = (key) => {
    if (!filteredItems.length) return;

    const selectedItem = filteredItems.find((item) => item.id === key);
    if (selectedItem) {
      navigate(selectedItem.href);
      setFilterText("");
    }
  };

  const handleInputChange = (value: string) => {
    setFilterText(value);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && (!filterText.trim() || !filteredItems.length)) {
      e.preventDefault();
      e.stopPropagation();
    }
  };

  if (error) {
    return (
      <div>
        <div>Erreur lors du chargement des données de recherche</div>
      </div>
    );
  }

  return (
    <div>
      <Autocomplete
        label="Rechercher"
        items={filteredItems}
        inputValue={filterText}
        onInputChange={handleInputChange}
        onSelectionChange={handleSelectionChange}
        onKeyDown={handleKeyDown}
        loadingState={loadingState}
        placeholder="Rechercher un établissement, une région ou une discipline..."
        menuTrigger="focus"
        size="md"
        allowsCustomValue={false}
        disabledKeys={filteredItems.length === 0 ? [""] : []}
      >
        {(item) => {
          const regionInfo =
            item.type === "univ" && item.region
              ? `, ${item.region}`
              : item.type === "academie" && item.region_name
              ? `, Région ${item.region_name}`
              : "";

          const textValue = `${item.name} - ${getTypeLabel(
            item.type,
            item.subtype
          )}${regionInfo}`;

          return (
            <AutocompleteItem
              key={item.id}
              textValue={textValue}
              startContent={
                <span
                  className={`fr-mr-3v fr-icon--md ${getTypeIcon(item.type)}`}
                />
              }
              description={
                <div>
                  <div>
                    {getTypeLabel(item.type, item.subtype)}
                    {item.region && item.type === "univ" && ` • ${item.region}`}
                    {item.region_name &&
                      item.type === "academie" &&
                      ` • ${item.region_name}`}
                  </div>
                  <div>
                    {item.total_count.toLocaleString()} enseignants pour l'année
                    universitaire {data?.latest_year}
                  </div>
                </div>
              }
            >
              <span className="fr-text--sm">{item.name}</span>
            </AutocompleteItem>
          );
        }}
      </Autocomplete>
    </div>
  );
}
