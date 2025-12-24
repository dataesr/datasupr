import { useSearchParams } from "react-router-dom";
import { useMemo } from "react";

interface UseStructuresUrlSyncReturn {
  yearFromUrl: string;
  typeFromUrl: string;
  regionFromUrl: string;
  etablissementFromUrl: string;
  updateUrl: (params: {
    year?: string | number;
    type?: string;
    region?: string;
    structureId?: string;
  }) => void;
}

export function useStructuresUrlSync(): UseStructuresUrlSyncReturn {
  const [searchParams, setSearchParams] = useSearchParams();

  const yearFromUrl = searchParams.get("year") || "";
  const typeFromUrl = searchParams.get("type") || "";
  const regionFromUrl = searchParams.get("region") || "";
  const etablissementFromUrl = searchParams.get("structureId") || "";

  const updateUrl = useMemo(
    () =>
      (params: {
        year?: string | number;
        type?: string;
        region?: string;
        structureId?: string;
      }) => {
        const next = new URLSearchParams(searchParams);
        if (params.year !== undefined) next.set("year", String(params.year));
        if (params.type !== undefined) next.set("type", params.type);
        if (params.region !== undefined) next.set("region", params.region);
        if (params.structureId !== undefined)
          next.set("structureId", params.structureId);
        setSearchParams(next);
      },
    [searchParams, setSearchParams]
  );

  return {
    yearFromUrl,
    typeFromUrl,
    regionFromUrl,
    etablissementFromUrl,
    updateUrl,
  };
}
