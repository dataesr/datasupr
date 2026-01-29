import { useSearchParams } from "react-router-dom";

const RCE_LABELS: Record<string, string> = {
  "": "RCE et non RCE",
  rce: "RCE uniquement",
  "non-rce": "Non RCE uniquement",
};

export function useFilters() {
  const [searchParams, setSearchParams] = useSearchParams();

  const selectedType = searchParams.get("type") || "";
  const selectedTypologie = searchParams.get("typologie") || "";
  const selectedRegion = searchParams.get("region") || "";
  const selectedRce = searchParams.get("rce") || "";

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
    ["type", "typologie", "region", "rce"].forEach((k) =>
      searchParams.delete(k)
    );
    setSearchParams(searchParams);
  };

  const hasActiveFilters =
    !!selectedType || !!selectedTypologie || !!selectedRegion || !!selectedRce;

  return {
    selectedType,
    selectedTypologie,
    selectedRegion,
    selectedRce,
    handleTypeChange,
    handleTypologieChange: (v: string) => setParam("typologie", v),
    handleRegionChange: (v: string) => setParam("region", v),
    handleRceChange: (v: string) => setParam("rce", v),
    handleResetFilters,
    hasActiveFilters,
    labels: {
      type: selectedType || "Tous les types",
      typologie: selectedTypologie || "Toutes les typologies",
      region: selectedRegion || "Toutes les régions",
      rce: RCE_LABELS[selectedRce] || RCE_LABELS[""],
    },
  };
}
