const categories = [
  'Organisme de recherche',
  'Université',
  'Délégation régionale du CNRS',
  'Établissement public expérimental',
  'Grand établissement',
  'Institut ou école extérieur aux universités',
  "Grand établissement relevant d'un autre département ministériel",
  'Centre hospitalier',
  'Institut national polytechnique',
  "Délégation régionale de l'Inserm",
  'École normale supérieure',
  'Centre CEA',
  "École d'ingénieurs",
  'Administration publique',
  // 'Centre INRAE',
  // "Institution étrangère active en matière de recherche et d'innovation",
  // 'Organisation internationale',
  // 'Structure de recherche',
  // 'Organisme de financement de la recherche',
  // 'Centre de recherche Inria',
  // "Communauté d'universités et établissements expérimentale",
  // "Établissement supérieur d'architecture",
  // "Chambre de commerce et d'industrie",
  // "Communauté d'universités et établissements",
  // "Institut d'étude politique",
  // "Service d'administration centrale",
  // 'Conseil régional',
  // 'Autre structure',
  // 'Opérateur du programme 192 - Recherche et enseigne…t supérieur en matière économique et industrielle',
  // 'Infrastructure de recherche "étoile"',
  // 'Établissement public à caractère industriel et commercial',
  // 'Bibliothèque nationale',
  // "École nationale supérieure d'ingénieurs",
  // "Etablissement relevant d'un autre département ministériel rattaché à un EPSCP",
  // 'École de formation artistique',
  // 'Opérateur du programme 212 - Soutien de la politique de la défense',
  // "École habilitée à délivrer un diplôme d'ingénieur",
  // 'Centre de lutte contre le cancer',
  // 'Infrastructure de recherche candidate à la feuille de route 2026',
  // "Autre établissement d'enseignement supérieur",
  // 'École de formation agricole ou halieutique',
  // 'Établissement de santé',
  // 'Organisme lié à la recherche',
  // 'Site secondaire',
  // 'Établissement public national',
  // "École française à l'étranger",
  // 'Institut d’administration des entreprises',
  // 'Établissement public national de coopération à caractère administratif',
  // 'Entreprise',
  // 'Opérateur du programme 175 - Patrimoines',
  // 'Incubateur public',
  // 'Gouvernement',
  // "Instances de contrôle/d'évaluation",
  // 'Institut universitaire de technologie',
  // 'Etablissement tête de Cordée de la réussite relevant du MENJS',
  // 'Rectorat',
  // "École ou institut interne d'université, de grand établissement...",
  // "Association d'établissement (Loi ESR 2013)",
  // 'Cancéropôle',
  // 'Centre des œuvres universitaires et scolaires',
  // 'Direction régionale du Centre de coopération inter…le en recherche agronomique pour le développement',
  // "Fondation reconnue d'utilité publique",
  // 'École de commerce et de management',
  // 'École doctorale',
  // 'Établissement public de coopération culturelle (EPCC)',
]


const funders = ["ANR", "PIA ANR", "PIA hors ANR", "Horizon 2020", "Horizon Europe"];

const sortedFunders = {
  "anr": "#738cff",
  "pia anr": "#3f5ffc",
  "pia hors anr": "#182a3d",
  "horizon 2020": "#ffd500",
  "horizon europe": "#e39700",
};

const years: number[] = Array.from(Array(11).keys()).map((item) => item + 2015);

const formatCompactNumber = (number: number): string => {
  const formatter = Intl.NumberFormat("fr", { notation: "compact" });
  return formatter.format(number);
}

const getColorFromFunder = (funder: string): string => {
  const funderLowerCase = funder.toLowerCase();
  return Object.keys(sortedFunders).includes(funderLowerCase) ? sortedFunders[funderLowerCase] : "#ccc";
}

const getGeneralOptions = (title: string, categories: any[], title_x_axis: string, title_y_axis: string) => {
  return {
    chart: { height: "600px", type: "bar" },
    credits: { enabled: false },
    exporting: { enabled: false },
    title: { text: title },
    xAxis: { categories, title: { text: title_x_axis } },
    yAxis: { title: { text: title_y_axis } },
  };
}

export {
  categories,
  formatCompactNumber,
  funders,
  getColorFromFunder,
  getGeneralOptions,
  years,
};
