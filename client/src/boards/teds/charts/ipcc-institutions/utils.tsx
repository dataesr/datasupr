import translations from "../../charts-config.json";
import { useQuery } from "@tanstack/react-query";

const { VITE_APP_SERVER_URL } = import.meta.env;

function getBuildQuery(bool, size) {
  return {
    size: 0,
    query: {
      bool,
    },
    aggs: {
      by_french_tutelles: {
        terms: {
          field: "french_tutelles.keyword",
          size,
        },
      },
    },
    track_total_hits: true,
  };
}

function useQueryResponse(body, s, i) {
  const { data, isLoading } = useQuery({
    queryKey: [`ipcc-references-${i}`],
    queryFn: () =>
      fetch(`${VITE_APP_SERVER_URL}/elasticsearch?index=teds-bibliography`, {
        body: JSON.stringify(getBuildQuery(body, s)),
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
        method: "POST",
      }).then((response) => response.json()),
  });

  return { data, isLoading };
}

function getLabel(graph, id, currentLang) {
  return translations?.[graph]?.[id]?.[currentLang] ?? id;
}

function getGeneralOptions(title, categories, title_x_axis, title_y_axis) {
  return {
    title: { text: title },
    chart: { type: "column" },
    legend: { enabled: false },
    plotOptions: {
      column: {
        colorByPoint: true,
        dataLabels: {
          enabled: true,
          format: "{point.y}",
        },
      },
    },
    xAxis: { categories, title: { text: title_x_axis } },
    yAxis: {
      title: { text: title_y_axis },
    },
    credits: {
      enabled: false,
    },
  };
}

const dict_ipcc_labs = {
  "Centre national de la recherche scientifique": "CNRS",
  "Université Paris-Saclay": "UP-S",
  "Université Versailles Saint-Quentin-en-Yvelines": "UVSQ",
  "Commissariat à l'énergie atomique et aux énergies alternatives": "CEA",
  "Institut de recherche pour le developpement": "IRD",
  "Université de Montpellier (EPE)": "UM",
  "Institut national de recherche pour l'agriculture, l'alimentation et l'environnement":
    "INRAE",
  "Sorbonne Université": "SU",
  "AgroParisTech (Inst Sc et Ind du Vivant et Environnement)": "AgroParisTech",
  "Muséum National d'Histoire Naturelle Paris": "MNHN",
  "Université Paris sciences et lettres": "PSL",
  "Université Toulouse 3 - Paul Sabatier": "UPS",
  "Ecole Pratique des Hautes Etudes Paris": "EPHE",
  "Institut Francais de Recherche pour l'Exploitation de la Mer": "IFREMER",
  "Université Grenoble Alpes": "UGA",
  "Météo France": "Météo France",
  "Centre National d'Etude Spatiales": "CNES",
  "Ecole Nationale Supérieure Météorologie Toulouse": "ENM",
  "Ecole des Ponts ParisTech": "ENPC",
  "Institut national d'enseignement supérieur pour l'agriculture, l'alimentation et l'environnement":
    "Institut Agro",
  "Université Paul Valéry Montpellier 3": "UPVM3",
  "Université Savoie Chambéry": "USC",
  "Laboratoire des sciences du climat et de l'environnement": "LSCE - UMR8212",
  "Laboratoire d'océanographie et du climat : expérimentations et approches numériques":
    "LOCEAN - UMR7159",
  "Institut des géosciences de l'environnement": "IGE - UMR5001",
  "Centre national de recherches météorologiques": "CNRM - UMR3589",
  "Laboratoire de météorologie dynamique": "LMD - UMR8539",
  "Centre International de Recherche sur l'Environnement et le Développement":
    "CIRED - UMR8568",
  "Laboratoire d'études en géophysique et océanographie spatiales":
    "LEGOS - UMR5566",
  "Centre européen de recherche et de formation avancée en calcul scientifique":
    "CERFACS - UMR5318",
  "Centre d'écologie fonctionnelle et évolutive": "CEFE - UMR5175",
  "Centre pour la biodiversité marine, l'exploitation et la conservation":
    "MARBEC - UMR9190/UMR248",
  "Laboratoire inter-universitaire des systèmes atmosphériques":
    "LISA - UMR7583",
  "Institut Universitaire Européen de la Mer": "IUEM - UMR 6539",
  "Écologie, systématique et évolution": "ESE - UMR8079",
  "Environnements et paléoenvironnements océaniques et continentaux":
    "EPOC - UMR5805",
  "Centre d'études spatiales de la biosphère": "CESBIO - UMR5126",
  "Biologie des organismes et écosystèmes aquatiques": "BOREA",
  "Laboratoire d'écologie alpine": "LECA",
  "Évolution et diversité biologique": "EDB",
  "Institut méditerranéen de biodiversité et d'écologie marine et continentale":
    "IMBE",
  "Maladies infectieuses et vecteurs : écologie, Génétique, évolution et contrôle":
    "MIVEGEC",
  "Institut des sciences de l'évolution de Montpellier": "ISEM",
  "Centre d'études biologiques de Chizé": "CEBC",
  Agroécologie: "Agroécologie",
  "Institut de biologie de l'école normale supérieure": "IBENS",
  "Centre de Cooperation Internationale en Recherche Agronomique pour le Developpement":
    "CIRAD",
};

export const lab_regions = {
  "Laboratoire des sciences du climat et de l'environnement": "Île-de-France",
  "Laboratoire d'océanographie et du climat : expérimentations et approches numériques":
    "Île-de-France",
  "Institut des géosciences de l'environnement": "Auvergne-Rhône-Alpes",
  "Centre national de recherches météorologiques": "Occitanie",
  "Laboratoire de météorologie dynamique": "Île-de-France",
  "Centre International de Recherche sur l'Environnement et le Développement":
    "Île-de-France",
  "Laboratoire d'études en géophysique et océanographie spatiales": "Occitanie",
  "Centre européen de recherche et de formation avancée en calcul scientifique":
    "Occitanie",
  "Centre d'écologie fonctionnelle et évolutive": "Occitanie",
  "Centre pour la biodiversité marine, l'exploitation et la conservation":
    "Occitanie",
  "Laboratoire inter-universitaire des systèmes atmosphériques":
    "Île-de-France",
  "Institut Universitaire Européen de la Mer": "Bretagne",
  "Écologie, systématique et évolution": "Île-de-France",
  "Environnements et paléoenvironnements océaniques et continentaux":
    "Nouvelle-Aquitaine",
  "Centre d'études spatiales de la biosphère": "Occitanie",
  "Biologie des organismes et écosystèmes aquatiques": "Île-de-France",
  "Laboratoire d'écologie alpine": "Auvergne-Rhône-Alpes",
  "Évolution et diversité biologique": "Occitanie",
  "Institut méditerranéen de biodiversité et d'écologie marine et continentale":
    "Provence-Alpes-Côte d'Azur",
  "Maladies infectieuses et vecteurs : écologie, Génétique, évolution et contrôle":
    "Occitanie",
  "Institut des sciences de l'évolution de Montpellier": "Occitanie",
  "Centre d'études biologiques de Chizé": "Nouvelle-Aquitaine",
  Agroécologie: "Bourgogne-Franche-Comté",
  "Institut de biologie de l'école normale supérieure": "Île-de-France",
  "Centre national de la recherche scientifique": "Organismes nationaux",
  "Institut de recherche pour le developpement": "Organismes nationaux",
  "Université Paris-Saclay": "Île-de-France",
  "Université Versailles Saint-Quentin-en-Yvelines": "Île-de-France",
  "Commissariat à l'énergie atomique et aux énergies alternatives":
    "Organismes nationaux",
  "Sorbonne Université": "Île-de-France",
  "Institut national de recherche pour l'agriculture, l'alimentation et l'environnement":
    "Organismes nationaux",
  "Institut national d'enseignement supérieur pour l'agriculture, l'alimentation et l'environnement":
    "Organismes nationaux",
  "Université Toulouse 3 - Paul Sabatier": "Occitanie",
  "Muséum National d'Histoire Naturelle Paris": "Île-de-France",
  "Université Grenoble Alpes": "Auvergne-Rhône-Alpes",
  "Université de Montpellier (EPE)": "Occitanie",
  "AgroParisTech (Inst Sc et Ind du Vivant et Environnement)": "Île-de-France",
  "Université Paris sciences et lettres": "Île-de-France",
  "Ecole Pratique des Hautes Etudes Paris": "Île-de-France",
  "Institut Francais de Recherche pour l'Exploitation de la Mer": "Bretagne",
  "Météo France": "Occitanie",
  "Centre National d'Etude Spatiales": "Occitanie",
  "Ecole Nationale Supérieure Météorologie Toulouse": "Occitanie",
  "Ecole des Ponts ParisTech": "Île-de-France",
  "Université Paul Valéry Montpellier 3": "Occitanie",
  "Université Savoie Chambéry": "Auvergne-Rhône-Alpes",
  "Centre de Cooperation Internationale en Recherche Agronomique pour le Developpement":
    "Organismes nationaux",
};

const regions_colors = {
  "Organismes nationaux": "#05445E",
  "Île-de-France": "#BE2125",
  "Auvergne-Rhône-Alpes": "#8B4513",
  Occitanie: "#32CD32",
  "Provence-Alpes-Côte d'Azur": "#FFFF00",
  Bretagne: "#4169E1",
  "Nouvelle-Aquitaine": "#808080",
  "Bourgogne-Franche-Comté": "orange",
};

function getSeries(data, useAcronyms) {
  const series = (data?.aggregations?.by_french_tutelles?.buckets ?? []).map(
    (item) => ({
      color: regions_colors[lab_regions[item.key]] ?? "#cccccc",
      name: useAcronyms ? dict_ipcc_labs[item.key] ?? item.key : item.key,
      y: item.doc_count,
    })
  );

  const categories = series.map(
    (french_tutelles) => `${french_tutelles.name} <br> (${french_tutelles.y})`
  );

  return { series, categories };
}

function getOptions(
  series,
  categories,
  title,
  format1,
  format2,
  title_x_axis,
  title_y_axis
) {
  const generalOptions = getGeneralOptions(
    title,
    categories,
    title_x_axis,
    title_y_axis
  );
  return {
    ...generalOptions,
    tooltip: {
      format: `<b>{point.name}</b> ${format1} <b>{point.y}</b> ${format2}`,
    },
    series: [{ data: series }],
  };
}

function renderRegionLegend() {
  const legendStyle: React.CSSProperties = {
    display: "flex",
    flexWrap: "wrap",
    listStyle: "none",
    padding: 0,
    margin: "1rem 0",
    gap: "12px",
  };

  const itemStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    fontSize: "0.9rem",
    whiteSpace: "nowrap",
  };

  const dotStyle = (color: string): React.CSSProperties => ({
    display: "inline-block",
    width: 10,
    height: 10,
    borderRadius: "50%",
    backgroundColor: color,
    marginRight: 6,
  });
  return (
    <ul style={legendStyle}>
      {Object.entries(regions_colors).map(([region, color]) => (
        <li key={region} style={itemStyle}>
          <span style={dotStyle(color)}></span>
          {region}
        </li>
      ))}
    </ul>
  );
}
export {
  getSeries,
  getOptions,
  useQueryResponse,
  getLabel,
  renderRegionLegend,
};
