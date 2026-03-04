import { Alert } from "@dataesr/dsfr-plus";
import { useSearchParams } from "react-router-dom";

const i18n = {
  "eic-accelerator-warning": {
    fr: "EIC Accelerator selectionné : message d'avertissement à afficher",
    en: "EIC Accelerator selected: warning message to display",
  },
};
// TODO : Mettre à jour le message d'avertissement

export default function CheckEICAccelerator() {
  const [searchParams] = useSearchParams();
  const thematicIds = searchParams.get("thematicIds")?.split(",") || [];
  const currentLang = searchParams.get("language") || "fr";

  if (!thematicIds.includes("ACCELERATOR")) {
    return null;
  }

  return <Alert variant="warning" description={i18n["eic-accelerator-warning"][currentLang as "fr" | "en"]} />;
}
