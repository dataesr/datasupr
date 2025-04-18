import HighchartsInstance from "highcharts";
import { CreateChartOptions } from "../../../../components/chart-faculty-members";

interface Field {
  year: string;
  fieldId: string;
  fieldLabel: string;
  maleCount: number;
  femaleCount: number;
  totalCount: number;
}

interface OptionsProps {
  fieldsData: Field[];
  selectedYear: string;
}

export default function OptionsTreemap({
  fieldsData,
  selectedYear,
}: OptionsProps): HighchartsInstance.Options | null {
  if (!fieldsData || fieldsData.length === 0) return null;

  // Filtrer les données pour l'année sélectionnée
  const yearData = fieldsData.filter((field) => field.year === selectedYear);

  if (yearData.length === 0) return null;

  // Transformer les données pour le treemap
  const treemapData = yearData.map((field) => ({
    name: field.fieldLabel,
    value: field.totalCount, // Utiliser le total (hommes + femmes)
    color: getColorForField(field.fieldId), // Fonction pour avoir une couleur par discipline
    // Ajouter des informations supplémentaires pour le tooltip
    customData: {
      maleCount: field.maleCount,
      femaleCount: field.femaleCount,
      totalCount: field.totalCount,
      fieldId: field.fieldId,
    },
  }));

  const newOptions: HighchartsInstance.Options = {
    chart: {
      type: "treemap",
      height: "500px", // Plus grand que le pie chart
    },
    title: {
      text: "Répartition par disciplines",
      style: { fontSize: "16px" },
    },
    subtitle: {
      text: `Année universitaire ${selectedYear}`,
      style: { fontSize: "12px" },
    },
    credits: {
      enabled: false,
    },
    tooltip: {
      pointFormat:
        "<b>{point.name}</b>: {point.value} personnes<br>" +
        "Hommes: {point.customData.maleCount} ({point.customData.maleCount/point.value:.1%})<br>" +
        "Femmes: {point.customData.femaleCount} ({point.customData.femaleCount/point.value:.1%})",
    },
    series: [
      {
        type: "treemap",
        layoutAlgorithm: "squarified",
        data: treemapData,
        dataLabels: {
          enabled: true,
          format: "{point.name}<br>{point.value}",
          style: {
            fontSize: "12px",
            textOutline: "none",
          },
        },
      },
    ],
    colorAxis: {
      minColor: "#FFFFFF",
      maxColor: "#1570AF", // Bleu DSFR
    },
  };

  return CreateChartOptions("treemap", newOptions);
}

// Fonction pour attribuer une couleur cohérente à chaque discipline
function getColorForField(fieldId: string): string {
  // Couleurs du DSFR ou palette adaptée
  const colorMap: Record<string, string> = {
    "1D": "#000091", // Droit - bleu france
    "2L": "#E4794A", // Lettres - orange
    "3S": "#169B62", // Sciences - vert menthe
    "4P": "#9C8AEF", // Pharmacie - violet
    "5M": "#CE614A", // Médecine - rouge
    "6O": "#A558A0", // Odontologie - violet clair
    "7G": "#8585F6", // Grands établissements - bleu clair
    "9X": "#929292", // Non spécifiée - gris
  };

  return colorMap[fieldId] || "#006A9E"; // Bleu par défaut si non trouvé
}
