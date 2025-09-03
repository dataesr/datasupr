import { createContext } from "react";

interface AtlasContextType {
  DEFAULT_CURRENT_YEAR: string;
  DEFAULT_GEO_ID: string;
  START_YEAR: string;
  END_YEAR: string;
}

export const AtlasContext = createContext<AtlasContextType | undefined>(undefined);

export type { AtlasContextType };
