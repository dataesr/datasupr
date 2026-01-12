import { DSFR_COLORS } from "./colors";

export const FORMATION_COLORS = {
  licence: DSFR_COLORS.blueCumulus,
  master: DSFR_COLORS.greenArchipel,
  doctorat: DSFR_COLORS.pinkTuile,

  iut: DSFR_COLORS.blueCumulus,
  ingenieur: DSFR_COLORS.yellowTournesol,
  sante: DSFR_COLORS.brownCaramel,

  dsa: DSFR_COLORS.greenEmeraude,
  llsh: DSFR_COLORS.pinkTuile,
  theo: DSFR_COLORS.purpleGlycine,
  si: DSFR_COLORS.orangeTerreBattue,
  staps: DSFR_COLORS.greenMenthe,
  veto: DSFR_COLORS.greenArchipel,
  interd: DSFR_COLORS.pinkMacaron,
};

export const FORMATION_BADGE_COLORS = {
  // Niveaux de cursus
  licence: "blue-cumulus",
  master: "green-archipel",
  doctorat: "pink-tuile",

  // Filières spécifiques
  iut: "blue-cumulus",
  ingenieur: "yellow-tournesol",
  sante: "green-emeraude",

  // Disciplines
  dsa: "yellow-tournesol",
  llsh: "pink-tuile",
  theo: "purple-glycine",
  si: "blue-cumulus",
  staps: "orange-terre-battue",
  veto: "green-archipel",
  interd: "pink-macaron",
} as const;
