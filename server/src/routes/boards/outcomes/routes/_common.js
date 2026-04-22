import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));

export const VALUE_MAPS = JSON.parse(
  readFileSync(join(__dirname, "..", "VALUE_MAPS.json"), "utf-8")
);

export const FILTER_FIELDS = [
  "groupe_disciplinaire",
  "sexe",
  "origine_sociale",
  "bac_type",
  "bac_mention",
  "retard_scolaire",
  "devenir_en_un_an",
  "type_de_trajectoire",
];

export const ENSEMBLE_DEFAULTS = {
  groupe_disciplinaire: "DIS00",
  sexe: "SEX00",
  origine_sociale: "ORI00",
  bac_type: "BAC00",
  bac_mention: "MEN00",
  retard_scolaire: "RET00",
  devenir_en_un_an: "DEV00",
  type_de_trajectoire: "TRA00",
};

export function parseListParam(value) {
  if (!value) return [];
  return value
    .split(/[,|]/)
    .map((item) => item.trim())
    .filter(Boolean);
}
