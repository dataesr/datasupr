import { db } from "../../../../../services/mongo.js";

export const COLLECTION = "faculty-members_main_staging";
export const VALID_VIEWS = ["structure", "discipline", "region", "academie"];

export function getCollection() {
  return db.collection(COLLECTION);
}

export function buildMatchStage(view, id, year) {
  const match = {};
  if (year) match.annee_universitaire = year;
  if (!id) return match;

  const fieldMap = {
    structure: "etablissement_id_paysage",
    discipline: "code_grande_discipline",
    region: "etablissement_region",
    academie: "etablissement_academie",
  };
  if (fieldMap[view]) match[fieldMap[view]] = id;
  return match;
}

export async function getContextInfo(collection, view, id) {
  if (!id) return null;

  const fieldMap = {
    structure: "etablissement_id_paysage",
    discipline: "code_grande_discipline",
    region: "etablissement_region",
    academie: "etablissement_academie",
  };

  const doc = await collection.findOne(
    { [fieldMap[view]]: id },
    {
      projection: {
        etablissement_lib: 1,
        etablissement_actuel_lib: 1,
        etablissement_type: 1,
        etablissement_region: 1,
        etablissement_academie: 1,
        grande_discipline: 1,
      },
    }
  );
  if (!doc) return null;

  const base = {
    region: doc.etablissement_region,
    academie: doc.etablissement_academie,
    structure_type: doc.etablissement_type,
  };

  switch (view) {
    case "structure":
      return {
        ...base,
        id,
        name: doc.etablissement_actuel_lib || doc.etablissement_lib,
      };
    case "discipline":
      return { ...base, id, name: doc.grande_discipline || id };
    case "region":
      return { ...base, id, name: doc.etablissement_region || id };
    case "academie":
      return { ...base, id, name: doc.etablissement_academie || id };
    default:
      return null;
  }
}

export function buildStatusSwitch() {
  return {
    $switch: {
      branches: [
        {
          case: { $eq: ["$is_enseignant_chercheur", true] },
          then: "enseignant_chercheur",
        },
        {
          case: {
            $and: [
              { $eq: ["$is_titulaire", true] },
              { $eq: ["$is_enseignant_chercheur", false] },
            ],
          },
          then: "titulaire_non_chercheur",
        },
      ],
      default: "non_titulaire",
    },
  };
}
