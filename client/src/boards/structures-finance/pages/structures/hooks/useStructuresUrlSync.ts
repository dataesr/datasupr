import { useSearchParams } from "react-router-dom";
import { useMemo } from "react";

interface UseStructuresUrlSyncReturn {
  yearFromUrl: string;
  typeFromUrl: string;
  regionFromUrl: string;
  typologieFromUrl: string;
  etablissementFromUrl: string;
  updateUrl: (params: {
    year?: string | number;
    type?: string;
    region?: string;
    typologie?: string;
    structureId?: string;
  }) => void;
}

export function useStructuresUrlSync(): UseStructuresUrlSyncReturn {
  const [searchParams, setSearchParams] = useSearchParams();

  const yearFromUrl = searchParams.get("year") || "";
  const typeFromUrl = searchParams.get("type") || "";
  const regionFromUrl = searchParams.get("region") || "";
  const typologieFromUrl = searchParams.get("typologie") || "";
  const etablissementFromUrl = searchParams.get("structureId") || "";

  const updateUrl = useMemo(
    () =>
      (params: {
        year?: string | number;
        type?: string;
        region?: string;
        typologie?: string;
        structureId?: string;
      }) => {
        const next = new URLSearchParams(searchParams);
        if (params.year !== undefined) next.set("year", String(params.year));
        if (params.type !== undefined) next.set("type", params.type);
        if (params.region !== undefined) next.set("region", params.region);
        if (params.typologie !== undefined)
          next.set("typologie", params.typologie);
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
    typologieFromUrl,
    etablissementFromUrl,
    updateUrl,
  };
}
