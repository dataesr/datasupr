import { useSearchParams } from "react-router-dom";

const RCE_LABELS: Record<string, string> = {
  "": "RCE et non RCE",
  rce: "RCE uniquement",
  "non-rce": "Non RCE uniquement",
};

const DEVIMMO_LABELS: Record<string, string> = {
  "": "Avec ou sans dévolution immobilière",
  devimmo: "Avec dévolution immobilière",
  "non-devimmo": "Sans dévolution immobilière",
};

export function useFilters() {
  const [searchParams, setSearchParams] = useSearchParams();

  const selectedType = searchParams.get("type") || "";
  const selectedTypologie = searchParams.get("typologie") || "";
  const selectedRegion = searchParams.get("region") || "";
  const selectedRce = searchParams.get("rce") || "";
  const selectedDevimmo = searchParams.get("devimmo") || "";

  const setParam = (key: string, value: string) => {
    if (value) {
      searchParams.set(key, value);
    } else {
      searchParams.delete(key);
    }
    setSearchParams(searchParams);
  };

  const handleTypeChange = (type: string) => {
    setParam("type", type);
    searchParams.delete("typologie");
    setSearchParams(searchParams);
  };

  const handleResetFilters = () => {
    ["type", "typologie", "region", "rce", "devimmo"].forEach((k) =>
      searchParams.delete(k)
    );
    setSearchParams(searchParams);
  };

  const hasActiveFilters =
    !!selectedType ||
    !!selectedTypologie ||
    !!selectedRegion ||
    !!selectedRce ||
    !!selectedDevimmo;

  return {
    selectedType,
    selectedTypologie,
    selectedRegion,
    selectedRce,
    selectedDevimmo,
    handleTypeChange,
    handleTypologieChange: (v: string) => setParam("typologie", v),
    handleRegionChange: (v: string) => setParam("region", v),
    handleRceChange: (v: string) => setParam("rce", v),
    handleDevimmoChange: (v: string) => setParam("devimmo", v),
    handleResetFilters,
    hasActiveFilters,
    labels: {
      type: selectedType || "Tous les types",
      typologie: selectedTypologie || "Toutes les typologies",
      region: selectedRegion || "Toutes les régions",
      rce: RCE_LABELS[selectedRce] || RCE_LABELS[""],
      devimmo: DEVIMMO_LABELS[selectedDevimmo] || DEVIMMO_LABELS[""],
    },
  };
}
