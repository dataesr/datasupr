import { useContext } from "react";
import { AtlasContext } from "./context";

export function useAtlas() {
  const context = useContext(AtlasContext);
  if (context === undefined) {
    throw new Error("useAtlas must be used within an AtlasProvider");
  }
  return context;
}
