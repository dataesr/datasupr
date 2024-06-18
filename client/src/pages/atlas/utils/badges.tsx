import { Badge } from "@dataesr/dsfr-plus";
import { LEVEL_COLORS } from "./contants";

export function GetLevelBadgeFromId({ id }: { id: string }) {
  let color = LEVEL_COLORS["COMMUNE"];
  let levelLabel = "Commune";
  if (id.startsWith("R")) {
    color = LEVEL_COLORS["REGION"];
    levelLabel = "Région";
  }
  if (id.startsWith("D")) {
    color = LEVEL_COLORS["DEPARTEMENT"];
    levelLabel = "Département";
  }
  if (id.startsWith("A")) {
    color = LEVEL_COLORS["ACADEMIE"];
    levelLabel = "Académie";
  }
  if (id.startsWith("U")) {
    color = LEVEL_COLORS["UUCR"];
    levelLabel = "Unité urbaine";
  }
  if (id.startsWith("P")) {
    color = LEVEL_COLORS["PAYS"];
    levelLabel = "Pays";
  }
  return (
    <Badge className="fr-mx-1w" color={color}>
      {levelLabel}
    </Badge>
  );
}

export function GetLevelBadgeFromItem(item) {
  let color = LEVEL_COLORS["COMMUNE"];
  let levelLabel = "Commune";
  if (item.niveau_geo === "REGION") {
    color = LEVEL_COLORS["REGION"];
    levelLabel = "Région";
  }
  if (item.niveau_geo === "DEPARTEMENT") {
    color = LEVEL_COLORS["DEPARTEMENT"];
    levelLabel = "Département";
  }
  if (item.niveau_geo === "ACADEMIE") {
    color = LEVEL_COLORS["ACADEMIE"];
    levelLabel = "Académie";
  }
  if (item.niveau_geo === "UNITE_URBAINE") {
    color = LEVEL_COLORS["UUCR"];
    levelLabel = "Unité urbaine";
  }
  if (item.niveau_geo === "" || item.niveau_geo === "PAYS_100") {
    color = LEVEL_COLORS["PAYS"];
    levelLabel = "Pays";
  }
  return (
    <Badge className="fr-mx-1w" color={color}>
      {levelLabel}
    </Badge>
  );
}
