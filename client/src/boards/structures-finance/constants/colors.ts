export const DSFR_COLORS = {
  blueFrance: "var(--blue-france-sun-113-625)",
  blueEcume: "var(--blue-ecume-sun-247)",
  blueCumulus: "var(--blue-cumulus-sun-368)",

  greenTilleul: "var(--green-tilleul-verveine-sun-418)",
  greenBourgeon: "var(--green-bourgeon-sun-425)",
  greenEmeraude: "var(--green-emeraude-sun-425)",
  greenMenthe: "var(--green-menthe-sun-373)",
  greenArchipel: "var(--green-archipel-sun-391)",

  pinkMacaron: "var(--pink-macaron-sun-406)",
  pinkTuile: "var(--pink-tuile-sun-425)",

  yellowTournesol: "var(--yellow-tournesol-sun-407)",
  yellowMoutarde: "var(--yellow-moutarde-sun-348)",
  orangeTerreBattue: "var(--orange-terre-battue-sun-370)",

  brownCafeCreme: "var(--brown-cafe-creme-sun-383)",
  brownCaramel: "var(--brown-caramel-sun-425)",
  brownOpera: "var(--brown-opera-sun-395)",
  beigeGrisGalet: "var(--beige-gris-galet-sun-407)",

  purpleGlycine: "var(--purple-glycine-sun-319)",

  textDefault: "var(--text-default-grey)",
  textActionHigh: "var(--text-action-high-grey)",
  borderDefault: "var(--border-default-grey)",
  backgroundDefault: "var(--background-default-grey)",
  backgroundDefaultHover: "var(--background-default-grey-hover)",
  backgroundAlt: "var(--background-alt-grey)",
  backgroundContrastBlueCumulus: "var(--background-contrast-blue-cumulus)",

  greenTilleul850: "var(--green-tilleul-verveine-850)",
  greenBourgeon850: "var(--green-bourgeon-850)",
  greenEmeraude850: "var(--green-emeraude-850)",
  greenMenthe850: "var(--green-menthe-850)",
  greenArchipel850: "var(--green-archipel-850)",
  blueEcume850: "var(--blue-ecume-850)",
  blueCumulus850: "var(--blue-cumulus-850)",
  purpleGlycine850: "var(--purple-glycine-850)",
  pinkMacaron850: "var(--pink-macaron-850)",
  pinkTuile850: "var(--pink-tuile-850)",
  yellowTournesol850: "var(--yellow-tournesol-850)",
  yellowMoutarde850: "var(--yellow-moutarde-850)",
  orangeTerreBattue850: "var(--orange-terre-battue-850)",
  brownCafeCreme850: "var(--brown-cafe-creme-850)",
  brownCaramel850: "var(--brown-caramel-850)",
  brownOpera850: "var(--brown-opera-850)",
  beigeGrisGalet850: "var(--beige-gris-galet-850)",
} as const;

export const CHART_COLORS = {
  primary: DSFR_COLORS.blueCumulus,
  secondary: DSFR_COLORS.greenArchipel,
  tertiary: DSFR_COLORS.pinkTuile,
  quaternary: DSFR_COLORS.purpleGlycine,

  palette: [
    DSFR_COLORS.blueCumulus,
    DSFR_COLORS.greenEmeraude,
    DSFR_COLORS.pinkTuile,
    DSFR_COLORS.yellowMoutarde,
    DSFR_COLORS.greenBourgeon,
    DSFR_COLORS.orangeTerreBattue,
    DSFR_COLORS.greenMenthe,
    DSFR_COLORS.brownCaramel,
    DSFR_COLORS.greenArchipel,
    DSFR_COLORS.pinkMacaron,
    DSFR_COLORS.yellowTournesol,
    DSFR_COLORS.brownOpera,
  ],

  paletteLegere: [
    DSFR_COLORS.blueCumulus850,
    DSFR_COLORS.greenEmeraude850,
    DSFR_COLORS.pinkTuile850,
    DSFR_COLORS.yellowMoutarde850,
    DSFR_COLORS.purpleGlycine850,
    DSFR_COLORS.orangeTerreBattue850,
    DSFR_COLORS.greenMenthe850,
    DSFR_COLORS.brownCaramel850,
    DSFR_COLORS.greenArchipel850,
    DSFR_COLORS.pinkMacaron850,
    DSFR_COLORS.yellowTournesol850,
    DSFR_COLORS.brownOpera850,
  ],
} as const;

export const METRIC_COLORS = {
  effectifs: DSFR_COLORS.blueCumulus,
  effectifsLicence: DSFR_COLORS.blueCumulus850,
  effectifsMaster: DSFR_COLORS.pinkTuile,
  effectifsDoctorat: DSFR_COLORS.orangeTerreBattue,

  scsp: DSFR_COLORS.blueCumulus,
  ressourcesPropres: DSFR_COLORS.greenArchipel,
  droitsInscription: DSFR_COLORS.greenMenthe,
  chargesPersonnel: DSFR_COLORS.pinkTuile,
  produitsFonctionnement: DSFR_COLORS.orangeTerreBattue,

  anr: DSFR_COLORS.purpleGlycine,
  subventionsUE: DSFR_COLORS.blueCumulus,
  contratsRecherche: DSFR_COLORS.blueEcume,

  tauxEncadrement: DSFR_COLORS.greenEmeraude,
  emploiEtpt: DSFR_COLORS.brownCaramel,

  formationContinue: DSFR_COLORS.pinkTuile,
  taxeApprentissage: DSFR_COLORS.yellowMoutarde,

  autresRessources: DSFR_COLORS.beigeGrisGalet,
  autresSubventions: DSFR_COLORS.brownOpera,
} as const;

export const CARD_COLORS = {
  effectifs: {
    color: DSFR_COLORS.blueCumulus,
    background: DSFR_COLORS.blueCumulus850,
  },
  finances: {
    color: DSFR_COLORS.greenArchipel,
    background: DSFR_COLORS.greenArchipel850,
  },
  personnel: {
    color: DSFR_COLORS.pinkTuile,
    background: DSFR_COLORS.pinkTuile850,
  },
  recherche: {
    color: DSFR_COLORS.purpleGlycine,
    background: DSFR_COLORS.purpleGlycine850,
  },
} as const;
