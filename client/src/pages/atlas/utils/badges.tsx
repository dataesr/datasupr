import { Badge } from "@dataesr/dsfr-plus";
import { LEVEL_COLORS } from "./contants";

export function GetLevelBadgeFromId({ id }: { id: string }) {
  let color = LEVEL_COLORS['COMMUNE'];
  let levelLabel = 'Commune';
  if (id.startsWith('R')) {
    color = LEVEL_COLORS['REGION'];
    levelLabel = 'Région';
  }
  if (id.startsWith('D')) {
    color = LEVEL_COLORS['DEPARTEMENT'];
    levelLabel = 'Département';
  }
  if (id.startsWith('A')) {
    color = LEVEL_COLORS['ACADEMIE'];
    levelLabel = 'Académie';
  }
  if (id.startsWith('U')) {
    color = LEVEL_COLORS['UUCR'];
    levelLabel = 'Unité urbaine';
  }
  if (id.startsWith('P')) {
    color = LEVEL_COLORS['PAYS'];
    levelLabel = 'Pays';
  }
  return (
    <Badge
      className="fr-mx-1w"
      color={color}>
      {levelLabel}
    </Badge>
  );
}