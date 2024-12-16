export function getLevelFromGeoId({ geoId }: { geoId: string }) {
  let levelLabel = "Commune";
  if (geoId.startsWith("R")) {
    levelLabel = "Région";
  }
  if (geoId.startsWith("D")) {
    levelLabel = "Département";
  }
  if (geoId.startsWith("A")) {
    levelLabel = "Académie";
  }
  if (geoId.startsWith("U")) {
    levelLabel = "Unité urbaine";
  }
  if (geoId.startsWith("P")) {
    levelLabel = "Pays";
  }
  return (
    levelLabel
  );
}